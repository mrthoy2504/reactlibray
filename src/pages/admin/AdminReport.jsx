import { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons"; // for customizing icons
import "./styles.css";
import { BACK_URL } from "../../URL.jsx";
import { useAuth } from "../../context/auth";

const AdminReport = () => {
  const [auth, setAuth] = useAuth();
  const token = JSON.parse(localStorage.getItem("auth")).token;
  const [products, setProducts] = useState([]);
  //paginator
  const [search, setSearch] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalProducts / itemsPerPage);
  const [dueDate, setDueDate] = useState("");
  const [find, setFind] = useState("member");
  const [status, setStatus] = useState("all");
  //เรียกข้อมูล
  const fetchBorrows = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/borrows`, {
        params: { search, currentPage, itemsPerPage, status, find },
      });
      setTotalProducts(response.data.totalBorrowings);
      setProducts(response.data.Borrowings);
    } catch (error) {
      console.error("Error fetching borrower", error);
    }
  };
  //เรียกข้อมูล
  const fetchBorrowOne = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/borrows`, {
        params: { search, currentPage, itemsPerPage, status, find },
      });
      setTotalProducts(response.data.totalBorrowings);
      setProducts(response.data.Borrowings);
    } catch (error) {
      console.error("Error fetching borrower", error);
    }
  };
  const formatThaiDate = (isoDate) => {
    const date = new Date(isoDate);
    // ดึงข้อมูลวัน เดือน และปี และจัดรูปแบบให้เป็นวัน/เดือน/ปี พ.ศ.
    const day = date.getDate();
    const month = date.getMonth() + 1; // เดือนใน JavaScript เริ่มจาก 0
    const year = date.getFullYear() + 543; // เพิ่มปี 543 เพื่อให้เป็น พ.ศ.
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchBorrowOne();
  }, [itemsPerPage, status, search]);

  useEffect(() => {
    fetchBorrows();
  }, [currentPage, status]);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPage(currentPage);
  };
  //search
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    // setCurrentPage(1);
  };

  const changeStaus = (e) => {
    setItemsPerPage(e.target.value);
    //  setCurrentPage(1)
  };

  const calDateDif = (inputDate) => {
    const today = new Date();
    const targetDate = new Date(inputDate);
    const differenceInTime = targetDate - today; // ความต่างในหน่วยมิลลิวินาที
    const differenceInDays = Math.floor(
      differenceInTime / (1000 * 60 * 60 * 24)
    );
    return differenceInDays;
  };
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="my-1">
        <div className="flex flex-row py-1 mx-auto justify-between ">
          <select
            className="px-5 mx-5 bg-slate-100"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">ทุกรายการ</option>
            <option value="borrower">ยืม</option>
            <option value="return">คืนหนังสือ</option>
            <option value="cancle">ยกเลิก</option>
          </select>

          <select
            className="px-5 mx-5 bg-slate-100"
            value={find}
            onChange={(e) => setFind(e.target.value)}
          >
            <option value="member">ชื่อสมาชิก</option>
            <option value="book">ชื่อหนังสือ</option>
          </select>

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            className="w-72 text-md rounded-md border  px-2 py-0 mx-5"
            placeholder="ค้นหา..."
          />
          <label className="mx-4  ">
            <b> จำนวนรายการต่อหน้า: </b>
            <select
              name="selectedPage"
              onChange={changeStaus}
              className="px-5  bg-gray-3"
            >
              <option value="15">15</option>
              <option value="10">10</option>
              <option value="5">5</option>
            </select>
          </label>
        </div>
      </div>
      {/* {JSON.stringify(products)} */}
      <div className="px-1 relative h-[400px] my-1   py-1 rounded-md">
        <table className="border-collapse border border-slate-800 rounded-lg ">
          <thead>
            <tr className="border-collapse border border-slate-300 bg-blue-200 rounded-lg  h-10">
              <th className="w-16">ลำดับที่</th>
              <th className="w-72">ชือหนังสือ</th>
              <th className="w-32">ISBN</th>
              <th className="w-32">วันที่ยืม</th>
              <th className="w-32">วันที่ครบกำหนด</th>
              <th className="w-32">วันที่คืน</th>
              <th className="w-32">ชื่อผู้ยืม</th>
              <th className="w-32">ผู้ทำรายการ</th>
              <th className="w-32">จำนวนวันถึงกำหนด</th>
            </tr>
          </thead>
          {products.length
            ? products.map((browers, index) => (
                <>
                  {browers.status === "borrower" ? (
                    <tr className="border-collapse border border-slate-300 ">
                      <td className="w-16 px-5" key={index}>
                        {index + 1 + itemsPerPage * currentPage - itemsPerPage}.
                      </td>
                      <td className="w-96">{browers.book.title} </td>
                      <td className="w-32">{browers.book.isbn} </td>
                      <td className="w-32 px-10">
                        {formatThaiDate(browers.borrowDate)}
                      </td>
                      <td className="w-16 px-10">
                        {formatThaiDate(browers.dueDate)}
                      </td>
                      <td>
                        {browers.returnDate
                          ? formatThaiDate(browers.returnDate)
                          : null}
                      </td>
                      <td className="w-64 px-4">
                        {browers && browers.member.name}{" "}
                      </td>
                      <td className="w-64 px-4">
                        {browers && browers.user.name}
                      </td>
                      <td className="w-32 text-center">
                        {calDateDif(browers.dueDate) + 1}
                      </td>
                    </tr>
                  ) : (
                    <>
                      <tr className="border-collapse border text-gray-400  border-slate-300 ">
                        <td className="w-16 px-5" key={index}>
                          {index +
                            1 +
                            itemsPerPage * currentPage -
                            itemsPerPage}
                          .
                        </td>
                        <td className="w-96 px-10">{browers.book.title} </td>
                        <td className="w-32">{browers.book.isbn} </td>
                        <td className="w-32 px-10">
                          {formatThaiDate(browers.borrowDate)}
                        </td>
                        <td className="w-32 px-10 ">
                          {formatThaiDate(browers.dueDate)}
                        </td>
                        <td>
                          {browers.returnDate
                            ? formatThaiDate(browers.returnDate)
                            : null}
                        </td>
                        <td className="w-64 px-4">
                          {browers && browers.member.name}
                        </td>
                        <td className="w-64 px-4">
                          {browers && browers.user.name}
                        </td>
                        <td className="w-32  text-red-600">
                          {browers.fineAmount > 0 ? browers.fineAmount : null}
                        </td>
                      </tr>
                    </>
                  )}
                </>
              ))
            : null}
        </table>
      </div>

      {/* paginator */}
      <div className="flex absolute justify-start -mt-15 text-md text-gray-500 mx-2 mt-20 ">
        รายการทั้งหมด {totalProducts}
      </div>
      <div className="flex flex-row justify-center mt-20">
        <div className="flex flex-row absolute  mx-auto justify-center py-2 px-4 md:px-6 xl:px-7.5">
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

export default AdminReport;
