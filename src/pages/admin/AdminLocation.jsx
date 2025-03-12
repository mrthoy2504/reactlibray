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

const AdminLocation = () => {
  const token = JSON.parse(localStorage.getItem("auth")).token;
  const [locations, setLocations] = useState([]);
  //page
  const [search, setSearch] = useState("");
  const [totalLocations, setTotalLocations] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const endpoint = Math.ceil(totalLocations / itemsPerPage);
  const [editId, setEditId] = useState(0);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
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

  const fectLocation = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/api/location`, {
        params: { search, currentPage, itemsPerPage },
      });
      setLocations(response.data.Location);
      setTotalLocations(response.data.totalLocation);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fectLocation();
  }, [search, currentPage, itemsPerPage, refresh]);

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
  const deleteLocation = async (id) => {
    if (window.confirm("Are you sure you want to delete ?")) {
      try {
        await axios.delete(`${BACK_URL}/api/location/` + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fectLocation();
      } catch (error) {
        console.error("Error fetching location", error);
      }
    }
  };

  // เรียก MOdal Edit
  const editLocation = async (location) => {
    setEditId(location.id);
    setData(location);
    openModalEdit({ location });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = data.name;
    try {
      if (editId == 0) {
        await axios.post(
          `${BACK_URL}/api/location/`,
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
        closeModal();
        fectLocation();
      } else {
        await axios.put(
          `${BACK_URL}/api/location/` + editId,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        closeModal();
        fectLocation();
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
          <p className="font-medium">ชื่อสถานที่เก็บ</p>
        </div>

        <div className="col-span-1 flex items-center">
          <p className="font-medium">Action</p>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {locations.map((location, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="col-span-2 text-sm text-black dark:text-white">
                    {key + 1 + itemsPerPage * currentPage - itemsPerPage}.{" "}
                    {location.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-1 flex items-center">
              <HiPencil
                size={30}
                className="text-red-700 mx-4"
                onClick={() => {
                  editLocation(location);
                }}
              />
              <HiTrash
                size={30}
                className="text-red-700"
                onClick={() => {
                  deleteLocation(location.id);
                }}
              />
            </div>
          </div>
        ))}

        <Modal
          title="เพิ่มการซ่อม"
          isOpen={showModal}
          onClose={() => closeModal()}
          size="xl"
        >
          <div className="flex gap-4">
            <div className="relative bg-white rounded-lg shadow w-[750px] px-10 py-10">
              <h2 className="flex flex-row text-xl text-gray-500 justify-center">
                {"เพิ่มรายการชื่อสถานที่เก็บ"}
              </h2>
              <form onSubmit={handleSubmit}>
                <label className=" text-gray-700 ">
                  ชื่อสถานที่เก็บ:
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
          รายการทั้งหมด {totalLocations}
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

export default AdminLocation;
