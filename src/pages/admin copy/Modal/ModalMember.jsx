import React, { useState, useEffect } from "react";
import "./Modal.css";
import axios from "axios";
import { BACK_URL } from "../../../URL";

export const ModalMember = ({ closeModal, product }) => {
  const token = JSON.parse(localStorage.getItem("auth")).token;
  // const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [data, setData] = useState({ name: "", description: "" });
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("groupId", groupId);
    selectedFiles.forEach((image) => {
      formData.append("images", image);
    });
    alert("member");
    try {
      // await axios.post(`${BACK_URL}/members`, formData);

      await axios.post(`${BACK_URL}/members`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const cancleinsert = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await closeModal();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const fetchGroup = async () => {
    // alert("group")
    const group = await axios.get(`${BACK_URL}/api/group/all/group`);
    // alert(JSON.stringify(group.data));
    setGroups(group.data);
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  useEffect(() => {
    if (groups && groups.length > 0 && !groupId) {
      setGroupId(groups[0].id); // ใช้ ID ของกลุ่มแรกเป็นค่าเริ่มต้น
    }
  }, [groups, groupId]);

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}
    >
      <div className="relative bg-white rounded-lg shadow w-[750px] px-10 py-10">
        <h2>รายการสมาชิก</h2>
        {/* {JSON.stringify(data)} */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-0">
              ชื่อสมาชิก
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
              รายละเอียด:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="description"
              value={data?.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            {JSON.stringify(groups)}

            <>
              <select
                className="px-5  bg-slate-100 my-2 py-2"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              >
                {groups?.map((group) => (
                  <>
                    <option value={group.id}>{group.name}</option>
                  </>
                ))}
              </select>
            </>
          </div>
        
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-0">
              เบอร์โทรศัพท์:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="phone"
              value={data?.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <hr className="my-2"></hr>
          <div className="flex flex-row justify-start mx-auto mb-1">
            {/* <section className="pl-5 pr-2">รูปภาพ: </section> */}
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
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
