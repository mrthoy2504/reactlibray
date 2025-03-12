import { useState, useEffect } from "react";
import axios from "axios";
import { BACK_URL } from "../../URL.jsx";
import { useRef } from "react";
import BorrowerDetailSearch from "./AdminBorrowerSearchMember.jsx";
import AdminBorrowerSearchbook from "./AdminBorrowerSearchbook.jsx";
import Swal from "sweetalert2";

import { useAuth } from "../../context/auth.jsx";
import { jwtDecode } from "jwt-decode";

const BorrowerDetail = () => {
  const [auth, setAuth] = useAuth();
  const token = auth?.token;
  const decoded = token ? jwtDecode(token) : null;
  const UserId = decoded ? decoded.userId : null;

  const inputRef = useRef("");
  // const token = JSON.parse(localStorage.getItem("auth")).token;
  const [dueDate, setDueDate] = useState("");

  const [members, setMembers] = useState(""); //member
  const [membersId, setMembersId] = useState("");
  const [membersname, setMembersName] = useState("");
  const [books, setBooks] = useState([]);

  const [book, setBook] = useState(""); //Book
  const [isbn, setIsbn] = useState("");
  const [bookId, setBookId] = useState("");
  const [title, setTitle] = useState("");
  const [browers, setBrowers] = useState([]);
  const [sumFine, setSumFine] = useState(0);
  const [sunDay, setSunDay] = useState("");

  const [modalOpen, setModalOpen] = useState(false); //modal
  const [isSubmitting, setIsSubmitting] = useState(false); // สถานะป้องกันการเรียกซ้ำ

  useEffect(() => {
    fetchFine(membersId);
  }, [browers.length]);

  useEffect(() => {
    setBrowers([]);
    fetchMembers(membersId);
    fetchBrowers(membersId);
  }, [membersId]);

  const handleKeyDown = (event) => {
    if (event.key === "F9") {
      // alert("F9");
      handleLoan(bookId);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isbn, isSubmitting, bookId]);

  const fetchMembers = async (id) => {
    setMembersName("");

    try {
      const response = await axios.get(`${BACK_URL}/members/` + id);
      if (response.data) {
        setMembers(response.data);
        setSunDay(response.data.sunDay);
        fetchFine(id);
      } else {
        setMembers("");
      }
    } catch (error) {
      console.error("Error fetching member", error);
    }
  };

  //เรียกข้อมูล ที่ยืม
  const fetchBrowers = async (id) => {
    try {
      const response = await axios.get(`${BACK_URL}/borrows/` + id);
      setBrowers(response.data);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  const fetchFine = async (id) => {
    if (id === "") {
      return;
    }
    try {
      const response = await axios.get(`${BACK_URL}/api/fine/unpaid/` + id);
      if (response.data.singleFines[0]) {
        setSumFine(response.data.singleFines[0]._sum.fineAmount);
      }
    } catch (error) {
      console.error("Error fetching member", error);
    }
  };

  // คืนหนังสือ borrows
  async function updateBrower(id) {
    if (window.confirm("ยืนยันคืนหนังสือ ?")) {
      try {
        await axios.put(
          `${BACK_URL}/borrows/` + id,
          { membersId, bookId, dueDate },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          position: "top-end",
          icon: "ส่งคืนหนังสือสำเร็จ!",
          title: "ส่งคืนหนังสือ",
          showConfirmButton: false,
          timer: 400,
        });

        fetchBrowers(membersId);
      } catch (error) {
        console.error("Error fetching member", error);
      }
    }
  }

  const formatThaiDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate(); // ดึงข้อมูลวัน เดือน และปี และจัดรูปแบบให้เป็นวัน/เดือน/ปี พ.ศ.
    const month = date.getMonth() + 1; // เดือนใน JavaScript เริ่มจาก 0
    const year = date.getFullYear() + 543; // เพิ่มปี 543 เพื่อให้เป็น พ.ศ.
    return `${day}/${month}/${year}`;
  };

  const handleLoan = async ({ bookId }) => {
    if (!membersId) {
      Swal.fire("รายชื่อสมาชิก ข้อมูลไม่ครบถ้วนสำหรับการยืมหนังสือ!");
      return;
    }

    if (!bookId) {
      Swal.fire("รายชื่อหนังสือ ข้อมูลไม่ครบถ้วนสำหรับการยืมหนังสือ!");
      return;
    }
    // ตรวจสอบว่ามีการยืมหนังสือเล่มนี้อยู่แล้วหรือไม่
    const isAlreadyBorrowed = browers.some(
      (borrow) => borrow.bookId === bookId
    );
    if (isAlreadyBorrowed) {
      Swal.fire("ไม่สามารถยืมหนังสือเล่มนี้ได้ ยืมได้1เล่มต่อสมาชิก!");
      return;
    }
    try {
      const returnDays = members.Group?.returnDays;
      const borrowLimit = members.Group?.borrowLimit;
      if (browers.length >= borrowLimit) {
        Swal.fire("ยืมหนังสือเกินจำนวนที่กำหนด ไม่สามารถยืมได้!");
        return;
      }
      await axios.post(
        `${BACK_URL}/borrows`,
        { membersId, bookId, returnDays, borrowLimit, UserId, sunDay },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBrowers(membersId);
      setBook("");
      setBookId("");
      setIsbn("");
      setTitle("");
      setSunDay("");
    } catch (error) {
      console.error("Error borrowing book:", error);
      Swal.fire("เกิดข้อผิดพลาดในการยืมหนังสือ!");
    }
  };
  const today = new Date();
  const calDateDif = (inputDate) => {
    const targetDate = new Date(inputDate);
    const differenceInTime = today - targetDate; // ความต่างในหน่วยมิลลิวินาที
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
    return differenceInDays;
  };

  return (
    <div className="  justify-center mx-auto  px-2     bg-white rounded-lg  ">
      <div className="flex flex-row mx-auto">
        {/* ค้นหา member */}
        <BorrowerDetailSearch
          membersId={membersId}
          setMembersId={setMembersId}
          members={members}
          browers={browers}
          sumFine={sumFine}
          setSumFine={setSumFine}
          setModalOpen={setModalOpen}
          inputRef={inputRef}
          modalOpen={modalOpen}
          setMembers={setMembers}
          bookId={bookId}
          setBookId={setBookId}
          setBrowers={setBrowers}
        />

        {/* book */}
        <AdminBorrowerSearchbook
          setBook={setBook}
          book={book}
          setBooks={setBooks}
          books={books}
          setBookId={setBookId}
          bookId={bookId}
          isbn={isbn}
          setIsbn={setIsbn}
          handleLoan={handleLoan}
        />
      </div>
      <div className="flex flex-row mx-auto justify-center">
        <button
          onClick={() => {
            handleLoan({ bookId });
          }}
          className="w-[350px] py-2 mt-2 -mb-2 px-2 bg-green-400  rounded-md text-white"
          type="submit"
        >
          <b className="text-xl"> บันทึกรายการยืม (F9){bookId} </b>
        </button>
      </div>

      <div className="px-1 h-screen  my-4  border-collapse ">
        {/* User : <b> {decoded ? decoded.userId : null}</b>  */}

        {/* {JSON.stringify(decoded)} */}
        <table className="border-collapse border min-w-full border-slate-800 rounded-lg ">
          <thead>
            <tr className="border-collapse border border-slate-300 bg-green-200 rounded-lg  h-10">
              <th className="w-16">ลำดับที่</th>
              <th className="w-64">ชือหนังสือ</th>
              <th className="w-32">ISBN</th>
              <th className="w-32">วันที่ยืม</th>
              <th className="w-32">วันที่คืน</th>
              <th className="w-64">ชื่อผู้ยืม</th>
              <th></th>
            </tr>
          </thead>
          {/* {JSON.stringify(members)} */}
          {browers.length
            ? browers.map((browers, index) => (
                <>
                  <tr className="border-collapse border border-slate-300 ">
                    <td className="w-16 px-5" key={index}>
                      {index + 1}.
                    </td>
                    {/* {calDateDif(browers.borrowDate)}- */}
                    {calDateDif(browers.borrowDate) < 1 ? (
                      <td className="">{browers.book.title}</td>
                    ) : (
                      <td className="text-gray-400">{browers.book.title}</td>
                    )}
                    {/* {JSON.stringify(today)}         {(browers.borrowDate)}    <td>{formatThaiDate(browers.borrowDate)} </td> */}
                    <td className="w-48">{browers.book.isbn}</td>

                    <td className="w-16 px-10">
                      {formatThaiDate(browers.borrowDate)}{" "}
                    </td>

                    <td className="w-28 px-10 ">
                      {formatThaiDate(browers.dueDate)}
                    </td>
                    <td className="w-64 px-4">
                      {browers && browers.member.name}{" "}
                    </td>
                    <td className="w-48">
                      <button
                        className="text-md px-3 py-1 bg-red-400 rounded-md text-white"
                        onClick={() => updateBrower(browers.id)}
                      >
                        ส่งหนังสือคืน
                      </button>
                    </td>
                  </tr>
                </>
              ))
            : null}
        </table>
      </div>
    </div>
  );
};

export default BorrowerDetail;
