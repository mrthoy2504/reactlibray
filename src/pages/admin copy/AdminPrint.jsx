import { useState, useEffect } from "react";
import axios from "axios";
import { BACK_URL } from "../../URL.jsx";


import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons"; // for customizing icons

import ReactPaginate from "react-paginate";
import "./styles.css";
import jsBarcode from "jsbarcode";

const AdminMemberDetail = () => {
  const token = JSON.parse(localStorage.getItem("auth")).token;
  const [memberId, setMemberId] = useState("");
  const [members, setMembers] = useState([
    { name: "", description: "", pictures: [] },
  ]);
  const [refresh, setRefresh] = useState("");

  //page
  const [search, setSearch] = useState("");
  const [totalProducts, setTotalMembers] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalProducts / itemsPerPage);

  // //เรียกข้อมูล
  // const fetchMembers = async () => {
  //   try {
  //     const response = await axios.get(`${BACK_URL}/members`, {
  //       params: { search, currentPage, itemsPerPage },
  //     });
  //     // alert(JSON.stringify(response.data))
  //     setTotalMembers(response.data.totalMembers);
  //     setMembers(response.data.Members);
  //   } catch (error) {
  //     console.error("Error fetching members", error);
  //   }
  // };
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

  useEffect(() => {
    setTimeout(() => {
      fetchMembers();
    }, 500);
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
            onClick={handlePrint}
            className=" bottom-10 mx-2 bg-blue-500 text-white px-4 py-2 rounded print:hidden"
          >
            Print Member Card
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
      <div id="print-content">
        <div className="grid grid-cols-2 gap-4 ">
          {members.map((member, index) => (
            <>
              <div className="flex flex-row  border border-stroke " key={index}>
                <div className="mx-5 py-5">
                  <img
                    src={`http://localhost:5000` + member.pictures[0]?.url}
                    className="h-32 "
                  />
                </div>
                <div className="py-2 text-xs mt-2" >
                  <p className="text-xs">รหัสสมาชิก: {member.codeId}</p>
                  <p>ชื่อสมาชิก: {member.name}</p>
                  <p>ชื่อสมาชิก: {member.phone}</p>
                  <p>วันที่ออกบัตร:{member.updatedAt}</p>
                  <p>กลุ่มสมาชิก:{member.Group?.name}</p>
                  <div className="">
                    <svg
                      id={`barcode-${member.codeId}`}
                      ref={(el) => {
                        if (el) {
                          jsBarcode(el, member.codeId, {
                            format: "CODE128",
                            displayValue: true,
                            fontSize: 14,
                            height: 25,
                          });
                        }
                      }}
                    ></svg>
                  </div>
                </div>
              </div>
              {/* บาร์โค้ด */}
            </>
          ))}
        </div>
      </div>
      <div className="flex  justify-center mt-2 text-xl text-gray-500">
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

export default AdminMemberDetail;
