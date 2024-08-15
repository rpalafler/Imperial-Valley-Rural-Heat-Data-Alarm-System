// --------------------------------------------------------------------------------------- //
//  DeckGL 3D-Environment Component with Layer Overlays for MainApp DeckInterface          //
// ~ 3D-Environment for Imperial Valley with Viewing Optimizations ~                       //
// --------------------------------------------------------------------------------------- //
//  Ryan Paul Lafler, M.Sc.                                                                //
//  Copyright 2024 by Ryan Paul Lafler and Premier Analytics Consulting, LLC.              //
//  E-mail: rplafler@premier-analytics.com                                                 //
// --------------------------------------------------------------------------------------- //

// Import React Hooks
import { useState, useEffect, useContext } from 'react' ;

// CSS Stylesheet for Component
import styles from './Env3D.module.css' ;

// DeckGL Layer Components
import { DeckGL, CompositeLayer } from 'deck.gl' ;
import { MapView, COORDINATE_SYSTEM } from '@deck.gl/core' ;
import { Tile3DLayer, TerrainLayer } from "@deck.gl/geo-layers" ;
import { BitmapLayer } from '@deck.gl/layers' ;
import { ParticleLayer } from 'deck.gl-particle' ;
import {_TerrainExtension as TerrainExtension, CollisionFilterExtension} from '@deck.gl/extensions';

// Data Context Imports
import { ClimateDataContext } from '../../MainApp' ;
import { RTMAContext } from '../../MainApp' ;

/* Visualize Gridded Datasets */
import GL from '@luma.gl/constants';
import { setParameters, withParameters, Geometry } from '@luma.gl/core';



/* Limit Active Viewport to a Bounding Box Determined by Zoom Level and Total Square Miles */
const MILES_TO_DEGREES_LAT = 1 / 69; // Approximate conversion for latitude
const MILES_TO_DEGREES_LNG = 1 / 54.6; // Approximate conversion for longitude at mid-latitude

function calculateBoundingBox(center, zoom) {
    var latDistance = 0 ;
    var lngDistance = 0 ;
    if (zoom < 8){
        latDistance = 250 * MILES_TO_DEGREES_LAT;
        lngDistance = 250 * MILES_TO_DEGREES_LNG;
    } else if(zoom < 10 && zoom >= 8){
        latDistance = 100 * MILES_TO_DEGREES_LAT;
        lngDistance = 100 * MILES_TO_DEGREES_LNG;
    } else if(zoom < 13 && zoom >= 10){
        latDistance = 50 * MILES_TO_DEGREES_LAT;
        lngDistance = 50 * MILES_TO_DEGREES_LNG;
    } else if(zoom < 16 && zoom >= 13){
        latDistance = 20 * MILES_TO_DEGREES_LAT;
        lngDistance = 20 * MILES_TO_DEGREES_LNG;
    } else if(zoom < 19 && zoom >= 16){
        latDistance = 10 * MILES_TO_DEGREES_LAT;
        lngDistance = 10 * MILES_TO_DEGREES_LNG;
    } else {
        latDistance = 5 * MILES_TO_DEGREES_LAT;
        lngDistance = 5 * MILES_TO_DEGREES_LNG;
    }
  
    return [
        center[0] - lngDistance, // minLongitude
        center[1] - latDistance, // minLatitude
        center[0] + lngDistance, // maxLongitude
        center[1] + latDistance  // maxLatitude
    ];
}


function Env3D() {
    // Load Context into Component //
    const climateDataContext = useContext(ClimateDataContext) ;
    const rtmaContext = useContext(RTMAContext) ;

    const [satelliteTileLayer, setSatelliteTileLayer] = useState(null) ;
    const [originalView, setOriginalView] = useState({
        longitude: -115.76,
        latitude: 33.032,
        zoom: 11,
        pitch: 60.5,
        bearing: -35,
    });
    const [zoomLevel, setZoomLevel] = useState(originalView.zoom) ;
    const [tileLayer, setTileLayer] = useState(sessionStorage.getItem("basemap")) ;

    const [boundingBox, setBoundingBox] = useState(calculateBoundingBox([originalView.longitude, originalView.latitude], zoomLevel))
    // const boundingBox = [-118.5, 32.2, -114.5, 35];

    const onViewStateChange = ({ viewState }) => {
        setZoomLevel(viewState.zoom) ;
    };


    const elevationLayer = new TerrainLayer({
        id: "terrain",
        visible: true,
        tileSize: 512,
        extent: boundingBox,
        refinementStrategy: 'no-overlap',
        maxRequests: 256,
        elevationDecoder: {
            rScaler: 258,
            gScaler: 1,
            bScaler: 1 / 265,
            offset: -32768,
        },
        tesselator: 'auto',
        elevationData: `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png` ,
        texture: [
            // `https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}`,
            `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}`,
        ],
        loadOptions: {maxConcurrency: 24},
        getPolygonOffset: false,
        pickable: false,
        maxCacheSize: 2500,
        wireframe: false,
        color: [255, 255, 255],
        material: true,
        meshMaxError: 3,
        //modelMatrix: new Matrix4().translate([0, 0, -100]),
        operation: 'terrain+draw',
        maxZoom: 13,
        parameters: {
            depthTest: true,
            cull: true,
        },
    }) ;



    const [hoverInfo, setHoverInfo] = useState(null) ;
    const handleHover = (info, event) => {
        if (info && info.bitmap && info.bitmap.pixel && info.bitmap.size) {
            const pixelX = info.bitmap.pixel[0];
            const pixelY = info.bitmap.pixel[1];
            const pixelWidth = info.bitmap.size.width;
            const index = pixelY * pixelWidth + pixelX;
      
            setHoverInfo({
              x: event.center.x,
              y: event.center.y,
              lon: info.coordinate[0],
              lat: info.coordinate[1],
              temperature: rtmaContext.rtmaData['climate_var_values'][index],
            });

            // console.log(event, rtmaContext.rtmaData['climate_var_values'][index]) ;
          } else {
            setHoverInfo(null);
          }
    }
    const rtma_temp = new BitmapLayer({
        id: "rtma-climate-var",
        display: rtmaContext.rtmaData ? true : false,
        visible: climateDataContext.climateDataOn['rtma'] === true ? true : false,
        extent: boundingBox,
        bounds: rtmaContext.rtmaData ? rtmaContext.rtmaData['bounds'] : null,
        image: rtmaContext.rtmaData ? rtmaContext.rtmaData['climate_var_image'] : null,
        _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        maxCacheSize: 250,
        opacity: 0.2575,
        pickable: true,
        wrapLongitude: true,
        onHover: handleHover,
        textureParameters: {
            [GL.TEXTURE_MIN_FILTER]: GL.LINEAR_MIPMAP_LINEAR,
            [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
            [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
            [GL.TEXTURE_MAX_LOD]: 1,
            [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
        },
        onAfterRender: ({gl}) => {
            setParameters(gl, {
                generateMipmaps: false,
                anisotropicFiltering: false
            });
        },
        parameters: {
            depthTest: false,
            cull: false,
        },
        extensions: [new TerrainExtension()],
    }) ;


    const rtma_winds = new ParticleLayer({
        id: 'rtma-winds',
        display: rtmaContext.rtmaData ? true : false,
        visible: climateDataContext.climateDataOn['rtma'] === true ? true : false,
        extent: boundingBox,
        bounds: rtmaContext.rtmaData ? rtmaContext.rtmaData['bounds'] : null,
        imageUnscale: [-128, 127],
        image: rtmaContext.rtmaData ? rtmaContext.rtmaData['wind_image'] : null,
        _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        pickable: false,
        maxCacheSize: 100,
        numParticles: 70, // number
        maxAge: 20, // number
        speedFactor: 50, // number
        color: [255, 255, 255], // [number, number, number]
        width: 17.55, // number
        opacity: 0.9999, // number
        wrapLongitude: true,
        parameters: {
            depthTest: false,
            cull: false,
        },
        extensions: [new TerrainExtension()],
    })


    return(
        <>
        <DeckGL
            views={new MapView({
                repeat: false,
            })}
            layers={[
                elevationLayer,
                climateDataContext.climateDataOn['rtma'] === true ? rtma_temp : null ,
                climateDataContext.climateDataOn['rtma'] === true ? rtma_winds : null ,
            ]}
            useDevicePixels={false}
            initialViewState={originalView}
            onViewStateChange={({viewState}) => {
                setZoomLevel(viewState.zoom) ;
                if ((originalView.longitude !== viewState.longitude) && (originalView.latitude !== viewState.latitude)){
                    const boundingBox = calculateBoundingBox([viewState.longitude, viewState.latitude], viewState.zoom); // 20 miles
                    setBoundingBox(boundingBox) ;
                }
            }}
            controller={{ maxPitch: 88, maxZoom: 21 }}
            parameters={{
                clearColor: [0, 0, 0, 255],
            }}
        />
        {hoverInfo && (
            <div
            style={{
                position: 'absolute',
                maxWidth: '15rem',
                fontSize: '1.5rem',
                fontWeight: '600',
                letterSpacing: '0.07rem',
                left: hoverInfo.x,
                top: hoverInfo.y + 10, // Position above the cursor
                marginTop: '-10rem',
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                padding: '0.75rem',
                borderRadius: '1rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                pointerEvents: 'none', // Prevent the tooltip from interfering with hover events
            }}>
                <div>Lon: {hoverInfo.lon.toFixed(3)}</div>
                <div>Lat: {hoverInfo.lat.toFixed(3)}</div>
                <div>Temp: {hoverInfo.temperature}°F</div>
            </div>
        )}
        </>
    ) ;
}

export default Env3D ;