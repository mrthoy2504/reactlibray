import { useState, useEffect } from "react";
import axios from "axios";
import { BACK_URL } from "../../URL.jsx";
import { ModalMemberBorrower } from "./Modal/ModalMemberBorrower.jsx";
import { useRef } from "react";

const BorrowerDetailSearch = ({
  membersId,
  setMembersId,
  members,
  browers,
  sumFine,
  setSumFine,
  inputRef,
  setMembers,
  isbn,
  bookId,
  setBookId,
  book,
  setBook,
}) => {
  // const inputRef2 = useRef(null);
  // const token = JSON.parse(localStorage.getItem("auth")).token;
  // const [dueDate, setDueDate] = useState("");
  const [membersname, setMembersName] = useState("");
  const inputEl = useRef(null);
  // const [searchModal, setSearchModal] = useState("");
  // const [title, setTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false); //modal
  const [codeId, setCodeId] = useState("");
  // useEffect(() => {
  //   fetchFine(membersId);
  // }, [browers.length]);

  useEffect(() => {
    // fetchBooks();
    fetchMembers(membersId);
    // fetchBrowers(membersId);
    inputRef.current.focus();
  }, [membersId]);

  const fetchMembers = async (id) => {
    //เรียกข้อมูล user
    setMembers("");
    if (id === "") {
      return;
    }
    try {
      const response = await axios.get(`${BACK_URL}/members/` + id);
      if (response.data) {
        setMembers(response.data);
        // fetchFine(id);
      } else {
        setMembers("");
      }
    } catch (error) {
      console.error("Error fetching member", error);
    }
  };

  //เรียกข้อมูล ที่ยืม
  const fetchBrowers = async (id) => {
    if (id === "") {
      return;
    }
    try {
      const response = await axios.get(`${BACK_URL}/borrows/` + id);
      browers(response.data);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  const handleSearch = async (codeId) => {
    // const formattedISBN = typeof isbn === "number" ? isbn.toString() : isbn;

    try {
      const response = await axios.get(`${BACK_URL}/isbn/code`, {
        params: { codeId },
      });

      setMembers(response.data);
      setMembersId(response.data.id);
      inputEl.current.select();
    } catch (err) {
      setMembers([]);
      // setBook(null);
      inputRef.current.select();
      if (err.response && err.response.status === 404) {
        alert("ไม่พบที่ค้นหา");
      }
      
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Enter" &&
        document.activeElement === inputRef.current
      ) {
        handleSearch(codeId); // Call search when pressing Enter on the ISBN input
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [codeId]);

  return (
    <div className="  justify-center mx-auto  px-2     bg-white rounded-lg  ">
      {modalOpen && (
        <ModalMemberBorrower
          closeModal={() => {
            setModalOpen(false);
          }}
          membersname={membersname}
          setMembersName={setMembersName}
          membersId={members}
          setMembersId={setMembersId}
          codeId={codeId}
          setCodeId={setCodeId}
        />
      )}

      <div className=" flex flex-row  mx-auto  px-10 border-collapse border border-black py-2 rounded-md">
        <div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-400 px-3 mx-1 rounded-md  text-white "
          >
            ค้นหา สมาชิก
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="รหัสสมาชิก"
            value={codeId}
            onChange={(e) => setCodeId(e.target.value.trim())}
            // disabled
            className="w-24 text-md text-center border  px-2 py-0"
            required
          />{" "}
          <b className="text-red-500">
            {members.Group?.borrowLimit === 0 ? (
              <>สมาชิกถูกห้ามใช้บริการ </>
            ) : null}{" "}
          </b>
          <div className="text-md text-slate-500 my-1">
            <table>
              <tr>
                <td className="w-32"> ชื่อสมาชิก </td>
                <td className="w-5">:</td>
                <td>{members?.name} </td>
              </tr>
              <tr>
                <td className="w-32"> รายละเอียด </td>
                <td>:</td>
                <td className="w-72">{members?.description} </td>
              </tr>
            </table>
            <table>
              <tr>
                <td className="w-full">
                  จำนวนวันยืม :{" "}
                  <b className="text-black ml-2">
                    {members.Group?.returnDays}{" "}
                    <b className="text-gray-600 ml-8">
                      {" "}
                      จำนวนหนังสือที่ยืมได้ :{" "}
                    </b>
                  </b>
                  <b className="text-black">{members.Group?.borrowLimit} </b>
                </td>
              </tr>
              <tr>
                <td className="w-96">
                  จำนวนค้างส่ง :{" "}
                  <b className="text-red-600 mr-10"> {browers.length}</b>
                  ค่าปรับ <b className="text-red-600 ml-13">: {sumFine} </b>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowerDetailSearch;
