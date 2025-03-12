import { useState, useEffect } from "react";
import axios from "axios";
import { BACK_URL } from "../../URL.jsx";
import { useRef } from "react";
import BorrowerDetailSearch from "./AdminBorrowerSearchMember.jsx";
import AdminReturnSearchbook from "./AdminReturnSearchbook.jsx";
import Swal from "sweetalert2";

import { useAuth } from "../../context/auth.jsx";
import { jwtDecode } from "jwt-decode";

const AdminReturnDetail = () => {
  const inputRef = useRef("");
  // const inputRef2 = useRef(null);
  // const token = JSON.parse(localStorage.getItem("auth")).token;
  const [dueDate, setDueDate] = useState("");
  const [auth, setAuth] = useAuth();
  const token = auth?.token;
  const decoded = token ? jwtDecode(token) : null;
  const UserId = decoded ? decoded.userId : null;

  const [members, setMembers] = useState(""); //member
  const [membersId, setMembersId] = useState("");
  const [membersname, setMembersName] = useState("");
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState(""); //Book
  const [isbn, setIsbn] = useState("");
  const [bookId, setBookId] = useState("");
  // const [title, setTitle] = useState("");
  const [browers, setBrowers] = useState([]);
  const [sumFine, setSumFine] = useState(0);
  const [modalOpen, setModalOpen] = useState(false); //modal
  const [isSubmitting, setIsSubmitting] = useState(false); // สถานะป้องกันการเรียกซ้ำ

  useEffect(() => {
    fetchFine(membersId);
  }, [browers]);

  useEffect(() => {
    fetchMembers(membersId);
    fetchBrowers(membersId);
  }, [membersId]);

  const handleKeyDown = (event) => {
    // if (event.key === "F9") {
    // alert("F9");
    //   handleLoan(bookId);
    // }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isbn, isSubmitting, bookId]);

  const fetchMembers = async (id) => {
    setMembersName("");
    if (id === "") {
      return;
    }
    try {
      const response = await axios.get(`${BACK_URL}/members/` + id);
      if (response.data) {
        setMembers(response.data);
        fetchFine(id);
      } else {
        setMembers("");
      }
    } catch (error) {
      console.error("Error fetching member", error);
    }
  };

  const fetchBrowers = async (id) => {
    //เรียกข้อมูล ที่ยืม
    if (id === "") {
      // setBrowers([])
      return;
    }
    try {
      const response = await axios.get(`${BACK_URL}/borrows/` + id);
      setBrowers(response.data);
    } catch (error) {
      // setBrowers([])
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

  async function updateBrower(id,title) {
    // คืนหนังสือ borrows
   
    if (window.confirm("ยืนยันคืนหนังสือ "+title)) {
      try {
        await axios.put(
          `${BACK_URL}/borrows/` + id,
          { membersId, bookId, dueDate, UserId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "ส่งคืนหนังสือสำเร็จ!",
          showConfirmButton: false,
          timer: 1500,
        });
        handleKeyPress();
        handleKeyPress();
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

  const today = new Date();
  const calDateDif = (inputDate) => {
    // const today = new Date();
    const targetDate = new Date(inputDate);
    const differenceInTime = today - targetDate; // ความต่างในหน่วยมิลลิวินาที
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
    return differenceInDays;
  };


  const [inputValue, setInputValue] = useState('');


  const handleKeyPress = (event) => {
   
      // สร้างเสียง beep โดยใช้ AudioContext
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime); // ความถี่ 1000 Hz
      oscillator.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2); // เสียงดัง 0.1 วินาที
      console.log('Beep!');
   
  };

  return (
    <div className="  justify-center mx-auto  px-2     bg-white rounded-lg  ">
 

      <div className="flex flex-row mx-auto">
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
          isbn={isbn}
          setIsbn={setIsbn}
        />

        {/* book */}
        <AdminReturnSearchbook
          inputRef={inputRef}
          setBook={setBook}
          book={book}
          setBooks={setBooks}
          books={books}
          setBookId={setBookId}
          bookId={bookId}
          isbn={isbn}
          setIsbn={setIsbn}
          membersId={membersId}
          setMembersId={setMembersId}
          updateBrower={updateBrower}
         
        />
      </div>

      <div className="flex flex-row mx-auto justify-center">
        {/* {JSON.stringify(book[0].book.title)} */}
        <button
          onClick={() => {
            updateBrower({ bookId ,isbn});
          }}
          className="w-[350px] py-2 mt-2 -mb-2 px-2 bg-blue-400  rounded-md text-white"
          type="submit"
        >
          <b className="text-xl"> บันทึกรายการส่งคืน (F9){bookId} </b>
        </button>
      </div>

      <div className="px-1 h-1/2 my-4  border-collapse  ">
        <table className="border-collapse border min-w-full border-slate-800 rounded-lg ">
          <thead>
            <tr className="border-collapse border border-slate-300 bg-blue-200 rounded-lg  h-10">
              <th className="w-16">ลำดับที่</th>
              <th className="w-64">ชือหนังสือ</th>
              <th className="w-32">ISBN</th>
              <th className="w-32">วันที่ยืม</th>
              <th className="w-32">วันที่คืน</th>
              <th className="w-64">ชื่อผู้ยืม</th>
              <th></th>
            </tr>
          </thead>
          {browers.length
            ? browers.map((browers, index) => (
                <>
                  <tr className="border-collapse border border-slate-300 ">
                    <td className="w-16 px-5" key={index}>
                      {index + 1}.
                    </td>

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
                        onClick={() => updateBrower(browers.id,browers.book.title)}
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

export default AdminReturnDetail;
