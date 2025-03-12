import { useState, useEffect } from "react";
import axios from "axios";
import { HiTrash } from "react-icons/hi";
import { HiPencil } from "react-icons/hi";
import ReactPaginate from "react-paginate";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons"; // for customizing icons
import "./styles.css";
import { BACK_URL } from "../../URL.jsx";
import Modal from "../../components/modal";
import Swal from "sweetalert2";

const AdminGroupMemberDetail = () => {
  const token = JSON.parse(localStorage.getItem("auth")).token;
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  const [refresh, setRefresh] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [sunDay, setSunDay] = useState("");

  //page
  const [search, setSearch] = useState("");
  const [totalGroups, setTotalGroups] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalGroups / itemsPerPage);

  const [data, setData] = useState({
    name: "",
    borrowLimit: "",
    returnDays: "",
    fineprice: "",
  });
  const [editId, setEditId] = useState(0);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  // เรียก MOdal Edit
  const editLocation = async (location) => {
    setEditId(location.id);
    setData(location);
    openModalEdit({ location });
  };

  useEffect(() => {
    // setTimeout(() => {
    fetchGroup();
    // }, 500);
  }, [search, currentPage, refresh, itemsPerPage]);

  //เรียกข้อมูล
  const fetchGroup = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/api/group`, {
        params: { search, currentPage, itemsPerPage },
      });
      setTotalGroups(response.data.totalgroup);
      setGroups(response.data.groups);
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  };

  // เรียก MOdal Edit
  const editGroup = async (group) => {
    setEditId(group.id);
    setData(group);
    openModalEdit({ group });
  };

  //ลบ  groups
  const deletegroup = async (id) => {
    if (window.confirm("ยืนยันการลบ!")) {
      try {
        alert(id);
        const response = await axios.delete(`${BACK_URL}/api/group/` + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        fetchGroup();
      } catch (error) {
        console.error("Error fetching group", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(sunDay)
    const name = data.name;
    try {
      if (editId == 0) {
        await axios.post(
          `${BACK_URL}/api/group`,
          {
            name: data.name,
            borrowLimit: data.borrowLimit,
            returnDays: data.returnDays,
            fineprice: data.fineprice,
            sunDay:sunDay
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "บันทึกสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        });
        closeModal();
        fetchGroup();
      } else {
        await axios.put(
          // alert(data.sunDay)
          `${BACK_URL}/api/group/` + editId,
          {
            name: data.name,
            borrowLimit: data.borrowLimit,
            returnDays: data.returnDays,
            status: data.status,
            fineprice: data.fineprice,
            sunDay:sunDay
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "บันทึกการแก้ไขสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        });
        closeModal();
        fetchGroup();
      }
    } catch (error) {
      alert("เกิดข้อผิกพลาด" + error);
      console.error("Error saving books:", error);
    }
  };
  const cancleinsert = async () => {
    if (window.confirm("ยืนยันยกเลิก ?")) {
      await closeModal();
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="my-1">
        {/* ปุ่มเพิ่มรายการ */}
        <div className="flex flex-row py-1 mx-auto justify-between ">
          <button
            onClick={openModal}
            className="bg-green-400 px-5  rounded-md mx-10 1 text-white "
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
      </div>

      <Modal
        title="เพิ่มการซ่อม"
        isOpen={showModal}
        onClose={() => closeModal()}
        size="xl"
      >
        <div className="relative bg-white rounded-lg shadow w-[750px] px-10 py-10">
          <h2>รายการกลุ่มสมาชิก</h2>
          {JSON.stringify(data)}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-0">
                ชื่อกลุ่มสมาชิก
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                value={data?.name}
                name="name"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-0">
                จำนวนวันที่ยืม:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="Number"
                name="borrowLimit"
                value={data?.borrowLimit}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-0">
                จำนวนหนังสือที่ยืม:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="Number"
                name="returnDays"
                value={data?.returnDays}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-0">
                ค่าปรับ:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="Number"
                name="fineprice"
                value={data?.fineprice}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* setSunDay */}

            <label className="mx-4 text-black py-2">
              <b> ถ้าวันส่งคืนตรงกับวันเสาร์: </b>
              <select
                name="selectedSunDay"
                value={data?.setSunDay}
                onChange={(e) => setSunDay(e.target.value)}
                className="px-5  bg-gray-3"
              >
                <option value="0">ไม่เปลี่ยนวันส่งคืน</option>
                <option value="1">วันจันทร์</option>
                <option value="-1">วันศุกร์</option>
              </select>
            </label>

            <hr className="my-2"></hr>

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
      </Modal>

      {/* ตาราง */}
      <div className="grid grid-cols-6 border-t border-stroke py-2 text-white bg-blue-400 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">ชื่อสมาชิก</p>
        </div>
        <div className="col-span-1 hidden items-center sm:flex">
          <p className="font-medium">จำนวนหนังสือที่ยืม</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">จำนวนวันที่ยืม</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">ค่าปรับ</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium"></p>
        </div>
      </div>
      {groups?.map((group, key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke py-2 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-2 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="">
                {key + 1 + itemsPerPage * currentPage - itemsPerPage}.{" "}
                {group.name}
              </p>
            </div>
          </div>
          <div className="col-span-1 hidden  mx-10 items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {group.borrowLimit}
            </p>
          </div>
          <div className="col-span-1 hidden mx-10  items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {group.returnDays}
            </p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-sm mx-2 text-black dark:text-white">
              {group.fineprice}
            </p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-sm mx-2 text-black dark:text-white">
            {group.setSunDay === 0 ? "ไม่เปลี่ยนวันส่งคืน" : group.setSunDay === 1 ? "วันจันทร์" : "วันศุกร์"}

            </p>
          </div>

          <div className="col-span-1 flex items-center">
            <HiPencil
              size={30}
              className="text-red-700 mx-4"
              onClick={() => {
                editGroup(group);
              }}
            />

            <HiTrash
              size={30}
              className="text-red-700"
              onClick={() => {
                deletegroup(group.id);
              }}
            />
          </div>
        </div>
      ))}
      <div className="flex  justify-center mt-2 text-xl text-gray-500">
        รายการทั้งหมด {totalGroups}
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

export default AdminGroupMemberDetail;
