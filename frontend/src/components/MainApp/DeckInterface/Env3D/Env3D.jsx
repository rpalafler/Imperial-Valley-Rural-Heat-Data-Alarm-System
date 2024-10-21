// --------------------------------------------------------------------------------------- //
//  DeckGL 3D-Environment Component with Layer Overlays for MainApp DeckInterface          //
// ~ 3D-Environment for Imperial Valley with Viewing Optimizations ~                       //
// --------------------------------------------------------------------------------------- //
//  Ryan Paul Lafler, M.Sc.                                                                //
//  Copyright 2024 by Ryan Paul Lafler and Premier Analytics Consulting, LLC.              //
//  E-mail: rplafler@premier-analytics.com                                                 //
// --------------------------------------------------------------------------------------- //

// Import React Hooks
import { useState, useEffect, useContext } from "react";

// CSS Stylesheet for Component
import styles from "./Env3D.module.css";

// DeckGL Layer Components
import { DeckGL, CompositeLayer } from "deck.gl";
import { MapView, COORDINATE_SYSTEM } from "@deck.gl/core";
import { TileLayer, Tile3DLayer, TerrainLayer } from "@deck.gl/geo-layers";
import { BitmapLayer, ScatterplotLayer } from "@deck.gl/layers";
import { ParticleLayer } from "deck.gl-particle";
import {
  _TerrainExtension as TerrainExtension,
  CollisionFilterExtension,
} from "@deck.gl/extensions";

// Data Context Imports
import { ClimateDataContext } from "../../MainApp";
import { RTMAContext } from "../../MainApp";
import { SensorContext } from "../../MainApp";

/* Visualize Gridded Datasets */
import GL from "@luma.gl/constants";
import { setParameters, withParameters, Geometry } from "@luma.gl/core";
import { Model, Texture2D } from "@luma.gl/core";
import { loadImage } from "@loaders.gl/images";

/* Lighting Effects */
import { LightingEffect, AmbientLight, DirectionalLight } from "@deck.gl/core";

/* Limit Active Viewport to a Bounding Box Determined by Zoom Level and Total Square Miles */
const MILES_TO_DEGREES_LAT = 1 / 69; // Approximate conversion for latitude
const MILES_TO_DEGREES_LNG = 1 / 54.6; // Approximate conversion for longitude at mid-latitude

function calculateBoundingBox(center, zoom) {
  var latDistance = 0;
  var lngDistance = 0;
  if (zoom < 7) {
    latDistance = 70 * MILES_TO_DEGREES_LAT;
    lngDistance = 70 * MILES_TO_DEGREES_LNG;
  } else if (zoom < 8 && zoom >= 7) {
    latDistance = 60 * MILES_TO_DEGREES_LAT;
    lngDistance = 60 * MILES_TO_DEGREES_LNG;
  } else if (zoom < 9 && zoom >= 8) {
    latDistance = 30 * MILES_TO_DEGREES_LAT;
    lngDistance = 30 * MILES_TO_DEGREES_LNG;
  } else if (zoom < 10 && zoom >= 9) {
    latDistance = 25 * MILES_TO_DEGREES_LAT;
    lngDistance = 25 * MILES_TO_DEGREES_LNG;
  } else if (zoom < 13 && zoom >= 10) {
    latDistance = 20 * MILES_TO_DEGREES_LAT;
    lngDistance = 20 * MILES_TO_DEGREES_LNG;
  } else if (zoom < 13.5 && zoom >= 13) {
    latDistance = 5 * MILES_TO_DEGREES_LAT;
    lngDistance = 5 * MILES_TO_DEGREES_LNG;
  } else if (zoom < 14 && zoom >= 13.5) {
    latDistance = 5 * MILES_TO_DEGREES_LAT;
    lngDistance = 5 * MILES_TO_DEGREES_LNG;
  } else if (zoom < 19 && zoom >= 14) {
    latDistance = 3 * MILES_TO_DEGREES_LAT;
    lngDistance = 3 * MILES_TO_DEGREES_LNG;
  } else {
    latDistance = 2 * MILES_TO_DEGREES_LAT;
    lngDistance = 2 * MILES_TO_DEGREES_LNG;
  }

  return [
    center[0] - lngDistance, // minLongitude
    center[1] - 0.5 * latDistance, // minLatitude
    center[0] + lngDistance, // maxLongitude
    center[1] + 1.25 * latDistance, // maxLatitude
  ];
}

function Env3D() {
  // Load Context into Component //
  const climateDataContext = useContext(ClimateDataContext);
  const rtmaContext = useContext(RTMAContext);
  const sensorContext = useContext(SensorContext);

  const [basemapLayer, setBasemapLayer] = useState(null);
  const [originalView, setOriginalView] = useState({
    longitude: -115.79,
    latitude: 33.082,
    zoom: 9.5,
    pitch: 55,
    bearing: -30,
  });
  const [zoomLevel, setZoomLevel] = useState(originalView.zoom);

  const [boundingBox, setBoundingBox] = useState(
    calculateBoundingBox(
      [originalView.longitude, originalView.latitude],
      zoomLevel
    )
  );
  // const boundingBox = [-118.5, 32.2, -114.5, 35];

  const [currentViewState, setCurrentViewState] = useState(originalView);
  const onViewStateChange = ({ viewState }) => {
    setZoomLevel(viewState.zoom);
    setCurrentViewState(viewState);
  };

  const [sensorPoint, setSensorPoint] = useState(() => {
    const value =
      sensorContext.sensorPoint === null ? null : sensorContext.sensorPoint;
    return value;
  });
  const handleSensorPointChange = (info) => {
    setSensorPoint(info);
    sensorContext.setSensorPoint(info);
  };

  const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 2.777,
  });
  const lightingEffect = new LightingEffect({ ambientLight });

  useEffect(() => {
    // Retrieve Tiles Asynchronously --> process them in any-order that they load for the current viewing box:
    // Google Hybrid Satellite Tiles Fetcher:
    const fetchSatelliteData = async () => {
      try {
        const satelliteLayer = new TileLayer({
          id: "satellite-basemap-layer",
          visible: zoomLevel > 12 ? true : false,
          extent: boundingBox,
          data: [
            "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
            // "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}",
          ],
          tileSize: 256,
          maxRequests: 64,
          minZoom: 12,
          wrapLongitude: true,
          material: false,
          pickable: false,
          parameters: {
            depthTest: true, // Do NOT change --> leads to layer flickering issues
            cull: false,
          },
          renderSubLayers: (props) => {
            const {
              bbox: { west, south, east, north },
            } = props.tile;

            return new BitmapLayer(props, {
              data: null,
              image: props.data,
              //_imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
              bounds: [west, south, east, north],
              opacity: 1.0,
            });
          },
          extensions: [new TerrainExtension()],
        });
        setBasemapLayer(satelliteLayer);
      } catch (error) {
        console.error("Error Fetching Data: ", error);
      }
    };
    fetchSatelliteData();
    console.log("GLOBE Satellite!");
  }, [currentViewState]); // Only update tileLayer when the current viewing bounds are changed.

  const elevationLayer = new TerrainLayer({
    id: "terrain",
    visible: true,
    tileSize: 456,
    extent: boundingBox,
    refinementStrategy: "best-available",
    debounceTime: 10,
    maxRequests: 128,
    elevationDecoder: {
      rScaler: 256,
      gScaler: 1,
      bScaler: 1 / 265,
      offset: -32768,
    },
    elevationScale: 10,
    tesselator: "martini",
    elevationData: `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`,
    texture: [
      // `https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}`,
      `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}`,
    ],
    loadOptions: { maxConcurrency: 16 },
    getPolygonOffset: false,
    pickable: false,
    maxCacheSize: 4500,
    wireframe: false,
    color: [255, 255, 255],
    material: true,
    meshMaxError: 10,
    //modelMatrix: new Matrix4().translate([0, 0, -100]),
    operation: "terrain+draw",
    maxZoom: 13,
    parameters: {
      depthTest: true,
      cull: false,
    },
    onAfterRender: ({ gl }) => {
      setParameters(gl, {
        generateMipmaps: true,
        anisotropicFiltering: false,
      });
    },
  });

  const [hoverInfo, setHoverInfo] = useState(null);
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
        temperature:
          climateDataContext.climateDataOn["rtma"] === true
            ? rtmaContext.rtmaData["climate_var_values"][index]
            : null,
        humidity:
          climateDataContext.climateDataOn["cdo"] === true &&
          sensorContext.sensorForm.climateVar === "rh2m"
            ? sensorContext.sensorData["climate_var_values"][index]
            : null,
        dewpoint:
          climateDataContext.climateDataOn["cdo"] === true &&
          sensorContext.sensorForm.climateVar === "td2m"
            ? sensorContext.sensorData["climate_var_values"][index]
            : null,
      });

      // console.log(event, rtmaContext.rtmaData['climate_var_values'][index]) ;
    } else {
      setHoverInfo(null);
    }
  };
  const rtma_temp = new BitmapLayer({
    id: "rtma-climate-var",
    display: rtmaContext.rtmaData ? true : false,
    visible: climateDataContext.climateDataOn["rtma"] === true ? true : false,
    extent: boundingBox,
    bounds: rtmaContext.rtmaData ? rtmaContext.rtmaData["bounds"] : null,
    image: rtmaContext.rtmaData
      ? rtmaContext.rtmaData["climate_var_image"]
      : null,
    _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    opacity: 0.4075,
    pickable: rtmaContext.rtmaData ? true : false,
    wrapLongitude: true,
    onHover: rtmaContext.rtmaData ? handleHover : null,
    onAfterRender: ({ gl }) => {
      setParameters(gl, {
        generateMipmaps: true,
        anisotropicFiltering: false,
      });
    },
    parameters: {
      depthTest: true,
      cull: false,
    },
    extensions: [new TerrainExtension()],
  });

  const rtma_winds = new ParticleLayer({
    id: "rtma-winds",
    display: rtmaContext.rtmaData ? true : false,
    visible:
      climateDataContext.climateDataOn["rtma"] === true && zoomLevel < 13
        ? true
        : false,
    extent: boundingBox,
    bounds: rtmaContext.rtmaData ? rtmaContext.rtmaData["bounds"] : null,
    imageUnscale: [-128, 127],
    image: rtmaContext.rtmaData ? rtmaContext.rtmaData["wind_image"] : null,
    _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    pickable: false,
    numParticles: zoomLevel < 13 ? 100 : 40, // number
    maxAge: 50, // number
    speedFactor: 30, // number
    color: [255, 255, 255], // [number, number, number]
    width: 14.55, // number
    opacity: 0.9999, // number
    wrapLongitude: true,
    parameters: {
      depthTest: true,
      cull: false,
    },
    extensions: [new TerrainExtension()],
  });

  const sensorClimateVarLayer = new BitmapLayer({
    id: "sensor-climate-var",
    display: sensorContext.sensorData ? true : false,
    visible: climateDataContext.climateDataOn["cdo"] === true ? true : false,
    extent: boundingBox,
    bounds: sensorContext.sensorData
      ? sensorContext.sensorData["bounds"]
      : null,
    image: sensorContext.sensorData
      ? sensorContext.sensorData["climate_var_image"]
      : null,
    _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    opacity: 0.4075,
    pickable: sensorContext.sensorData ? true : false,
    wrapLongitude: true,
    onHover: sensorContext.sensorData ? handleHover : null,
    onAfterRender: ({ gl }) => {
      setParameters(gl, {
        generateMipmaps: true,
        anisotropicFiltering: false,
      });
    },
    onClick: (info) => {
      if (info && info.coordinate) {
        console.log(info.coordinate);
        handleSensorPointChange(info.coordinate); // Set the clicked point coordinates
        sensorContext.setSensorTabOpen(true); // Open the tab on click
      }
    },
    parameters: {
      depthTest: false,
      cull: false,
    },
    extensions: [new TerrainExtension()],
  });

  const sensorPointLayer = new ScatterplotLayer({
    id: "sensor-point",
    data: sensorPoint ? [sensorPoint] : [],
    getPosition: (d) => d,
    getRadius: 500, // Adjust the radius to your needs
    getFillColor: [255, 0, 0], // Red color for the clicked point
    pickable: false,
    stroked: true,
    billboard: true,
    parameters: {
      depthTest: false,
      cull: false,
    },
    extensions: [new TerrainExtension()],
  });

  return (
    <>
      <DeckGL
        views={
          new MapView({
            repeat: false,
            orthographic: false,
          })
        }
        layers={[
          elevationLayer,
          basemapLayer,
          climateDataContext.climateDataOn["rtma"] === true ? rtma_temp : null,
          sensorClimateVarLayer,
          climateDataContext.climateDataOn["rtma"] === true && zoomLevel < 13
            ? rtma_winds
            : null,
          sensorPointLayer,
        ]}
        useDevicePixels="false"
        initialViewState={originalView}
        onViewStateChange={({ viewState }) => {
          setZoomLevel(viewState.zoom);
          setCurrentViewState(viewState);
          console.log(viewState.zoom);
          if (
            originalView.longitude !== viewState.longitude &&
            originalView.latitude !== viewState.latitude
          ) {
            const boundingBox = calculateBoundingBox(
              [viewState.longitude, viewState.latitude],
              viewState.zoom
            ); // 20 miles
            setBoundingBox(boundingBox);
          } else if (Math.abs(viewState.zoom - zoomLevel) >= 2) {
            const boundingBox = calculateBoundingBox(
              [viewState.longitude, viewState.latitude],
              viewState.zoom
            ); // 20 miles
            setBoundingBox(boundingBox);
          }
        }}
        controller={{ maxPitch: 73, maxZoom: 23 }}
        parameters={{
          clearColor: [0, 0, 0, 255],
        }}
        effects={[lightingEffect]}
      />
      {hoverInfo && (
        <div
          style={{
            position: "absolute",
            maxWidth: "20rem",
            fontSize: "1.5rem",
            fontWeight: "600",
            letterSpacing: "0.07rem",
            left: hoverInfo.x,
            top: hoverInfo.y + 10, // Position above the cursor
            marginTop: "-10rem",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            padding: "0.75rem",
            borderRadius: "1rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            pointerEvents: "none", // Prevent the tooltip from interfering with hover events
          }}
        >
          <div>Lon: {hoverInfo.lon.toFixed(3)}</div>
          <div>Lat: {hoverInfo.lat.toFixed(3)}</div>
          {climateDataContext.climateDataOn["rtma"] === true ? (
            <div>Temp: {hoverInfo.temperature}°F</div>
          ) : null}
          {climateDataContext.climateDataOn["cdo"] === true &&
          sensorContext.sensorForm.climateVar === "rh2m" ? (
            <div>Rel.Humid: {hoverInfo.humidity.toFixed(2)}%</div>
          ) : null}
          {climateDataContext.climateDataOn["cdo"] === true &&
          sensorContext.sensorForm.climateVar === "td2m" ? (
            <div>Dewpoint: {hoverInfo.dewpoint.toFixed(2)}°F</div>
          ) : null}{" "}
        </div>
      )}
    </>
  );
}

export default Env3D;
