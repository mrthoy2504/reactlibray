import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACK_URL } from "../../URL.jsx";
import ReactPaginate from "react-paginate";
import { HiTrash } from "react-icons/hi";
import { HiPencil } from "react-icons/hi";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { IconContext } from "react-icons";

const BorrowingReport = () => {
  const [report, setReport] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //page
  // const [search, setSearch] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  // const [totalDayReport, setTotalDayReport] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalRecords / itemsPerPage);

  const formatThaiDate = (isoDate) => {
    const date = new Date(isoDate);
    // ดึงข้อมูลวัน เดือน และปี และจัดรูปแบบให้เป็นวัน/เดือน/ปี พ.ศ.
    const day = date.getDate();
    const month = date.getMonth() + 1; // เดือนใน JavaScript เริ่มจาก 0
    const year = date.getFullYear() + 543; // เพิ่มปี 543 เพื่อให้เป็น พ.ศ.
    return `${day}/${month}/${year}`;
  };


  const fetchReport = async () => {
    try {
      const { data } = await axios.get(`${BACK_URL}/api/reportday/day`, {
        params: {
          currentPage,
          itemsPerPage,
          startDate,
          endDate,
        },
      });
      // alert(JSON.stringify(data.report))
      setReport(data.report);
      setTotalRecords(data.totalFindDay);
    } catch (error) {
      console.error("Error fetching report", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchReport();
    }
  }, [currentPage, startDate, endDate]);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPage(currentPage);
  };

  return (
    <div className="p-1">
      <div className="mb-1 flex gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={fetchReport}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </div>
      {report.length > 0 && (
        <div>
          <h2 className="text-md font-semibold mb-2">รายการยืมหนังสือ</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-blue-400 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ลำดับ</th>
                <th className="border border-gray-300 px-4 py-2">ชื่อผู้ยืม</th>
                <th className="border border-gray-300 px-4 py-2">
                  ชื่อหนังสือ
                </th>
                <th className="border border-gray-300 px-4 py-2">วันที่ยืม</th>
                <th className="border border-gray-300 px-4 py-2">วันที่คืน</th>
                <th className="border border-gray-300 px-4 py-2">
                  ชื่อผู้ทำรายการ
                </th>
              </tr>
            </thead>
            <tbody>
              {report.map((record, index) => (
                <tr key={record.id}>
                  {record.returnDate ? (
                    <td className="border bg-gray-100 px-4 py-2">
                      {index + 1}
                    </td>
                  ) : (
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                  )}

                  {record.returnDate ? (
                    <td className="border bg-gray-100 px-4 py-2">
                      {record.member.name}
                    </td>
                  ) : (
                    <td className="border border-gray-300 px-4 py-2">
                      {record.member.name}
                    </td>
                  )}

                  {record.returnDate ? (
                    <td className="border bg-gray-100 px-4 py-2">
                      {record.book.title}
                    </td>
                  ) : (
                    <td className="border border-gray-300 px-4 py-2">
                      {record.book.title}
                    </td>
                  )}

                  {record.returnDate ? (
                    <td className="border bg-gray-100 px-4 py-2">
                      {formatThaiDate(record.borrowDate)}
                    </td>
                  ) : (
                    <td className="border border-gray-300 px-4 py-2">
                      {formatThaiDate(record.borrowDate)}
                    </td>
                  )}

                  {record.returnDate ? (
                    <td className="border bg-gray-100 px-4 py-2">
                      {formatThaiDate(record.returnDate)}
                    </td>
                  ) : (
                    <td className="border border-gray-300 px-4 py-2">
                      {record.returnDate}
                    </td>
                  )}

                  {record.returnDate ? (
                    <td className="border bg-gray-100 px-4 py-2">
                      {record.user.name}
                    </td>
                  ) : (
                    <td className="border border-gray-300 px-4 py-2">
                      {record.user.name}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex  justify-center mt-2 text-xl text-gray-500">
        รายการทั้งหมด {totalRecords}
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

export default BorrowingReport;
