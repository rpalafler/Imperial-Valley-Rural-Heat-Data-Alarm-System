// Import Context
import { useContext } from "react";
import { Basemap2DContext } from "../../../MainApp";
import { BasemapSelContext } from "../../../MainApp";
import styles from "../ClimateData/ClimateData.module.css";

function Settings() {
  const { useBasemapLayer2D, toggleBasemap } = useContext(Basemap2DContext);
  const { selectedBasemap, setSelectedBasemap } = useContext(BasemapSelContext);

  const basemaps = [
    {
      value: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      label: "OpenStreetMap",
    },
    {
      value:
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      label: "ESRI World Imagery",
    },
    {
      value: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      label: "Carto Light",
    },
    {
      value: "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      label: "Carto Dark",
    },
  ];

  const handleBasemapChange = (e) => {
    setSelectedBasemap(e.target.value); // Update the basemap in context
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className={styles.sectionContent}>
        <h4>Change Between 2D and 3D</h4>
        <button onClick={toggleBasemap}>
          Switch to {useBasemapLayer2D ? "Elevation Layer" : "Basemap Layer 2D"}
        </button>
      </div>

      {useBasemapLayer2D && ( // Selector appears when basemaplayer2d is true
        <div className={styles.sectionContent}>
          <h4>Select Basemap</h4>
          <select onChange={handleBasemapChange}>
            {basemaps.map((basemap) => (
              <option key={basemap.value} value={basemap.value}>
                {basemap.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default Settings;
