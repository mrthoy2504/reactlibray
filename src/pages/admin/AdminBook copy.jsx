import { useState, useEffect } from "react";
import axios from "axios";
import { HiTrash } from "react-icons/hi";
import { HiPencil } from "react-icons/hi";
import ReactPaginate from "react-paginate";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { IconContext } from "react-icons";
import { BACK_URL } from "../../URL.jsx";
import { useAuth } from "../../context/auth";
import Modal from "../../components/modal";
import Swal from "sweetalert2";

const AdminBookDetail = () => {
  const [auth, setAuth] = useAuth();
  const token = JSON.parse(localStorage.getItem("auth")).token;

  const [showModal, setShowModal] = useState(false);
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState("");
  const [refresh, setRefresh] = useState("");
  const [modalEditOpen, setModalEditOpen] = useState(false);

  //paginator
  const [search, setSearch] = useState("");
  const [totalBooks, setTotalBooks] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalBooks / itemsPerPage);

  // const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  // const [id, setId] = useState(0);
  const [editId, setEditId] = useState(0);

  const [data, setData] = useState({
    title: "",
    author: "",
    isbn: "",
    totalCopies: "",
    availableCopies: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchLocations();
  }, []);

  // Paginator
  useEffect(() => {
    fetchBooks();
  }, [search, currentPage, refresh, itemsPerPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/categories/all`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `${BACK_URL}/api/location/all/getlocation`
      );
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  //เรียกข้อมูล
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/books`, {
        params: { search, currentPage, itemsPerPage },
      });
      setTotalBooks(response.data.totalBooks);
      setBooks(response.data.books);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // ดึงไฟล์ตัวแรกจาก FileList
    if (!file) return; // ป้องกัน error ถ้าไม่มีไฟล์
    if (file.size > 2 * 1024 * 1024) {
      // ตรวจสอบขนาดไฟล์ (ไม่เกิน 2MB)
      alert("File size must be less than 2MB");
      return;
    }
    const previewUrl = URL.createObjectURL(file); // สร้าง URL ชั่วคราว
    setImagePreviewUrl(previewUrl); // ตั้งค่ารูปตัวอย่าง
    setSelectedFiles(file); // เก็บไฟล์ที่เลือก
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  //ลบ Book
  const DelBook = async (id) => {
    if (window.confirm("ยืนยันการลบ ?" + id)) {
      try {
        const response = await axios.delete(`${BACK_URL}/books/` + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchBooks();
      } catch (error) {
        alert("!เกิดข้อผิดพลาด ไม่ใช่Admin หรือ มีรายการบันทึกการยืม");
        console.error("Error delete !Admin", error);
      }
    }
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPage(currentPage);
  };

  //search
  const handleSearchChange = (e) => {
    setCurrentPage(1);
    setSearch(e.target.value);
  };

  //เพิ่มรายการ
  const openModal = () => {
    setData({
      title: "",
      author: "",
      isbn: "",
      totalCopies: "",
      availableCopies: "",
      categoryId: "",
      image: "",
    });
    setSelectedFiles(null);
    setImagePreviewUrl(null);
    setShowModal(true);
  };

  const openModalEdit = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(0);
  };

  const editproduct = async (book) => {
    setEditId(book.id);
    setData(book);
    setSelectedFiles(null); // แก้ไขตรงนี้
    if (book.image) {
      setImagePreviewUrl(`${BACK_URL}${book.image}`);
    } else {
      setImagePreviewUrl(null);
    }
    setModalEditOpen(true);
    setShowModal(true);
  };

  const cancleinsert = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      await closeModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.title === "" || data.isbn === "") {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "ข้อมูลไม่ครบ",
        showConfirmButton: false,
        timer: 1000,
      });
      return; // หยุดการทำงานที่นี่
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("isbn", data.isbn);
    formData.append("categoryId", data.categoryId);
    formData.append("locationId", data.locationId);
    formData.append("totalCopies", data.totalCopies);
    formData.append("availableCopies", data.availableCopies);

    if (selectedFiles) {
      formData.append("images", selectedFiles);
    }

    try {
      if (editId === 0) {
        const response = await fetch(`${BACK_URL}/books`, {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 400) {
          Swal.fire({
            position: "center",
            icon: "error",
            title:
              "เกิดข้อผิดพลาด ตรวจสอบ ISBN สถานที่เก็บ หรือ หมวดหมู่หนังสือ",
            showConfirmButton: true,
            // timer: 1000,
          });

          return;
        }

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "บันทึกสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        });

        closeModal();
        fetchBooks();
      } else {
        await axios.put(`${BACK_URL}/books/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "บันทึกการแก้ไขสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        });

        setSelectedFiles(null); // รีเซ็ตไฟล์ที่เลือก
        setPreviewImages([]);
        setEditId(0);
        closeModal();
        fetchBooks();
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
      console.error("Error saving books:", error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="my-1">
        <div className="flex flex-row py-1 mx-auto justify-between ">
          <button
            onClick={openModal}
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

        {/*EditModal แก้ไขรายการ */}
        {modalEditOpen && (
          <Modal isOpen={showModal} onClose={() => closeModal()} size="xl" />
        )}

        {/* Modal เพิ่มรายการ */}
        <Modal
          title="เพิ่ม"
          isOpen={showModal}
          onClose={() => closeModal()}
          size="xl"
        >
          <div className="flex gap-4">
            <div className="w-1">
              <div className="relative bg-white rounded-lg shadow w-[750px] px-10 py-10">
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
                      required
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

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-0">
                      สถานที่เก็บ:
                    </label>

                    <select
                      name="locationId"
                      value={data?.locationId}
                      onChange={handleInputChange}
                      required
                      className="shadow  border  rounded py-1  px-1 text-gray-700 mb-1 "
                    >
                      <option value="">เลือกสถานที่เก็บ</option>
                      {locations?.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <hr className="my-2"></hr>
                  <div className="flex flex-row justify-start mx-auto mb-1">
                    <section className="pl-5 pr-2">รูปภาพ: </section>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <div>
                      {imagePreviewUrl && (
                        <img
                          src={imagePreviewUrl}
                          alt="Book Preview"
                          className=" h-32 object-cover rounded-lg mt-2"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row justify-center mx-auto">
                    <button
                      type="submit"
                      className="bg-green-500 px-10 py-2 text-white rounded-md my-2 mx-5"
                    >
                      บันทึก
                    </button>
                    <button
                      type="button"
                      onClick={cancleinsert}
                      className="bg-red-500 px-10 py-2 text-white rounded-md my-2"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      {/* ตาราง */}
      <div className="grid grid-cols-6 border-t border-stroke py-2 text-white bg-blue-400 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">ชื่อหนังสือ </p>
        </div>
        <div className="col-span-1 hidden items-center sm:flex">
          <p className="font-medium"></p>
        </div>
        <div className="col-span-1 hidden items-center sm:flex">
          <p className="font-medium">ชื่อผู้แต่ง</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">ISBN</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">สถานที่เก็บ</p>
        </div>
        <div className="col-span-1 flex items-center"></div>
      </div>
      {books?.map((book, key) => (
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

          <div className="col-span-1 flex items-center">
            <img src={`${BACK_URL}` + book.image} className="h-10" />
          </div>

          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">{book.author}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{book.isbn}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">
              {book.location.name}
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
        </div>
      ))}
      <div className="flex  justify-center mt-1 text-xl text-gray-500">
        รายการทั้งหมด {totalBooks}
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
