import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/auth.jsx";
import { jwtDecode } from "jwt-decode";
import { BACK_URL } from "../../URL.jsx";

import Swal from "sweetalert2";

const profile = () => {
  const [auth, setAuth] = useAuth();
  const token = auth?.token;
  const decoded = token ? jwtDecode(token) : null;
  const [formData, setFormData] = useState({
    email: decoded ? decoded.email : null,
    oldPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert(
        "New Passwordกับconfirm Passwordไม่ตรงกัน" +
          formData.oldPassword +
          formData.newPassword
      );
      return;
    }

    try {
      const response = await axios.post(
        `${BACK_URL}/api/auth/changepassword`,
        formData
      );
                      Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "บันทึกสำเร็จ",
                        showConfirmButton: false,
                        timer: 1000,
                      });
      // setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-4">เปลี่ยนรหัสผ่าน</h1>
          {message && (
            <p className="mb-4 text-center text-red-500">{message}</p>
          )}
          <label htmlFor="email" className="block text-gray-700">
            email :{decoded.email}
          </label>
          <form onSubmit={handleSubmit}>
            {/* <div className="mb-4">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly
                
                required
                // className="w-full px-4 py-2 border rounded "
              />
            </div> */}
            <div className="mb-4">
              <label htmlFor="oldPassword" className="block text-gray-700">
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700">
                confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              บันทึก
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default profile;
