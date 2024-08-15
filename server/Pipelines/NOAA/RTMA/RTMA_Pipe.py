## --------------------------------------------------------------------------------------- ##
##  NOAA's Real-Time Mesoscale Analysis (RTMA) Data Pipeline                               ##
## ~ Pipeline Class, Methods, and JSON-Compatible Encoding ~                               ##
## --------------------------------------------------------------------------------------- ##
##  Ryan Paul Lafler, M.Sc.                                                                ##
##  Copyright 2024 by Ryan Paul Lafler and Premier Analytics Consulting, LLC.              ##
##  E-mail: rplafler@premier-analytics.com                                                 ##
## --------------------------------------------------------------------------------------- ##


## --------------------------------------------------------------- ##
##                      Pipeline Libraries                         ##
## --------------------------------------------------------------- ##
# Import Array Manipulation Libraries
import numpy as np
from scipy.interpolate import griddata
# Dask --> Parallelized Computation
from dask import delayed, compute
# Xarray --> Spatiotemporal Multidimensional Array Library
import xarray as xr
# Cloud Object Storage Libraries and APIs
import fsspec
from boto3 import client as b3_client
from botocore import UNSIGNED
from botocore.client import Config
# Generate Raw PNG Images of Climate Data
import matplotlib.pyplot as plt
from matplotlib import colormaps
from matplotlib.colors import Normalize
import matplotlib.cm as cm
from PIL import Image
from io import BytesIO


## --------------------------------------------------------------- ##
##            RTMA Hourly Data Pipeline Python Class               ##
## --------------------------------------------------------------- ##
class RTMA_Data_Pipe:
    def __init__(self, bucket='noaa-rtma-pds'):
        self.s3_bucket = bucket
        self.s3_fs = fsspec.filesystem('s3', anon=True)
        self.s3_url = f's3://{self.s3_bucket}/'

    def list_files(self, prefix='') -> list :
        # List files in the S3 bucket with the given prefix
        try:
            all_paths = self.s3_fs.ls(f'{self.s3_url}{prefix}')
            # Filter out directory paths
            file_paths = [path for path in all_paths if not path.endswith('/')]
        except:
            file_paths = []
        finally:
            return file_paths


    def process_filter_key(self, temp_path, filter_key, ) -> dict :
        try:
            ds = xr.open_dataset(
                temp_path, engine='cfgrib', 
                chunks={'time': 1}, 
                backend_kwargs={'filter_by_keys': filter_key}
            )
        except Exception as e:
            index_file = temp_path + ".idx"
            if os.path.exists(index_file):
                os.remove(index_file)
            ds = xr.open_dataset(
                temp_path, engine='cfgrib', 
                chunks={'time': 1}, 
                backend_kwargs={'filter_by_keys': filter_key}
            )
        
        ds.coords['longitude'] = (ds.coords['longitude'] + 180) % 360 - 180

        # ########################################
        #           Re-Gridding Process          #
        # ########################################
        # Extract (longitude, latitude) coordinates from multi-dimensional array
        longitude = ds['longitude'].values  # 2D array (y, x)
        latitude = ds['latitude'].values  # 2D array (y, x)
        lon_min, lon_max = longitude.min(), longitude.max()
        lat_min, lat_max = latitude.min(), latitude.max()
        points = np.column_stack((longitude.flatten(), latitude.flatten()))
        
        lon_new = np.linspace(lon_min, lon_max, ds.sizes['x'])  # or the desired resolution
        lat_new = np.linspace(lat_min, lat_max, ds.sizes['y'])  # or the desired resolution
        lon_new_grid, lat_new_grid = np.meshgrid(lon_new, lat_new)
        
        # Create DataArrays for the Longitude & Latitude Coordinates
        lon_da = xr.DataArray(lon_new, dims=['x'], name='longitude', attrs={'units': 'degrees_east'})
        lat_da = xr.DataArray(lat_new, dims=['y'], name='latitude', attrs={'units': 'degrees_north'})
        
        var_names = list(ds.data_vars.keys()) 
        regridded_data = []
        for var_name in var_names :
            values_grid = griddata(points, ds[var_name].values.flatten(), (lon_new_grid, lat_new_grid), method='nearest')
            values_da = xr.DataArray(values_grid, dims=['y', 'x'], name=var_name, coords={'longitude': lon_da, 'latitude': lat_da},)
            regridded_data.append(values_da)

        return regridded_data



    def retrieve_hourly_dask(self, year, month, day, hour) -> xr.Dataset :
        combined_ds = None
        prefix = f'rtma2p5.{year}{month}{day}/rtma2p5.t{hour}z.2dvaranl_ndfd.grb2'
        file_list = self.list_files(prefix=prefix)
        
        if len(file_list) == 0 :
            prefix = f'rtma2p5.{year}{month}{day}/rtma2p5.t{hour}z.2dvaranl_ndfd.grb2_wexp'
            file_list = self.list_files(prefix=prefix)
            
            if len(file_list) == 0 :
                prefix = f'rtma2p5.{year}{month}{day}/rtma2p5.t{hour}z.2dvarges_ndfd.grb2_wexp'
                file_list = self.list_files(prefix=prefix)
                
        temp_uri_list = [f'simplecache::s3://{file}' for file in file_list]
        temp_path_list = [fsspec.open_local(temp_uri, s3={'anon': True}) for temp_uri in temp_uri_list]
        
        filter_keys = [
            {'typeOfLevel': 'heightAboveGround', 'level': 10, 'shortName': '10u'},
            {'typeOfLevel': 'heightAboveGround', 'level': 10, 'shortName': '10v'},
            {'shortName': '2t'},
        ]

        delayed_tasks = []
        for temp_path in temp_path_list:
            for filter_key in filter_keys:
                delayed_task = delayed(self.process_filter_key)(temp_path, filter_key)
                delayed_tasks.append(delayed_task)
            
        # Compute all tasks in parallel
        results = compute(*delayed_tasks)

        # Combine results into a single dataset
        combined_ds = sum(results, [])
        
        # Slice the entire array to only return Southern California extent
        lon_mask = (combined_ds[0].longitude > -118.5) & (combined_ds[0].longitude < -114.5)
        lat_mask = (combined_ds[0].latitude > 32.2) & (combined_ds[0].latitude < 35)
        for i in range(0, len(combined_ds)) :
            combined_ds[i] = combined_ds[i].where(
                lon_mask & lat_mask, 
                drop=True
            )

        # Clear system cache from fsspec S3 connection and update pipeline to reflect S3 content
        self.s3_fs.invalidate_cache()
        self.s3_fs.clear_instance_cache()
        
        return combined_ds


    def create_wind_image(self, u_component, v_component) -> np.array :
        # Normalize the U and V components to 0-255
        u_norm = ((u_component + 128) / (127 + 128) * 255).astype(np.uint8)
        v_norm = ((v_component + 128) / (127 + 128) * 255).astype(np.uint8)

        # Calculate the wind magnitude
        alpha_channel = np.full(u_component.shape, 255, dtype=np.uint8)
        
        # Combine U and V components into an RGB image
        wind_image = np.zeros((u_component.shape[0], u_component.shape[1], 4), dtype=np.uint8)
        wind_image[..., 0] = u_norm  # Red channel for U component
        wind_image[..., 1] = v_norm  # Green channel for V component
        wind_image[..., 2] = v_norm  # Blue channel can be zeros
        wind_image[..., 3] = alpha_channel

        buffer = BytesIO()
        img = Image.fromarray(wind_image)
        img.save(buffer, format="PNG")
        buffer.seek(0)
        image_array = np.array(Image.open(buffer))
        image_array = image_array[::-1, :]
        buffer.close()
        
        return image_array
    
    

    def produce_vis_json(self, u, v, climate_var, vmin=0, vmax=120, cmap='turbo', 
                    longitude='longitude', latitude='latitude',
                    size_x='x', size_y='y') -> dict :
    
        # Normalize values for the plot and legend
        norm_values = Normalize(
            vmin=vmin, vmax=vmax,
        )
        
        # Separate figure for displaying the legend:
        fig_cbar, ax_cbar = plt.subplots(nrows=1, ncols=1, figsize=(1, 11))
        sm = plt.cm.ScalarMappable(cmap=cmap, norm=norm_values)
        sm.set_array([])  # Required for ScalarMappable, even if empty
        # Add colorbar to the figure
        cbar = fig_cbar.colorbar(sm, cax=ax_cbar, orientation='vertical')
        cbar.set_label('Temperature (°F)', rotation=90, labelpad=15, va='center', fontsize=18)
        cbar.ax.yaxis.set_label_position('left')
        cbar.ax.tick_params(labelsize=13)
        # Save the colorbar figure to an in-memory file
        buffer_legend = BytesIO()
        fig_cbar.savefig(buffer_legend, format='png', bbox_inches='tight', pad_inches=0.1)
        plt.close(fig_cbar)  # Close the figure after saving to release memory
        buffer_legend.seek(0)
        image_legend = Image.open(buffer_legend)
        legend_array = np.array(image_legend)
        buffer_legend.close()
        
        # Climate Variable Image
        array = climate_var
        array = (array - 273.15) * (9/5) + 32
        rgba_image = colormaps[cmap](norm_values(array))
        alpha_channel = np.ones(array.shape)
        alpha_channel[(np.isnan(array))] = 0
        rgba_image[:, :, 3] = alpha_channel
        rgba_image = (rgba_image * 255).astype(np.uint8)  # [0, 255] represents the colors
        rgba_image = rgba_image[::-1, :]


        # Wind Image
        wind_image = self.create_wind_image(
            u,
            v,
        )
        
        return {
            'climate_var_image': rgba_image.flatten().tolist(),
            'climate_var_values': np.around(array[::-1, :].values.flatten(), 2).tolist(),
            'wind_image': wind_image.flatten().tolist(),
            'legend_array' : legend_array.flatten().tolist(),
            'bounds' : [
                array[longitude].min().item(), array[latitude].min().item(), 
                array[longitude].max().item(), array[latitude].max().item(),
            ],
            'height': array.sizes[size_y],
            'width': array.sizes[size_x],
        }