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
      if (isNaN(parsedDate.getTime())) {
        console.error(`Invalid date: ${item.time}`);
      }
      return parsedDate;
    });
  
    console.log("Parsed Dates: ", dates); // Debugging output
  
    const values = June_Data.map((item) => item.rh2m);
  
    setChartData({
      labels: dates,
      datasets: [
        {
          label: "Hourly RH2M Data",
          data: values.map((value, index) => ({ x: dates[index], y: value })),
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
          unit: "day", // Adjust based on your data density
          tooltipFormat: "MMM d, h:mm a",
        },
        title: {
          display: true,
          text: 'Date',
        },
        min: new Date('2020-05-25').toISOString(),
        max: new Date('2020-07-01').toISOString(),
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
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
