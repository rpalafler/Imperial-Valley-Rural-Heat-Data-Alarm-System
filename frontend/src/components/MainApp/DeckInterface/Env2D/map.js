import React, { useState, useCallback } from "react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl";
import { GeoJsonLayer, BitmapLayer } from "@deck.gl/layers";
import center_data from "./cool_centers.geojson";
import Popup from "./popup";

const MAP_BOX_ACCESS_TOKEN =
  "pk.eyJ1IjoicnJ1dGFuMjQyNiIsImEiOiJjbG9tZ3NtNjkwdzNqMmtzNXJxMHdsYXc0In0.N8HDX6AtRrlUMz-x9tAKwQ";

const MapComponent = () => {
  const [popup, setPopup] = useState(null);
  const [layerVisibility, setLayerVisibility] = useState({
    "center-layer": true,
    "raster-layer": true,
  });

  const [basemapStyle, setBasemapStyle] = useState(
    "mapbox://styles/mapbox/dark-v11"
  );

  const [circleColor, setCircleColor] = useState([225, 140, 0]); // Default color
  const [circleSize, setCircleSize] = useState(7);

  const rasterUrl = "/local_raster2.png";

  const INITIAL_VIEW_STATE = {
    longitude: -115.4702,
    latitude: 33.2525,
    zoom: 9,
    pitch: 0,
    bearing: 0,
  };

  const renderLayers = () => [
    layerVisibility["center-layer"] &&
      new GeoJsonLayer({
        id: "center-layer",
        data: center_data,
        pickable: true,
        stroked: false,
        filled: true,
        pointRadiusMinPixels: 7,
        pointRadiusScale: 30,
        getRadius: () => circleSize,
        getFillColor: () => circleColor,
        getLineColor: () => circleColor,
        onHover: (info) => {
          if (info.picked) {
            const { x, y } = info;
            setPopup({ position: { x, y }, info: info.object });
          } else {
            setPopup(null);
          }
        },
      }),
    layerVisibility["raster-layer"] &&
      new BitmapLayer({
        id: "bitmap-layer",
        bounds: [
          -116.83160400390625, 32.49019241333008, -114.98406982421875,
          34.11175537109375,
        ],
        image: rasterUrl,
        opacity: 0.5,
      }),
  ];

  return (
    <div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={renderLayers()}
      >
        <Map
          initialViewState={INITIAL_VIEW_STATE}
          controller
          mapStyle={basemapStyle}
          mapboxAccessToken={MAP_BOX_ACCESS_TOKEN}
          style={{ width: "100%", height: "100%" }}
        />

        <Popup position={popup?.position} info={popup?.info} />
      </DeckGL>
    </div>
  );
};

export default MapComponent;
