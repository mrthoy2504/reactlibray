import AdminChartDetail from "../admin/AdminChart.jsx";
import Chart from "./chart.jsx";
import ChartBar from "./chartBar.jsx";
export default function AdminDashboard() {
  return (
    <div>
      <b className="mx-5">Dashboard </b>{" "}
      <div>
        {" "}
        <AdminChartDetail />
      </div>
      <div >
        <div className=" w-96 mt-10  ml-64">
          <Chart />
        </div>
        <div className="flex flex-row justify-center mt-10 mx-auto h-96">
          <ChartBar />
        </div>
      </div>
    </div>
  );
}
