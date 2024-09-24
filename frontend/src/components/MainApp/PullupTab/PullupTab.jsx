import React, { useState, useEffect, useContext } from "react";
import "./PullupTab.css";

import { SensorContext } from "../MainApp";

// React-Bootstrap Offcanvas Component
import Offcanvas from "react-bootstrap/Offcanvas";
import { Line } from "react-chartjs-2";
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  zoomPlugin
);

function PullupTab() {
  const sensorContext = useContext(SensorContext);

  const [sensorData, setSensorData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

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
        sensorContext.setSensorTimeSeries(responseData); // Store the time series in context
        setSensorData(responseData); // Set the local state for sensorData
        console.log("Data received from server:", responseData);
      } catch (error) {
        console.log("ERROR ", error);
      } finally {
        console.log("Process Finished");
      }
    };

    if (sensorContext.sensorPoint) {
      sendSensorData();
    }
  }, [sensorContext.sensorPoint]);

  // This effect handles chart data and options setup after sensorData is updated
  useEffect(() => {
    if (sensorData) {
      const chartDataPrep = {
        labels: sensorData.DATES, // X-axis: Time (DATES)
        datasets: [
          {
            label:
              sensorContext.sensorForm.climateVar === "rh2m"
                ? "Rel. Humid (%)"
                : "Dewpoint Temp (°F)",
            data: sensorData.DATA, // Y-axis: Data values
            fill: true,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            tension: 0.4, // Smooth the line
          },
        ],
      };
      setChartData(chartDataPrep);

      const chartOptionsPrep = {
        responsive: true,
        maintainAspectRatio: false, // Add this line
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
          },
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
            },
            pan: {
              enabled: true,
            },
            limits: {
              y: {
                min: -10,
                max: 100,
              },
            },
          },
          tooltip: {
            titleFont: {
              size: 21,
            },
            bodyFont: {
              size: 18,
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(0, 0, 0, 0.17777)",
            },
            ticks: {
              font: {
                size: 13, // Adjust font size for x-axis labels
              },
              color: "rgba(0, 0, 40, 1.0)",
              minTicksLimit: 10,
              maxTicksLimit: 30,
              minRotation: 50,
              maxRotation: 52,
            },
          },
          y: {
            beginAtZero: false,
          },
        },
      };
      setChartOptions(chartOptionsPrep);
    }
  }, [sensorData]);

  return (
    <div>
      <div
        className={`pullup-tab ${sensorContext.sensorTabOpen ? "active" : ""}`}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          {sensorContext.sensorPoint ? (
            <h3>
              Sensor Data for ({sensorContext.sensorPoint[0].toFixed(3)},{" "}
              {sensorContext.sensorPoint[1].toFixed(3)})
            </h3>
          ) : null}
          <h2
            onClick={() => {
              sensorContext.setSensorTabOpen(false);
            }}
          >
            X
          </h2>
        </div>
        <h4 style={{ color: "rgb(0, 0, 150)" }}>
          Climate Variable:{" "}
          {sensorContext.sensorPoint
            ? sensorContext.sensorForm.climateVar === "rh2m"
              ? "Relative Humidity (2-Meters)"
              : "Dewpoint Temperature (2-Meters)"
            : null}
        </h4>

        {/* TIME SERIES GRAPH COMPONENT USING CHART.JS */}
        <div style={{ width: "97%", height: "90%" }}>
          {chartData && chartOptions ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PullupTab;
