import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChartBar = () => {
  const [startMonths, setStartMonths] = useState("2024-01");
  const [endMonths, setEndMonths] = useState("2025-12");
  const [chartData, setChartData] = useState(null);

  const startmon = JSON.stringify(startMonths).slice(6, 8);
  const startyear = JSON.stringify(startMonths).slice(1, 5);
  const startMonth = startmon + "-" + startyear;

  const endmon = JSON.stringify(endMonths).slice(6, 8);
  const endyear = JSON.stringify(endMonths).slice(1, 5);
  const endMonth = endmon + "-" + endyear;

  const fetchBorrowedSummary = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chart`, {
        params: { startMonth, endMonth },
      });
      const result = response.data.result; // เช่น { "2024-12": 40, "2025-01": 4 }
      const labels = Object.keys(result); // ชื่อเดือน เช่น ["2024-12", "2025-01"]
      const data = Object.values(result); // จำนวนผู้ยืม เช่น [40, 4]

      setChartData({
        labels,
        datasets: [
          {
            label: "จำนวนผู้ยืมหนังสือ",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching borrowed summary:", error);
    }
  };

  return (
    <div>
      <h1 className="mx-5 text-xl mb-5">กราฟแสดงจำนวนผู้ยืมหนังสือต่อเดือน</h1>
      <div className="flex flex-row mx-auto">
        <div className="mx-5">
          <label>เดือนเริ่มต้น:</label>
          <DatePicker
            selected={startMonths}
            onChange={(date) => setStartMonths(date)}
            dateFormat="d-MM-yyyy"
            className="p-1 border mx-5 my-1 border-gray-300 rounded"
          />
        </div>

        <div className="mx-5">
          <label>เดือนสิ้นสุด:</label>
          <DatePicker
            selected={endMonths}
            onChange={(date) => setEndMonths(date)}
            dateFormat="d-MM-yyyy"
            className="p-1 border mx-5 my-1 border-gray-300 rounded"
          />
        </div>
        <div>
          <button
            className=" mx-40  px-5 py-1 my-1 bg-green-500 text-white rounded-md"
            onClick={fetchBorrowedSummary}
          >
            แสดงกราฟ
          </button>
        </div>
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
                  text: "จำนวนผู้ยืม",
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default ChartBar;
