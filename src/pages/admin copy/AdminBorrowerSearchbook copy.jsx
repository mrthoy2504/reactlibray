import { useState, useEffect } from "react";
import axios from "axios";
import { BACK_URL } from "../../URL.jsx";
import { ModalBookBorrower } from "./Modal/ModalBookBorrower.jsx";
import { useRef } from "react";

const AdminBorrowerSearchbook = ({
  book,
  setBook,
  setBookId,
  bookId,
  handleLoan,
}) => {
  // const [book, setBook] = useState(""); //Book
  const [isbn, setIsbn] = useState("");

  const [title, setTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false); //modal
  const [modalBookOpen, setModalBookOpen] = useState(false);

  const [search, setSearch] = useState(""); //page paginator
  const [searchModal, setSearchModal] = useState("");
  const [totalBooks, setTotalBooks] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalBooks / itemsPerPage);

  const inputEl = useRef(null);
  const [error, setError] = useState("");

  const handleSearch = async (isbn) => {
    // const formattedISBN = typeof isbn === "number" ? isbn.toString() : isbn;
    try {
      const response = await axios.get(`${BACK_URL}/isbn`, {
        params: { isbn },
      });
      setBook(response.data);
      setBookId(response.data.id);
      inputEl.current.select();
    } catch (err) {
      setBook(null);
      inputEl.current.select();
      if (err.response && err.response.status === 404) {
        setError("ไม่พบหนังสือที่ค้นหา");
      } else {
        setError("เกิดข้อผิดพลาดในการค้นหา");
      }
    }
  };

  const handleKeyDown = (event) => {
    // alert("F12");
    if (event.key === "F12") {
      event.preventDefault(); // ป้องกันการเปิดคู่มือของเบราว์เซอร์
      handleLoan(event);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && document.activeElement === inputEl.current) {
        handleSearch(isbn); // Call search when pressing Enter on the ISBN input
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isbn]);

  return (
    <div className=" flex flex-row  mx-auto  px-1 border-collapse border border-black py-2 rounded-md ">
      {/*modal ค้นหา book */}
      {modalBookOpen && (
        <ModalBookBorrower
          closeModal={() => {
            setModalBookOpen(false);
          }}
          searchModal={searchModal}
          setSearchModal={setSearchModal}
          bookId={bookId}
          setBookId={setBookId}
          title={title}
          settitle={setTitle}
          setBook={setBook}
          setTitle={setTitle}
        />
      )}

      <div className="mx-2 text-gray-500  py-2 px-4  ">
        <div className="mb-2 flex flex-row  ">
          <button
            onClick={() => setModalBookOpen(true)}
            className="bg-blue-400 px-3 py-1 rounded-md  mr-2 text-white  "
          >
            ค้นหา
          </button>
          <input
            name="isbn"
            type="text"
            ref={inputEl}
            value={isbn}
            onChange={(e) => setIsbn(e.target.value.trim())}
            onKeyDown={handleKeyDown} // ดักจับ Enter
            placeholder="กรอกหมายเลข ISBN"
            className="border px-4 py-1 w-full rounded"
          />
        </div>
        <div className=" text-md my-1 -mx-2">
          <table>
            <tr>
              <td className="w-32"> ชื่อหนังสือ </td>
              <td className="w-5">:</td>
              <td className="w-72">
                <b>{book ? book.title : title} </b>
              </td>
            </tr>
            <tr>
              <td> ISBN</td>
              <td>:</td>
              <td className="w-32">
                <b>{book ? book.isbn : searchModal}</b>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBorrowerSearchbook;
