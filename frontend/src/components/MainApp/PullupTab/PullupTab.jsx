import React, { useState, useEffect, useContext } from "react";
import styles from "./PullupTab.module.css";

// Import SensorContext object from MainApp parent component
import { SensorContext } from "../MainApp";

// React-Bootstrap Components
import Spinner from "react-bootstrap/Spinner";

// React-Chart-js and Chart.js Libraries
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
  // Use global features stored inside SensorContext for this child component of MainApp
  const sensorContext = useContext(SensorContext);

  const [sensorData, setSensorData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const sendSensorData = async () => {
      try {
        setLoadingData(true);
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
        // console.log("Data received from server:", responseData);
      } catch (error) {
        console.log("ERROR ", error);
      } finally {
        console.log("Process Finished");
        setLoadingData(false);
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
            borderColor: "rgba(0, 0, 140, 1.00)",
            backgroundColor: "rgba(93, 63, 211, 0.35777)",
            borderWidth: 1.977,
            tension: 0.5, // Smooth the line
          },
        ],
      };
      setChartData(chartDataPrep);

      const chartOptionsPrep = {
        responsive: true,
        maintainAspectRatio: false, // Add this line
        elements: {
          point: {
            radius: 1.7777,
            hoverRadius: 15.777,
            backgroundColor: "rgba(100, 138, 138, 1.0)",
          },
        },
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
              size: 25,
            },
            bodyFont: {
              size: 23.5,
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
    <div className={styles.sectionContent}>
      <div
        className={
          sensorContext.sensorTabOpen && sensorData
            ? [styles.pulluptab, styles.active].join(" ")
            : styles.pulluptab
        }
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          {sensorContext.sensorPoint ? (
            <h3>
              Sensor Data Time Series for {"  "}
              {sensorContext.sensorPoint
                ? Math.abs(sensorContext.sensorPoint[1].toFixed(3))
                : null}
              °N,{" "}
              {sensorContext.sensorPoint
                ? Math.abs(sensorContext.sensorPoint[0].toFixed(3))
                : null}
              °W
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
          {sensorContext.sensorPoint && sensorContext.sensorForm
            ? sensorContext.sensorForm.climateVar === "rh2m"
              ? "Relative Humidity (2-Meters)"
              : "Dewpoint Temperature (2-Meters)"
            : null}
        </h4>

        {/* TIME SERIES GRAPH COMPONENT USING CHART.JS */}
        <div style={{ width: "99%", height: "85%" }}>
          {chartData && chartOptions && loadingData === false ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className={styles.spinner}>
              <Spinner animation="border" role="status" />
              {"  "}
              <div className={styles.spinnerText}>
                Loading Data for{" "}
                {sensorContext.sensorPoint
                  ? Math.abs(sensorContext.sensorPoint[1].toFixed(3))
                  : null}
                °N,{" "}
                {sensorContext.sensorPoint
                  ? Math.abs(sensorContext.sensorPoint[0].toFixed(3))
                  : null}
                °W
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PullupTab;
