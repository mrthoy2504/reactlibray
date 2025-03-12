import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BACK_URL } from "../../URL.jsx";
import { ModalBookBorrower } from "./Modal/ModalBookBorrower.jsx";

const AdminBorrowerSearchbook = ({
  book,
  setBook,
  setBookId,
  bookId,
  handleLoan,
  books,
  setBooks,
  isbn,
  setIsbn,

}) => {
  // const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [modalBookOpen, setModalBookOpen] = useState(false);
  const [error, setError] = useState("");
  const inputEl = useRef(null);

  const handleSearch = async (isbn) => {
    try {
      const response = await axios.get(`${BACK_URL}/isbn/`, {
        params: { isbn },
      });
      const bookData = response.data;
      if (bookData) {
        setBook(bookData);
        setBookId(bookData.id);
        handleLoanAfterSearch(bookData.id); // รอการอัปเดตสถานะสำเร็จแล้วค่อยเรียก handleLoan
      } else {
        setBook(null);
        alert("ไม่พบหนังสือที่ค้นหา");
      }
      inputEl.current.select();
    } catch (err) {
      setBook(null);
      inputEl.current.select();
      if (err.response && err.response.status === 404) {
        alert("ไม่พบหนังสือที่ค้นหา");
      } 
    }
  };

  // เรียก handleLoan หลังจากค้นหาเสร็จ
  const handleLoanAfterSearch = (bookId) => {
    handleLoan({ bookId });
  };

  const handleKeyDown = (event) => {
    if (event.key === "F9" && document.activeElement === inputEl.current) {
      // handleSearch(isbn); // Trigger search when Enter key is pressed
      alert("handleKeyDown")
      handleLoan({ bookId });
    }
  };

  useEffect(() => {
    handleSearch(isbn);
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

  return (
    <div className="flex flex-row mx-auto px-1 border-collapse border border-black py-2 rounded-md">
      {modalBookOpen && (
        <ModalBookBorrower
          closeModal={() => setModalBookOpen(false)}
          searchModal={isbn}
          setSearchModal={setIsbn}
          bookId={bookId}
          setBookId={setBookId}
          title={title}
          setIsbn={setIsbn}
          isbn={isbn}
          settitle={setTitle}
          setBook={setBook}
          setTitle={setTitle}
        />
      )}

      <div className="mx-2 text-gray-500 py-2 px-4">
        <div className="mb-2 flex flex-row">
          <button
            onClick={() => setModalBookOpen(true)}
            className="bg-blue-400 px-3 py-1 rounded-md mr-2 text-white"
          >
            ค้นหา หนังสือ
          </button>
          <input
            name="isbn"
            type="text"
            ref={inputEl}
            value={isbn}
            onChange={(e) => setIsbn(e.target.value.trim())}
            onKeyDown={handleKeyDown}
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
                <td className="w-72">
                  <b>{book ? book.title : title}</b>
                </td>
              </tr>
              <tr>
                <td>ISBN</td>
                <td>:</td>
                <td className="w-32">
                  <b>{book ? book.isbn : isbn}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBorrowerSearchbook;
