import { useState, useEffect } from "react";
import axios from "axios";
import { ModalGroup } from "./Modal/ModalGroup.jsx";
import { ModalGroupEdit } from "./Modal/ModalGroupEdit.jsx";
import { HiTrash } from "react-icons/hi";
import { HiPencil } from "react-icons/hi";
import ReactPaginate from "react-paginate";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons"; // for customizing icons
import "./styles.css";
import { BACK_URL } from "../../URL.jsx";

const AdminGroupMemberDetail = () => {
  const token = JSON.parse(localStorage.getItem("auth")).token;
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  const [refresh, setRefresh] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);

  //page
  const [search, setSearch] = useState("");
  const [totalGroups, setTotalGroups] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalGroups / itemsPerPage);

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
  const editGroup = async (id) => {
    setGroupId(id);
    setModalEditOpen(true);
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

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="my-1">
        {/* ปุ่มเพิ่มรายการ */}
        <div className="flex flex-row py-1 mx-auto justify-between ">
          <button
            onClick={() => setModalOpen(true)}
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

        {/* Modal เพิ่มรายการ */}
        {modalOpen && (
          <ModalGroup
            closeModal={() => {
              setModalOpen(false);
              setRefresh(!refresh);
            }}
          />
        )}

        {/* แก้ไขรายการ */}
        {modalEditOpen && (
          <ModalGroupEdit
            closeModal={() => {
              setModalEditOpen(false);
              setRefresh(!refresh);
            }}
            groupId={groupId}
            setGroupIds={setGroupId}
          />
        )}
      </div>

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


          <div className="col-span-1 flex items-center">
            <HiPencil
              size={30}
              className="text-red-700 mx-4"
              onClick={() => {
                editGroup(group.id);
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
