// import AdminMenu from "../../components/nav/AdminMenu.jsx";
import FineDetail from "../admin/AdminFineDetail.jsx";

export default function AdminFine() {
  // const [auth, setAuth] = useAuth();
  return (
    <div>
      <b className="mx-5"> รายการสินค้า </b>{" "}
      <div>
        <FineDetail />
      </div>
    </div>
  );
}
