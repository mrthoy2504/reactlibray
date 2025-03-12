import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BACK_URL } from "../../URL.jsx";
import Swal from "sweetalert2";

const AdminReturnSearchbook = ({
  book,
  setBook,
  setBookId,
  handleLoan,
  isbn,
  setIsbn,
  membersId,
  setMembersId,
  updateBrower,
  inputRef,
}) => {
  const isbnInputEl = useRef(null); // Ref สำหรับ ISBN input
  const memberInputEl = useRef(null); // Ref สำหรับ Members ID input

  // ฟังก์ชันเล่นเสียง Beep แบบปรับแต่งได้
  const playBeep = (frequency = 1000, duration = 0.1) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
    console.log(`Beep! (${frequency} Hz, ${duration}s)`);
  };

  const handleSearch = async (isbnValue, memberId) => {
    if (!memberId) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกชื่อสมาชิก",
        showConfirmButton: false,
        timer: 1500,
      });
      playBeep(500, 0.3); // เสียงเตือนเมื่อไม่มีรหัสสมาชิก
      memberInputEl.current?.focus();
      return;
    }

    if (!isbnValue) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอก ISBN",
        showConfirmButton: false,
        timer: 1500,
      });
      playBeep(500, 0.3); // เสียงเตือนเมื่อไม่มี ISBN
      isbnInputEl.current?.focus();
      return;
    }

    try {
      const response = await axios.post(
        `${BACK_URL}/isbn/?memberId=${memberId}&isbn=${isbnValue}`
      );
      const bookData = response.data;

      if (bookData && bookData.length > 0) {
        playBeep(1000, 0.1); // เสียงเมื่อค้นหาสำเร็จ
        setBook(bookData);
        setBookId(bookData[0].id);
        updateBrower(bookData[0].id, bookData[0].book.title);
      } else {
        setBook(null);
        playBeep(700, 0.5); // เสียงเมื่อไม่พบหนังสือ
        Swal.fire({
          icon: "error",
          title: "ไม่พบหนังสือที่ค้นหา",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      isbnInputEl.current?.focus();
    } catch (err) {
      setBook(null);
      playBeep(700, 0.5); // เสียงเมื่อเกิดข้อผิดพลาด
      isbnInputEl.current?.focus();
      Swal.fire({
        icon: "error",
        title:
          err.response?.status === 404
            ? "ไม่พบหนังสือที่ค้นหา"
            : "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // Auto search เมื่อ isbn หรือ membersId เปลี่ยนแปลง
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isbn && membersId) {
        handleSearch(isbn, membersId);
      }
    }, 1000);
    return () => clearTimeout(timeoutId); // Cleanup timeout
  }, [isbn]);

  // จัดการ Enter key สำหรับทั้งสอง input
  useEffect(() => {
    const handleWindowKeyDown = (event) => {
      if (event.key === "Enter") {
        if (
          document.activeElement === isbnInputEl.current ||
          document.activeElement === memberInputEl.current
        ) {
          playBeep(800, 0.1); // เสียงเมื่อกด Enter
          handleSearch(isbn, membersId);
        }
      }
    };

    window.addEventListener("keydown", handleWindowKeyDown);
    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [isbn, membersId]);

  return (
    <div className="flex flex-row mx-auto px-1 border border-black py-2 rounded-md">
      <div className="mx-2 text-gray-500 py-2 px-4 w-full">
        <div className="mb-2 flex flex-col gap-2">
          {/* Input สำหรับ Members ID */}
          <div className="flex items-center gap-2">
            <label className="w-32">รหัสสมาชิก:</label>
            <input
              name="membersId"
              type="text"
              ref={memberInputEl}
              value={membersId}
              onChange={(e) => setMembersId(e.target.value.trim())}
              placeholder="กรอกรหัสสมาชิก"
              className="border px-4 py-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Input สำหรับ ISBN */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSearch(isbn, membersId)}
              className="bg-blue-400 px-3 py-1 rounded-md text-white hover:bg-blue-500 transition-colors"
            >
              ค้นหา
            </button>
            <input
              name="isbn"
              type="text"
              ref={isbnInputEl}
              value={isbn}
              onChange={(e) => setIsbn(e.target.value.trim())}
              placeholder="กรอกหมายเลข ISBN"
              className="border px-4 py-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* แสดงผลข้อมูล */}
        <div className="text-md my-1">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-32">ชื่อหนังสือ</td>
                <td className="w-5">:</td>
                <td>
                  {!book ? (
                    <b className="text-red-500">ไม่พบหนังสือที่ค้นหา</b>
                  ) : (
                    book[0]?.book?.title || "ไม่มีข้อมูล"
                  )}
                </td>
              </tr>
              <tr>
                <td>ISBN</td>
                <td>:</td>
                <td>
                  {!book ? (
                    <b className="text-red-500">ไม่พบหนังสือที่ค้นหา</b>
                  ) : (
                    book[0]?.book?.isbn || "ไม่มีข้อมูล"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReturnSearchbook;