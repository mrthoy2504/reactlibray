// import { Product } from '../../types/product.ts';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ModalBook } from "./Modal/ModalBook.jsx";
import { ModalBookEdit } from "./Modal/ModalBookEdit.jsx";
import { HiTrash } from "react-icons/hi";
import { HiPencil } from "react-icons/hi";
import ReactPaginate from "react-paginate";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons"; // for customizing icons
import "./styles.css";
import { BACK_URL } from "../../URL.jsx";
import { useAuth } from "../../context/auth";
import Modal from "./Modal//bookModal.jsx";

const AdminBookDetail = () => {
  const [showModal, setShowModal] = useState(false);

  const [auth, setAuth] = useAuth();
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
  // const token = JSON.parse(localStorage.getItem("auth")).token;

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [data, setData] = useState({
    title: "",
    author: "",
    isbn: "",
    totalCopies: "",
    availableCopies: "",
    categoryId: "",
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const API = axios.create({
    baseURL: BACK_URL,
  });
  API.interceptors.request.use((req) => {
    if (localStorage.getItem("token")) {
      req.headers.Authorization = `Bearer ${JSON.parse(
        localStorage.getItem("token")
      )}`;
    }
    JSON.parse(localStorage.getItem("token"))
      ? null
      : alert("่กรุณา login ใหม่");
    // window.location.href = '/';
    // window.location.href = '/';
    return req;
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/categories/all`);
      // alert(JSON.stringify(response.data))
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // ตรวจสอบขนาดไฟล์ (ไม่เกิน 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }
    if (file) {
      const previewUrl = URL.createObjectURL(file); // สร้าง URL ชั่วคราว
      setImagePreviewUrl(previewUrl);
    }
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // title, author, isbn, totalCopies, availableCopies ,categoryId
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("isbn", data.isbn);
    formData.append("categoryId", data.categoryId);
    formData.append("totalCopies", data.totalCopies);
    formData.append("availableCopies", data.availableCopies);
    selectedFiles.forEach((image) => {
      formData.append("images", image);
    });
    try {
      //  const response = await axios.delete(`${URL}/books/` + id, {
      //     headers: { Authorization: `Bearer ${token}` },
      //   });
      const response = await fetch(`${BACK_URL}/books`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(JSON.stringify(response));
      // await axios.post(`${BACK_URL}/books`,{ headers: { Authorization: `Bearer ${token}` },formData });
      closeModal();
    } catch (error) {
      console.error("Error saving books:", error);
    }
  };

  const cancleinsert = async () => {
    // if (window.confirm("Are you sure you want to delete this book?")) {
    await closeModal();
    // }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  //เรียกข้อมูล
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${URL}/books`, {
        params: { search, currentPage, itemsPerPage },
      });
      setTotalProducts(response.data.totalBooks);
      setProducts(response.data.books);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  //ลบ  image product
  const Delimage = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?" + id)) {
      try {
        const response = await axios.delete(`${URL}/books/image/` + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        fetchBooks();
      } catch (error) {
        console.error("Error fetching products", error);
      }
    }
  };

  //ลบ Book
  const DelBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?" + id)) {
      try {
        const response = await axios.delete(`${URL}/books/` + id, {
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

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="my-1">
        {/* ปุ่มเพิ่มรายการ */}
        {/* <b className="flex flex-row justify-start mx-2 text-gray-400 py-1 px-10 ">
        รายการสินค้า
      </b> */}
        <div className="flex flex-row py-1 mx-auto justify-between ">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-green-400 px-5 py-2 rounded-md mx-10 text-white "
          >
            เพิ่มรายการ
          </button>
          <button className="btn btn-primary" onClick={handleShowModal}>
            <i className="fa-solid fa-plus mr-2"></i>
            เพิ่มข้อมูล
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
        <div className="col-span-1 flex items-center">
          <p className="font-medium">totalCopies</p>
        </div>

        <div className="col-span-2 flex items-center">
          <p className="font-medium">Action</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">รูปภาพ</p>
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
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">
              {book.totalCopies}
            </p>
          </div>
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
                  src={`${URL}` + image.url}
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

      <Modal
        title="ทะเบียนวัสดุ อุปกรณ์"
        isOpen={showModal}
        onClose={handleCloseModal}
      >
        <div className="">
          <h2>รายการหนังสือ</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-0">
                ชื่อหนังสือ
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                value={data?.title}
                name="title"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-0">
                ชื่อผู้แต่ง:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="author"
                value={data?.author}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-row justify-start mx-auto">
              <div className="mb-1 w-1/4 pr-5">
                <label className="block text-gray-700 text-sm font-bold ">
                  ISBN:
                </label>
                <input
                  className="shadow appearance-none border  rounded w-full py-1 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
                  name="isbn"
                  type="text"
                  value={data?.isbn}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-1 w-1/4">
                <label className="block text-gray-700 text-sm font-bold ">
                  จำนวนหนังสือทั้งหมด:
                </label>
                <input
                  className="shadow appearance-none border  rounded w-full py-1 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  name="totalCopies"
                  type="number"
                  value={data?.totalCopies}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-1 w-1/4 mx-5">
                <label className="block text-gray-700 text-sm font-bold ">
                  หนังสือที่ยืมได้:
                </label>
                <input
                  className="shadow appearance-none border  rounded w-full py-1 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  name="availableCopies"
                  type="number"
                  value={data?.availableCopies}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-0">
                หมวดหมู่:
              </label>

              <select
                name="categoryId"
                value={data?.categoryId}
                onChange={handleInputChange}
                // required
                className="shadow  border  rounded py-1  px-1 text-gray-700 mb-1 "
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category?.name}
                  </option>
                ))}
              </select>
            </div>
            <hr className="my-2"></hr>
            <div className="flex flex-row justify-start mx-auto mb-1">
              <section className="pl-5 pr-2">รูปภาพ: </section>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              <div>
                {imagePreviewUrl && (
                  <img
                    src={imagePreviewUrl}
                    alt="Image Preview"
                    style={{ width: "100px" }}
                  />
                )}
              </div>
            </div>
            {/* <div className="flex flex-row justify-start mx-auto mt-3">
            <label className="mx-2">Images:</label>
            <input type="file" multiple onChange={handleFileChange} />
          </div> */}

            <div className="flex flex-row justify-center mx-auto">
              <button
                type="submit"
                className="bg-green-500 px-10 py-2 text-white rounded-md my-2 mx-5"
              >
                บันทึก
              </button>
              <button
                type="button"
                // onClick={cancleinsert}
                className="bg-red-500 px-10 py-2 text-white rounded-md my-2"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>

        <button className="btn btn-primary mt-3">
          <i className="fa-solid fa-check mr-3"></i>
          บันทึกข้อมูล
        </button>
      </Modal>

      <div className="flex  justify-center mt-2 text-xl text-gray-500">
        รายการทั้งหมด {totalProducts}
      </div>
      <div className="flex flex-row mx-auto  justify-center py-6 px-4 md:px-6 xl:px-7.5 ">
        <ReactPaginate
          breakLabel={"..."}
          pageCount={endpoint}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"activepag"}
          containerClassName={"pagination"}
          previousLabel={
            <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
              <AiFillLeftCircle />
            </IconContext.Provider>
          }
          nextLabel={
            <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
              <AiFillRightCircle />
            </IconContext.Provider>
          }
        />
      </div>
    </div>
  );
};

export default AdminBookDetail;
