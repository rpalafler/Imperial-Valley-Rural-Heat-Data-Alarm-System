// src/Components/Popup.js
import React from "react";

const Popup = ({ position, info }) => {
  if (!position || !info) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        background: "white",
        padding: "10px",
        borderRadius: "3px",
        boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.2)",
        pointerEvents: "none",
        zIndex: 1, // Ensure the popup is above other elements
      }}
    >
      <div>
        <strong>{info.properties.name}</strong>
      </div>
      <div>Type: {info.properties.type.join(", ")}</div>
      <div>Address: {info.properties.address}</div>
      <div>Phone: {info.properties.phone}</div>
      <div>Hours: {info.properties.hours}</div>
    </div>
  );
};

export default Popup;
