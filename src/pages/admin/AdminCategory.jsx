import { useState, useEffect } from "react";
import axios from "axios";
import { HiTrash } from "react-icons/hi";
import { HiPencil } from "react-icons/hi";
import ReactPaginate from "react-paginate";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { IconContext } from "react-icons";
import { BACK_URL } from "../../URL.jsx";
import Modal from "../../components/modal";
import Swal from "sweetalert2";

const AdminCategoryDetail = () => {
  const token = JSON.parse(localStorage.getItem("auth")).token;
  const [categories, setCategories] = useState([]);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  //page
  const [search, setSearch] = useState("");
  const [totalCategories, setTotalCategories] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalCategories / itemsPerPage);

  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({
    name: "",
  });
  const [editId, setEditId] = useState(0);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/categories`, {
        params: { search, currentPage, itemsPerPage },
      });
      setCategories(response.data.Category);
      setTotalCategories(response.data.totalCategory);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search, currentPage, itemsPerPage]);

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

  //ลบ Product
  const deletecategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${BACK_URL}/categories/` + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchCategories();
      } catch (error) {
        console.error("Error fetching Categories", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // เรียก แก้ไขรายการ
  const editCategory = async (category) => {
    setEditId(category.id);
    setData(category);
    openModalEdit({ category });
  };
  //เพิ่มรายการ
  const openModal = () => {
    setData({ name: "" });
    setShowModal(true);
  };
  //เปิดmodal แก้ไข
  const openModalEdit = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditId(0);
  };
  /* แก้ไขรายการ */
  {
    modalEditOpen && (
      <Modal isOpen={showModal} onClose={() => closeModal()} size="xl" />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = data.name;
    try {
      if (editId == 0) {
        await axios.post(
          `${BACK_URL}/categories/`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "บันทึกสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        });
        fetchCategories();
        closeModal();
      } else {
        await axios.put(
          `${BACK_URL}/categories/` + editId,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "บันทึกการแก้ไขสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        });
        fetchCategories();
        closeModal();
      }
    } catch (error) {
      alert("เกิดข้อผิกพลาด" + error);
      console.error("Error saving books:", error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white  ">
      {/* ปุ่มเพิ่มรายการ */}
      <div className="flex flex-row py-2 mx-auto justify-between ">
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
          className="w-96 text-xl rounded-md border border-spacing-2-c px-2 py-1"
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

      <div className="grid grid-cols-6 border-t border-stroke py-2 text-white bg-blue-400 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">ชื่อหมวดหมู่</p>
        </div>

        <div className="col-span-1 flex items-center">
          <p className="font-medium">Action</p>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {categories.map((Category, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="col-span-2 text-sm text-black dark:text-white">
                    {key + 1 + itemsPerPage * currentPage - itemsPerPage}.{" "}
                    {Category.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-1 flex items-center">
              <HiPencil
                size={30}
                className="text-red-700 mx-4"
                onClick={() => {
                  editCategory(Category);
                }}
              />
              <HiTrash
                size={30}
                className="text-red-700"
                onClick={() => {
                  deletecategory(Category.id);
                }}
              />
            </div>
          </div>
        ))}

        <Modal
          title="เพิ่มรายการหมวดหมู่"
          isOpen={showModal}
          onClose={() => closeModal()}
          size="xl"
        >
          <div className="flex gap-4">
            <div className="relative bg-white rounded-lg shadow w-[750px] px-10 py-10">
              <h2 className="flex flex-row text-xl text-gray-500 justify-center">
                {"เพิ่มรายการหมวดหมู่"}
              </h2>
              <form onSubmit={handleSubmit}>
                <label className=" text-gray-700 ">
                  ชื่อหมวดหมู่:
                  <input
                    type="text"
                    name="name"
                    value={data?.name}
                    onChange={handleInputChange}
                    className="shadow appearance-none border text-gray-500 rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </label>
                <button
                  className="bg-green-500 px-10 py-2 text-white rounded-md my-2 mx-5"
                  type="submit"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </Modal>

        <div className="flex  justify-center mt-2 text-xl text-gray-500">
          รายการทั้งหมด {totalCategories}
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
            activeClassName={
              "bg-blue-300 text-white rounded-md border-blue-100"
            }
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
    </div>
  );
};

export default AdminCategoryDetail;
