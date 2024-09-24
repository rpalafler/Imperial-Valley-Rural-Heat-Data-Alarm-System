import React, { useState, useEffect, useRef, useContext } from "react";

import "./PullupTab.css";

// React-Bootstrap Offcanvas Component
import Offcanvas from "react-bootstrap/Offcanvas";
import { OverlayTrigger } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";

// Chart.js with React-Chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";

// React-Icons
import { FaChartLine } from "react-icons/fa6";
import { TbChartAreaLine } from "react-icons/tb";

import { SensorContext } from "../MainApp";

function PullupTab() {
  const sensorContext = useContext(SensorContext);
  const [isActive, setIsActive] = useState(true);
  const [sensorData, setSensorData] = useState(() => {
    const value =
      sensorContext.sensorTimeSeries === null
        ? null
        : sensorContext.sensorTimeSeries;
    return value;
  });

  useEffect(() => {
    const sendSensorData = async () => {
      try {
        const response = await fetch("http://localhost:5000/send_location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lon: sensorContext.sensorPoint[0],
            lat: sensorContext.sensorPoint[1],
            climateVar: sensorContext.sensorForm.climateVar,
          }),
        });
        if (!response.ok) {
          throw new Error(
            "ERROR: Request could not be processed. Reload & Try Again."
          );
        }
        const responseData = await response.json();

        sensorContext.setSensorTimeSeries(responseData);
        console.log("I'm the data you saved:", responseData);
      } catch (error) {
        console.log("ERROR ", error);
      } finally {
        console.log("Process Finished");
      }
    };

    sendSensorData();
  }, [sensorContext.sensorPoint]);

  return (
    <div>
      <div className={`pullup-tab ${isActive ? "active" : ""}`}>
        <p>Sensor Data for </p>
        <p>
          {
            (sensorContext.sensorPoint[0].toFixed(3),
            sensorContext.sensorPoint[1].toFixed[0])
          }
        </p>
      </div>
    </div>
  );
}

export default PullupTab;
