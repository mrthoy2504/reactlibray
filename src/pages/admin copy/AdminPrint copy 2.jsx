import { useState, useEffect } from "react";
import axios from "axios";
import { BACK_URL } from "../../URL.jsx";

import { ModalMember } from "./Modal/ModalMember.jsx";
import { ModalMemberEdit } from "./Modal/ModalMemberEdit.jsx";
import ModalPrint from "./Modal/ModalPrint.jsx";

import { HiTrash } from "react-icons/hi";
import { HiPencil } from "react-icons/hi";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons"; // for customizing icons

import ReactPaginate from "react-paginate";
import "./styles.css";

const AdminMemberDetail = () => {
  const token = JSON.parse(localStorage.getItem("auth")).token;
  const [memberId, setMemberId] = useState("");
  const [members, setMembers] = useState([
    { name: "", description: "", pictures: [] },
  ]);
  const [refresh, setRefresh] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalPrintOpen, setModalPrintOpen] = useState(false);

  //page
  const [search, setSearch] = useState("");
  const [totalProducts, setTotalMembers] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalProducts / itemsPerPage);

  //เรียกข้อมูล
  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/members`, {
        params: { search, currentPage, itemsPerPage },
      });
      // alert(JSON.stringify(response.data))
      setTotalMembers(response.data.totalMembers);
      setMembers(response.data.Members);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  //ลบ  members
  const deletemember = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        alert(id);
        const response = await axios.delete(`${BACK_URL}/members/` + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        fetchMembers();
      } catch (error) {
        console.error("Error fetching products", error);
      }
    }
  };

  //ลบ image member
  const deleteimage = async (id) => {
    if (window.confirm("Are you sure you want to delete this image member?")) {
      try {
        const response = await axios.delete(`${BACK_URL}/members/image/` + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        fetchMembers();
      } catch (error) {
        console.error("Error fetching products", error);
      }
    }
  };

  useEffect(() => {
    // setTimeout(() => {
    fetchMembers();
    // }, 500);
  }, [search, currentPage, refresh, itemsPerPage]);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPage(currentPage);
  };

  //search
  const handleSearchChange = (e) => {
    setCurrentPage(1);
    setSearch(e.target.value);
  };

  // เรียก MOdal Edit
  const editmember = async (id) => {
    setMemberId(id);
    setModalEditOpen(true);
  };

  const membertest = {
    id: 5,
    name: "พนักงาน",
    description: "พนักงาน",
    status: true,
    groupId: 4,
    createdAt: "2024-12-12T05:41:30.856Z",
    updatedAt: "2024-12-22T06:45:06.331Z",
    codeId: 10005,
    pictures: [{ id: 7, url: "/uploads/1733982090842-2.jfif", memberId: 5 }],
    Group: {
      id: 4,
      name: "พนักงาน",
      borrowLimit: 4,
      returnDays: 4,
      status: true,
      fineprice: 10,
    },
  };

  const handlePrint = () => {
    // ซ่อนทุกสิ่งที่ไม่ใช่พื้นที่ที่ต้องการพิมพ์
    const printContent = document.getElementById("print-content");
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;

    window.print();

    // คืนค่าผลลัพธ์เดิมหลังพิมพ์เสร็จ
    document.body.innerHTML = originalContent;
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="my-1">
        {/* {JSON.stringify(members)} */}
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
      </div>

      < >
        <div className="flex flex-row " id="print-content">
          {/* {JSON.stringify(members)} */}
          {members.map((member, key) => (
            <div
              className="flex-1 w-64 border border-stroke py-2 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
              key={key}
            >
              <div className="flex ">
                <div className="flex-1 w-14 ...">
                  <img
                    src={`http://localhost:5000` + member.pictures[0]?.url}
                    className="w-16"
                  />
                </div>
                <div className="flex-1 w-64 ...">
                <p>รหัสสมาชิก: {member.codeId}</p>
                <p>ชื่อสมาชิก: {member.name}</p>
                <p>วันที่ออกบัตร:{member.updatedAt}</p>
                <p>กลุ่มสมาชิก:{member.Group?.name}</p>
                  </div>
              </div>


            </div>
          ))}
        </div>
      </>
      {/* {JSON.stringify(members)} */}
      <button
        onClick={handlePrint}
        className="absolute bottom-10 bg-blue-500 text-white px-4 py-2 rounded print:hidden"
      >
        Print Member Card
      </button>
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

export default AdminMemberDetail;
