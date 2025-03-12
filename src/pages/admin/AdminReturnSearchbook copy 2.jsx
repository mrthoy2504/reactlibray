import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BACK_URL } from "../../URL.jsx";
import Swal from "sweetalert2";

const AdminReturnSearchbook = ({
  book,
  setBook,
  setBookId,
  bookId,
  handleLoan,
  books,
  setBooks,
  isbn,
  setIsbn,
  membersId,
  setMembersId,
  updateBrower,
  inputRef
}) => {
  // const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const inputEl = useRef(null);
  const handleSearch = async (isbn, membersId) => {
    if (membersId === "") {
      alert("ไม่พบชื่อสมาชิก")
      inputRef.current.select();
      return
    }
    try {
      const response = await axios.post(
        `${BACK_URL}/isbn/?memberId=${membersId}&isbn=${isbn}`
      );
      const bookData = response.data;
      if (bookData) {
        setBook(bookData);
        // alert(JSON.stringify(response.data[0].book.title))
        setBookId(bookData.id);
        handleLoanAfterSearch(response.data[0].id,(response.data[0].book.title)); // รอการอัปเดตสถานะสำเร็จแล้วค่อยเรียก handleLoan
      } else {
        setBook(null);
        Swal.fire("ไม่พบหนังสือที่ค้นหา");
      }
      inputEl.current.select();
    } catch (err) {
      setBook(null);
      inputEl.current.select();
      if (err.response && err.response.status === 404) {
        Swal.fire("ไม่พบหนังสือที่ค้นหา");
      }
    }
  };

  // เรียก handleLoan หลังจากค้นหาเสร็จ
  const handleLoanAfterSearch = (broweringId,title) => {
    updateBrower(broweringId,title);
  };

  useEffect(() => {
  
    const handleWindowKeyDown = (event) => {
      if (event.key === "Enter" && document.activeElement === inputEl.current) {
        handleSearch(isbn);
      }
    };
    window.addEventListener("keydown", handleWindowKeyDown);
    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [isbn]);


  useEffect(() => {
    handleSearch(membersId);
    const handleWindowKeyDown = (event) => {
      if (event.key === "Enter" && document.activeElement === inputEl.current) {
        handleSearch( membersId);
      }
    };

  }, [membersId]);





  return (
    <div className="flex flex-row mx-auto px-1 border-collapse border border-black py-2 rounded-md">
      <div className="mx-2 text-gray-500 py-2 px-4">
        <div className="mb-2 flex flex-row">
          <button
            // onClick={() => setModalBookOpen(true)}
            className="bg-blue-400 px-3 py-1 rounded-md mr-2 text-white"
          >
            ค้นหา
          </button>
          <input
            name="isbn"
            type="text"
            ref={inputEl}
            value={isbn}
            onChange={(e) => setIsbn(e.target.value.trim())}
            placeholder="กรอกหมายเลข ISBN"
            className="border px-4 py-1 w-full rounded"
          />
        </div>
        <div className="text-md my-1 -mx-2">
          <table>
            <tbody>
              <tr>
                <td className="w-32">ชื่อหนังสือ</td>
                <td className="w-5">:</td>
                {!book ? (
                  <td className="w-72">
                    <b className="text-red-500">ไม่พบหนังสือที่ค้นหา</b>
                  </td>
                ) : (
                  <td>{book[0].book.title}</td>
                )}
              </tr>
              <tr>
                <td>ISBN </td>
                <td>:</td>
                {!book ? (
                  <td className="w-72">
                    <b className="text-red-500">ไม่พบหนังสือที่ค้นหา</b>
                  </td>
                ) : (
                  <td>{book[0].book.isbn}</td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReturnSearchbook;
