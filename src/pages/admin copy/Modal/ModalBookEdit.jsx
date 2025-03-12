import React, { useState, useEffect } from "react";
import "./Modal.css";
import axios from "axios";
import { BACK_URL } from "../../../URL";

export const ModalBookEdit = ({
  closeEditModal,
  product,
  setProduct,
  //
}) => {
  const token = JSON.parse(localStorage.getItem("auth")).token;
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [data, setData] = useState("");


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BACK_URL}/categories/all`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchProductId = async (id) => {
    try {
      const response = await axios.get(`${BACK_URL}/books/` + id);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  //ลบ  image product
  const deletepro = async (id) => {
    if (window.confirm("ยืนยันการลบ รูปภาพ!")) {
      try {
        const response = await axios.delete(`${BACK_URL}/products/image/` + id);
        console.log(response.data);
        fetchProductId(product.id);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
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
      if (product) {
        const response =  await axios.put(
          `${BACK_URL}/books/${product.id}` ,formData,
          { headers: { Authorization: `Bearer ${token}` } },      
        );
        setSelectedFiles([]);
        setPreviewImages([]);
        closeEditModal();
      }
    } catch (error) {
      console.error("Error saving books:", error);
    }
  };

  useEffect(() => {
    fetchProductId(product.id);
    setImages(data?.images);
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const cancleinsert = async () => {
    if (window.confirm("ยืนยันยกเลิกรายการ!?")) {
      await closeEditModal();
    }
  };

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") closeEditModal();
      }}
    >
      <div className="relative bg-white rounded-lg shadow w-[750px] px-10 py-10">
        <h2>{product ? "แก้ไขรายการหนังสือ" : "Add Product"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-0">
             ชื่อหนังสือ
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="author"
              value={data.author}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-row justify-start mx-auto">
            <div className="mb-1 w-1/4 pr-5">
              <label className="block text-gray-700 text-sm font-bold ">
                ISBN
              </label>
              <input
                className="shadow appearance-none border  rounded w-full py-1 px-3 text-gray-500 mb-1 leading-tight focus:outline-none focus:shadow-outline"
                name="isbn"
                type="text"
                value={data?.isbn}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-1 w-1/4 mx-5">
              <label className="block text-gray-700 text-sm font-bold ">
                จำนวนหนังสือ:
              </label>
              <input
                className="shadow appearance-none border  rounded w-full py-1 px-3 text-gray-500 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                name="totalCopies"
                type="number"
                value={data?.totalCopies}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-1 w-1/4">
              <label className="block text-gray-700 text-sm font-bold ">
                จำนวนหนังสือที่ยืมได้:
              </label>
              <input
                className="shadow appearance-none border  rounded w-full py-1 px-3 text-gray-500 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
              required
              className="shadow  border  rounded py-1  px-1 text-gray-500 mb-1 "
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <hr className="my-2"></hr>
          <div className="flex flex-row justify-start mx-auto mb-1">
            <section className="pl-5">รูปภาพเก่า : </section>{" "}
            {data &&
              data?.bookpictures.map((image, index) => (
                <div key={index}>
                  <img
                    src={`${BACK_URL}` + image.url}
                    width="80"
                    onClick={() => {
                      deletepro(image.id);
                    }}
                    className="mx-1"
                  />
                </div>
              ))}
                   <section className="pl-5 pr-2">รูปภาพใหม่: </section>
            {previewImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index}`}
                width="80"
              />
            ))}
          </div>
          <div className="flex flex-row justify-start mx-auto mt-3">
            <label className="mx-2">รูปภาพ:</label>
            <input type="file" multiple onChange={handleFileChange} />
          </div>

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
