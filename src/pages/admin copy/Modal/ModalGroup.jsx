import { useState } from "react";
import "./Modal.css";
import axios from "axios";
import { BACK_URL } from "../../../URL";

export const ModalGroup = ({ closeModal }) => {
  const token = JSON.parse(localStorage.getItem("auth")).token;
  const [data, setData] = useState({
    name: "",
    borrowLimit: "",
    returnDays: "",
    fineprice: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BACK_URL}/api/group`,
        {
          name: data.name,
          borrowLimit: data.borrowLimit,
          returnDays: data.returnDays,
          fineprice: data.fineprice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      closeModal();
    } catch (error) {
      console.error("Error saving Group:", error);
    }
  };

  const cancleinsert = async () => {
    if (window.confirm("ยืนยันยกเลิก ?")) {
      await closeModal();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}
    >
      <div className="relative bg-white rounded-lg shadow w-[750px] px-10 py-10">
        <h2>รายการกลุ่มสมาชิก</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-0">
              ชื่อกลุ่มสมาชิก
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={data?.name}
              name="name"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-0">
              จำนวนวันที่ยืม:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="Number"
              name="borrowLimit"
              value={data?.borrowLimit}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-0">
              จำนวนหนังสือที่ยืม:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="Number"
              name="returnDays"
              value={data?.returnDays}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-0">
              ค่าปรับ:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="Number"
              name="fineprice"
              value={data?.fineprice}
              onChange={handleInputChange}
              required
            />
          </div>

          <hr className="my-2"></hr>

          <div className="flex flex-row justify-center mx-auto">
            <button
              type="submit"
              className="bg-green-500 px-10 py-2 text-white rounded-md my-2 mx-5"
            >
              บันทึก
            </button>
            <button
              type="button"
              onClick={cancleinsert}
              className="bg-red-500 px-10 py-2 text-white rounded-md my-2"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
