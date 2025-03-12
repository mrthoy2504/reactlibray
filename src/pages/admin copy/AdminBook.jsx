import BookDetail from "../admin/AdminBookDetail.jsx";

export default function AdminBook() {
  return (  
      <div className="-mt-5">
        <b className="mx-5"> รายการหนังสือ </b>{" "}
        <div>
          <BookDetail />
        </div>
      </div>
   
  );
}
