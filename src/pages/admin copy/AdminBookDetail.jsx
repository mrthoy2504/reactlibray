
import { useState, useEffect } from "react";
import axios from "axios";
import { ModalBook } from "./Modal/ModalBook.jsx";
import { ModalBookEdit } from "./Modal/ModalBookEdit.jsx";
import { HiTrash } from "react-icons/hi";
import { HiPencil } from "react-icons/hi";
import ReactPaginate from "react-paginate";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons"; // for customizing icons
import {BACK_URL } from "../../URL.jsx";
// import { useAuth } from "../../context/auth";

const AdminBookDetail = () => {
  // const [auth, setAuth] = useAuth();
  const token = JSON.parse(localStorage.getItem("auth")).token;
  //modal setProducts
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [refresh, setRefresh] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);

  //paginator
  const [search, setSearch] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalProducts / itemsPerPage);

  //เรียกข้อมูล
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/books`, {
        params: { search, currentPage, itemsPerPage },
      });
      setTotalProducts(response.data.totalBooks);
      setProducts(response.data.books);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  //ลบ  image product
  const Delimage = async (id) => {
    if (window.confirm("ยืนยันการลบ?" + id)) {
      try {
        const response = await axios.delete(`${BACK_URL}/books/image/` + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        fetchBooks();
      } catch (error) {
        console.error("Error fetching image", error);
      }
    }
  };

  //ลบ Book
  const DelBook = async (id) => {
    if (window.confirm("ยืนยันการลบ ?" + id)) {
      try {
        const response = await axios.delete(`${BACK_URL}/books/` + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        fetchBooks();
      } catch (error) {
        alert("!เกิดข้อผิดพลาด ไม่ใช่Admin หรือ มีรายการบันทึกการยืม");
        console.error("Error delete !Admin", error);
      }
    }
  };

  // เรียก Modal Edit
  const editproduct = async (productmodal) => {
    setProduct(productmodal);
    setModalEditOpen(true);
  };

  useEffect(() => {
    setTimeout(() => {
      fetchBooks();
    }, 500);
  }, [search, currentPage, refresh, itemsPerPage]);

  const handlePageClick = async (data) => {
    console.log(data.selected);
    let currentPage = data.selected + 1;
    setCurrentPage(currentPage);
  };

  //search
  const handleSearchChange = (e) => {
    setCurrentPage(1);
    setSearch(e.target.value);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="my-1">
        <div className="flex flex-row py-1 mx-auto justify-between ">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-green-400 px-5 py-2 rounded-md mx-10 text-white "
          >
            เพิ่มรายการ
          </button>

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            className="w-72 text-md rounded-md border  px-2 py-0"
            placeholder="ค้นหา..."
          />
          <label className="mx-4  ">
            <b> จำนวนรายการต่อหน้า: </b>
            <select
              name="selectedPage"
              onChange={(e) => setItemsPerPage(e.target.value)}
              className="px-5  bg-gray-3"
            >
              <option value="15">15</option>
              <option value="10">10</option>
              <option value="5">5</option>
            </select>
          </label>
        </div>

        {/* Modal เพิ่มรายการ */}
        {modalOpen && (
          <ModalBook
            closeModal={() => {
              setModalOpen(false);
              setRefresh(!refresh);
            }}
            product={product}
          />
        )}

        {/* แก้ไขรายการ */}
        {modalEditOpen && (
          <ModalBookEdit
            closeEditModal={() => {
              setModalEditOpen(false);
              setRefresh(!refresh);
            }}
            setProduct={setProduct}
            product={product}
          />
        )}
      </div>

      {/* ตาราง */}
      <div className="grid grid-cols-6 border-t border-stroke py-2 text-white bg-blue-400 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">ชื่อหนังสือ ModalBookEdit </p>
        </div>
        <div className="col-span-1 hidden items-center sm:flex">
          <p className="font-medium">ชื่อผู้แต่ง</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">ISBN</p>
        </div>
        {/* <div className="col-span-1 flex items-center">
          <p className="font-medium">totalCopies</p>
        </div> */}

        {/* <div className="col-span-2 flex items-center">
          <p className="font-medium">Action</p>
        </div> */}
        <div className="col-span-1 flex items-center">
          {/* <p className="font-medium">รูปภาพ</p> */}
        </div>
      </div>
      {/* title,author,isbn,totalCopies,availableCopies */}
      {products?.map((book, key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke py-2 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-2 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="col-span-2 text-sm text-black dark:text-white">
                {key + 1 + itemsPerPage * currentPage - itemsPerPage}.{" "}
                {book.title}
              </p>
            </div>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">{book.author}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{book.isbn}</p>
          </div>
          {/* <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">
              {book.totalCopies}
            </p>
          </div> */}
          <div className="col-span-1 flex items-center">
            <HiPencil
              size={30}
              className="text-red-700 mx-4"
              onClick={() => {
                editproduct(book);
              }}
            />
            <HiTrash
              size={30}
              className="text-red-700"
              onClick={() => {
                DelBook(book.id);
              }}
            />
          </div>
          <div className="col-span-2 flex items-center">
            {book.bookpictures?.map((image, index) => (
              <div className="w-16 mx-2" key={index}>
                {/* {`${URL}` + image.url} */}
                <img
                  src={`${BACK_URL}` + image.url}
                  onClick={() => {
                    Delimage(image.id);
                  }}
                  className="h-10"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex  justify-center mt-1 text-xl text-gray-500">
        รายการทั้งหมด {totalProducts}
      </div>
      <div className="flex flex-row mx-auto justify-center py-2 px-4 md:px-6 xl:px-7.5">
        <ReactPaginate
          breakLabel={"..."}
          pageCount={endpoint}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          pageClassName={"inline-block mx-1"}
          pageLinkClassName={
            "block px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          }
          previousClassName={"inline-block mx-1"}
          previousLinkClassName={
            "block px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          }
          nextClassName={"inline-block mx-1"}
          nextLinkClassName={
            "block px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          }
          breakClassName={"inline-block mx-1"}
          breakLinkClassName={
            "block px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          }
          activeClassName={"bg-blue-300 text-white rounded-md border-blue-100"}
          containerClassName={"flex items-center space-x-2"}
          previousLabel={
            <IconContext.Provider value={{ color: "#B8C1CC", size: "24px" }}>
              <AiFillLeftCircle />
            </IconContext.Provider>
          }
          nextLabel={
            <IconContext.Provider value={{ color: "#B8C1CC", size: "24px" }}>
              <AiFillRightCircle />
            </IconContext.Provider>
          }
        />
      </div>
    </div>
  );
};

export default AdminBookDetail;
