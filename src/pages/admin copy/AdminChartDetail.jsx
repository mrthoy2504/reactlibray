import { useEffect, useState } from "react";
import axios from "axios";
import { BACK_URL } from "../../URL.jsx";

export default function AdminChartDetail() {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalmember, setTotalMembers] = useState(0);
  const [totalborrowers, setTotalBorrowers] = useState(0);
  const [totalUnreturns, setTotalUnreturns] = useState(0);
  //paginator
  const [search] = useState("");
  const [itemsPerPage] = useState(5);
  const [currentPage] = useState(1);
  const endpoint = Math.ceil(totalBooks / itemsPerPage);

  // http://localhost:5000/api/report/unreturn
  const fetchUnreturn = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/api/report/unreturn`);
      setTotalUnreturns(response.data);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };
  //เรียกข้อมูล members
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${BACK_URL}/members`, {
        params: { search, currentPage, itemsPerPage },
      });
      setTotalMembers(res.data.totalMembers);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  //เรียกข้อมูล borrowing
  const fetchBorrows = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/borrows`, {
        params: { search, currentPage, itemsPerPage,  find },
      });
      setTotalBorrowers(response.data.totalBorrowings);
    } catch (error) {
      console.error("Error fetching borrower", error);
    }
  };

  //เรียกข้อมูล books
  const fetchBooks = async () => {
    try {
      const resp = await axios.get(`${BACK_URL}/books`, {
        params: { search, currentPage, itemsPerPage },
      });
      setTotalBooks(resp.data.totalBooks);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  useEffect(() => {
    fetchUnreturn();
    fetchBorrows();
    fetchMembers();
    fetchBooks();
  }, []);

  return (
    <>
      <div className="flex flex-row mx-auto justify-center">
        <div className="bg-green-600 mx-5 w-64 py-5 rounded-md text-white text-center text-2xl">
          จำนวนหนังสือ
          <p className="text-center">{totalBooks} เล่ม</p>
        </div>
        <div className="bg-orange-600 rounded-md mx-5 w-64 py-5 text-white text-center text-2xl">
          จำนวนสมาชิก
          <p className="text-center">{totalmember} สมาชิก</p>
        </div>
        <div className="bg-blue-600 rounded-md mx-5 w-64 py-5 text-white text-center text-2xl">
          จำนวนการยืม
          <p className="text-center">{totalborrowers} เล่ม</p>
        </div>
        <div className="bg-red-600 rounded-md mx-5 w-64 py-5 text-white text-center text-2xl">
          จำนวนค้างส่ง
          <p className="text-center">{totalUnreturns} เล่ม</p>
        </div>
      </div>
      <div className=""></div>
    </>
  );
}
