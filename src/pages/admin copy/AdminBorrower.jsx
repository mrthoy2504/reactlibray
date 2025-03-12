import BorrowerDetail from "../admin/AdminBorrowerDetail.jsx";

export default function AdminBorrower() {
  return (
    <div className="-mt-5 ">
      <b className="mx-5 "> รายการยืม-ส่งหนังสือ </b>
      <div>
        <BorrowerDetail />
      </div>
    </div>
  );
}
