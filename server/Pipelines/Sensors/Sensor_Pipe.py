
## --------------------------------------------------------------- ##
##                      Pipeline Libraries                         ##
## --------------------------------------------------------------- ##
import xarray as xr
import numpy as np
import pandas as pd
import datetime
from dask import delayed, compute

import s3fs

from io import BytesIO
import itertools

import orjson


import matplotlib.pyplot as plt

# Visualize gridded array as a PNG image
from matplotlib import colormaps
from matplotlib.colors import Normalize
import matplotlib.cm as cm
from PIL import Image
from io import BytesIO
import os


## --------------------------------------------------------------- ##
##               Sensor Hourly Data Pipeline Class                 ##
## --------------------------------------------------------------- ##
class Sensor_Pipe :
    def __init__(self, 
                 file_name = 'combined.nc'
                ) :
        self.file_name = file_name



    ## =============================================================== ##
    ##      Lazily Load and Create Task Graph for Combined Dataset     ##
    ## =============================================================== ##
    def open_single_file(self, file_path, lon, lat, start_date, end_date, climate_var):
        
        # Lazily load the NetCDF file --> Load data in 50-hour chunks, not
        # caching anything to memory
        ds = xr.open_dataset(
            self.file_name,
            chunks = {'time': 50},  # Lazily loaded data --> loading in pieces at a time
            engine = 'h5netcdf',
            cache = False,
            decode_timedelta = True,
            decode_coords = True,
        )

        # Query the lazily-loaded NetCDF file in this specific order to make a task graph:
        # Minimize the amount of data we have to work with
        # (1) Select climate attribute ,
        # (2) Select time interval ,
        # (3) Select nearest (Lon, Lat) location
        climate_ds = ds[climate_var].sel(
            time = slice(start_date, end_date)
        ).sel(
            west_east = lon,
            south_north = lat,
            method = 'nearest'
        )

        # Processing on temperature: Convert from Kelvin --> Fahrenheit
        if climate_var == 'td2m' :
            climate_ds = (climate_ds * (9/5)) - 459.67

        # Return the delayed-object (task graph) to the main method
        return climate_ds


    
    
    ## =================================================================================== ##
    ##  Generate Time-Series for Pixel: Create Delayed Object and Compute its Task Graph   ##
    ## =================================================================================== ##
    def generate_time_series(self, lon, lat, start_year=2020, start_month=3, start_day=1, end_year=2020, end_month=9, end_day=1, climate_var='td2m') :

        # Specify the start date -> (year, month day)
        start_date = datetime.datetime(int(start_year), int(start_month), int(start_day))
        # Specify the end date -> (year, month, day)
        end_date = datetime.datetime(int(end_year), int(end_month), int(end_day))
        
        # Retrieve relevant files and place inside of a list
        all_files = [self.file_name]

        # Compute the lazily-loaded dataset using the task graph generate in the method `self.open_single_file()`
        datasets = [delayed(self.open_single_file)(file, lon, lat, start_date, end_date, climate_var) for file in all_files]
        combined_ds = compute(*datasets)  # Compute to filter, find, and load in the filtered data

        # Concatenate the data by time dimension --> return as Xarray object
        final_ds = xr.concat(combined_ds, dim='time')

        # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #
        # Extract the data values and time values as seperate lists, store in JSON-object
        # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #
        # Extract all time markers (values), convert to datetime objects, then to list containing strings
        time_list = pd.to_datetime(final_ds.time.values).strftime('%Y-%m-%d %H:%M').tolist()

        # Extract all data values, convert to a list containing data
        data_values_list = final_ds.values.tolist()

        # Store lists of (1) time values and (2) data values inside of a Python dictionary object
        json_df = {
            'STATUS' : 'SUCCESS' ,
            'DATES' : time_list ,
            'DATA' : data_values_list
        }

        # Serialize the Python Dictionary object to JSON using the orjson (fast serialization) library
        return json_df


    

    ## =================================================================================== ##
    ##  Visualize Entire Gridded Array: Retrieve and Compute Specific Hourly Array    ##
    ## =================================================================================== ##
    def generate_hour_vis(self, year, month, day, hour, climate_var='td2m') :

        # User-specified (submitted) date -> (year, month, day)
        user_datetime = datetime.datetime(int(year), int(month), int(day), int(hour))    

        # Lazily load the combined dataset and chunk data by 1-hour
        ds = xr.open_dataset(
            self.file_name,
            chunks={'time': 1},
            engine='h5netcdf',
            cache=False
        )

        # Query the lazily-loaded data in this order to create a task graph:
        # (1) Select climate attribute ,
        # (2) Select time interval ,
        climate_ds = ds[climate_var].sel(
            time = user_datetime,
            method='nearest',
        )
        
        # Processing on temperature: Convert from Kelvin --> Fahrenheit
        if climate_var == 'td2m' :
            climate_ds = (climate_ds * (9/5)) - 459.67

        # Compute the task graph for the delayed-object, return the computed array
        return climate_ds.compute()




    def produce_vis_json(
        self, array, vmin, vmax, cmap='turbo', longitude='west_east', latitude='south_north',
    ) :

        # Normalize values for the plot and legend
        norm_values = Normalize(
            vmin=vmin, vmax=vmax,
        )
        
        # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #
        # Create the Climate Variable PNG (RGB) Image and Serialize to JSON-Structure
        # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #
        rgba_image = colormaps[cmap](norm_values(array))
        alpha_channel = np.ones(array.shape)
        alpha_channel[(np.isnan(array))] = 0
        rgba_image[:, :, 3] = alpha_channel
        rgba_image = (rgba_image * 255).astype(np.uint8)  # [0, 255] represents the colors
        rgba_image = rgba_image[::-1, :]


        return {
            'STATUS': 'SUCCESS' ,
            'climate_var_image' : rgba_image.flatten().tolist() ,  # Flatten image to vector, convert to list
            'climate_var_values' : np.around(array[::-1, :].values.flatten(), 2).tolist() ,  # Extract actual data, flatten to list
            'bounds' : [
                array[longitude].min().item(), array[latitude].min().item(), 
                array[longitude].max().item(), array[latitude].max().item(),
            ],  # Calculate the bounding box for the data
            'height': array.sizes[latitude],  # Number of pixels (height) for the data
            'width': array.sizes[longitude],  # Numnber of pixels (width) for the data
        }