import React, { useState, useEffect } from "react";
import "./Modal.css";
import axios from "axios";
import { BACK_URL } from "../../../URL.jsx";

export const ModalBook = ({ closeModal, product }) => {
  const token = JSON.parse(localStorage.getItem("auth")).token;

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [data, setData] = useState({
    title: "",
    author: "",
    isbn: "",
    totalCopies: "",
    availableCopies: "",
    categoryId: "",
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/categories/all`);
      // alert(JSON.stringify(response.data))
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
      // ตรวจสอบขนาดไฟล์ (ไม่เกิน 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
    if (file) {
      const previewUrl = URL.createObjectURL(file); // สร้าง URL ชั่วคราว
      setImagePreviewUrl(previewUrl);
    }
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // title, author, isbn, totalCopies, availableCopies ,categoryId
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("isbn", data.isbn);
    formData.append("categoryId", data.categoryId);
    formData.append("totalCopies", data.totalCopies);
    formData.append("availableCopies", data.availableCopies);
    selectedFiles.forEach((image) => {
      formData.append("images", image);
    });
    try {
      const response = await fetch(`${BACK_URL}/books`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(JSON.stringify(response));
      // await axios.post(`${BACK_URL}/books`,{ headers: { Authorization: `Bearer ${token}` },formData });
      closeModal();
    } catch (error) {
      console.error("Error saving books:", error);
    }
  };

  const cancleinsert = async () => {
    // if (window.confirm("Are you sure you want to delete this book?")) {
      await closeModal();
    // }
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
        <h2>รายการหนังสือ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-0">
              ชื่อหนังสือ
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={data?.title}
              name="title"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-0">
              ชื่อผู้แต่ง:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="author"
              value={data?.author}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-row justify-start mx-auto">
            <div className="mb-1 w-1/4 pr-5">
              <label className="block text-gray-700 text-sm font-bold ">
                ISBN:
              </label>
              <input
                className="shadow appearance-none border  rounded w-full py-1 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
                name="isbn"
                type="text"
                value={data?.isbn}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-1 w-1/4">
              <label className="block text-gray-700 text-sm font-bold ">
                จำนวนหนังสือทั้งหมด:
              </label>
              <input
                className="shadow appearance-none border  rounded w-full py-1 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                name="totalCopies"
                type="number"
                value={data?.totalCopies}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-1 w-1/4 mx-5">
              <label className="block text-gray-700 text-sm font-bold ">
                หนังสือที่ยืมได้:
              </label>
              <input
                className="shadow appearance-none border  rounded w-full py-1 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                name="availableCopies"
                type="number"
                value={data?.availableCopies}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-0">
              หมวดหมู่:
            </label>

            <select
              name="categoryId"
              value={data?.categoryId}
              onChange={handleInputChange}
              // required
              className="shadow  border  rounded py-1  px-1 text-gray-700 mb-1 "
            >
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category?.name}
                </option>
              ))}
            </select>
          </div>
          <hr className="my-2"></hr>
          <div className="flex flex-row justify-start mx-auto mb-1">
            <section className="pl-5 pr-2">รูปภาพ: </section>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            <div>
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Image Preview"
                  style={{ width: "100px" }}
                />
              )}
            </div>
          </div>
          {/* <div className="flex flex-row justify-start mx-auto mt-3">
            <label className="mx-2">Images:</label>
            <input type="file" multiple onChange={handleFileChange} />
          </div> */}

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
