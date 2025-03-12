import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import {BACK_URL} from "../../URL.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

// ลงทะเบียน components ของ Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart() {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACK_URL}/api/report/topborrowed`);
        const data = await response.data;
        setChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const labels = chartData.map(
    (item) => item.title + " =" + item.totalBorrowed
  );
  const counts = chartData.map((item) => item.totalBorrowed);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "# of Votes",
        data: counts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
       <div >
        หนังสือ10อันดับแรกที่ยืมมากสุด
        <Doughnut data={data} />
      </div>
    </div>
  );
}
