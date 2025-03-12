import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { BACK_URL } from "../../URL.jsx";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChartBar = () => {
  const [startMonth, setStartMonths] = useState("2025-01-01");
  const [endMonth, setEndMonths] = useState("2025-01-30");
  const [chartData, setChartData] = useState(null);

  const fetchBorrowedSummary = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/api/chart`, {
        params: {
          startMonth,
          endMonth,
        },
      });

      const borrowedResult = response.data.borrowed; // จำนวนคนยืม
      const returnedResult = response.data.returned; // จำนวนคนคืน
// alert(JSON.stringify(borrowedResult ))
      const labels = Object.keys(borrowedResult); // ชื่อเดือน เช่น ["2025-01", "2025-02"]
      const borrowedData = Object.values(borrowedResult); // จำนวนคนยืม เช่น [40, 30]
      const returnedData = Object.values(returnedResult); // จำนวนคนคืน เช่น [35, 25]

      setChartData({
        labels,
        datasets: [
          {
            label: "จำนวนผู้ยืมหนังสือ",
            data: borrowedData,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "จำนวนผู้ส่งคืนหนังสือ",
            data: returnedData,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  return (
    <div>
      <h1 className="mx-5 text-xl mb-5">
        กราฟแสดงจำนวนผู้ยืมและผู้ส่งคืนหนังสือต่อเดือน
      </h1>

      <div className="flex flex-row mx-auto">
        <input
          type="date"
          value={startMonth}
          onChange={(e) => setStartMonths(e.target.value)}
          className="border p-2 mx-2"
        />
        <input
          type="date"
          value={endMonth}
          onChange={(e) => setEndMonths(e.target.value)}
          className="border p-2 mx-2"
        />
        <button
          className="px-5 py-1 bg-green-500 text-white rounded-md"
          onClick={fetchBorrowedSummary}
        >
          แสดงกราฟ
        </button>
      </div>

      {chartData && (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "เดือน",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "จำนวน",
                },
              },
            },
          }}
        />
      )}
    {JSON.stringify()}
    </div>
  );
};

export default ChartBar;
