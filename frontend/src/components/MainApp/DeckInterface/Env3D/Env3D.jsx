import { useState, useEffect, useContext } from 'react' ;

import styles from './Env3D.module.css' ;

// DeckGL Layer Components
import { DeckGL, CompositeLayer } from 'deck.gl' ;
import { MapView } from '@deck.gl/core' ;
import { Tile3DLayer, TerrainLayer } from "@deck.gl/geo-layers" ;
import {_TerrainExtension as TerrainExtension, CollisionFilterExtension} from '@deck.gl/extensions';

import { GeoJsonLayer, BitmapLayer } from 'deck.gl';
import Popup from "../Env2D/popup";



import center_data from '../../Rileys_Data/cool_centers.geojson';

function Env3D() {

    const [satelliteTileLayer, setSatelliteTileLayer] = useState(null) ;
    const [viewState, setViewState] = useState({
        longitude: -115.76,
        latitude: 33.032,
        zoom: 11,
        pitch: 60.5,
        bearing: -35,
    });
    const [zoomLevel, setZoomLevel] = useState(viewState.zoom) ;
    const [tileLayer, setTileLayer] = useState(sessionStorage.getItem("basemap")) ;

    const boundingBox = [-118.5, 32, -114.8, 35];

    const [popup, setPopup] = useState(null);

    const imageUrl = '/local_raster2.png';

    const onViewStateChange = ({ viewState }) => {
        setZoomLevel(viewState.zoom) ;
    };


    const elevationLayer = new TerrainLayer({
        id: "terrain",
        visible: true,
        tileSize: 512,
        extent: boundingBox,
        // refinementStrategy: 'no-overlap',
        maxRequests: 128,
        elevationDecoder: {
            rScaler: 258,
            gScaler: 1,
            bScaler: 1 / 265,
            offset: -32768,
        },
        tesselator: 'auto',
        elevationData: `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png` ,
        texture: [
            `https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}`,
            `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}`,
        ],
        wireframe: false,
        color: [255, 255, 255],
        material: true,
        meshMaxError: 3,
        //modelMatrix: new Matrix4().translate([0, 0, -100]),
        //operation: 'terrain+draw',
        maxZoom: 13,
        parameters: {
            depthTest: true,
            cull: true,
        },
    }) ;

    const bitmapLayer = new BitmapLayer({
        id: 'bitmap-layer',
        image: imageUrl, 
        bounds: [
            -116.83160400390625, 32.49019241333008, -114.98406982421875,
            34.11175537109375,
          ],
        opacity: 0.5,
        parameters: {
            depthTest: false, // Disable depth test to prevent the bitmap from being covered
        },
        
        
    });

    const geoJsonLayer = new GeoJsonLayer({
        id: 'geojson-layer',
        data: center_data,
        filled: true,
        pointRadiusMinPixels: 7,
        pointRadiusScale: 30,
        getPointRadius: f => 7,
        getElevation: f => 10000,  // Increase elevation if necessary
        getFillColor: [0, 140, 255],
        pickable: true,
        parameters: {
            depthTest: false,  // Disable depth test for this layer
        },
        onHover: (info) => {
            if (info.picked) {
              const { x, y } = info;
              setPopup({ position: { x, y }, info: info.object });
            } else {
              setPopup(null);
            }
          },
        
    });


    return(
        <>
        <DeckGL
            views={new MapView({
                repeat: true,
            })}
            layers={[
                elevationLayer,
                geoJsonLayer,
                bitmapLayer,
            ]}
            initialViewState={viewState}
            onViewStateChange={onViewStateChange}
            controller={{ maxPitch: 88, maxZoom: 21 }}
            parameters={{
                clearColor: [0, 0, 0, 255],
            }}
        />
        <Popup position={popup?.position} info={popup?.info} />
        </>
    ) ;
}

export default Env3D ;