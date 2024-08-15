import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns"; // Import the date adapter
import June_Data from "./june_rh2m.json";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale
);

const TimeSeriesChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const dates = June_Data.map((item) => {
      const parsedDate = new Date(item.time.replace(" ", "T"));
      console.log("Parsed Date: ", parsedDate); // Debugging output
      return parsedDate;
    });

    const values = June_Data.map((item) => item.rh2m);

    setChartData({
      labels: dates,
      datasets: [
        {
          label: "Hourly RH2M Data",
          data: values,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    });
  }, []);

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          stepSize: 1, // Ensure the step size matches your data density
          tooltipFormat: "MMM d, h:mm a",
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default TimeSeriesChart;

