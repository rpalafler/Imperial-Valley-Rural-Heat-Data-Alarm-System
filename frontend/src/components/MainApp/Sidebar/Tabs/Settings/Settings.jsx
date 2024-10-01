// Import Context
import { useContext } from "react";
import { Basemap2DContext } from "../../../MainApp";
import styles from "../ClimateData/ClimateData.module.css";

function Settings() {
  const { useBasemapLayer2D, toggleBasemap } = useContext(Basemap2DContext);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className={styles.sectionContent}>
        <h4>Change Basemap Tiles</h4>
        <button onClick={toggleBasemap}>
          Switch to {useBasemapLayer2D ? "Elevation Layer" : "Basemap Layer 2D"}
        </button>
      </div>
    </div>
  );
}

export default Settings;
