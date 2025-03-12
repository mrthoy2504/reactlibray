import React, { useState, useEffect } from "react";
import "./Modal.css";
import axios from "axios";
//${BACK_URL}
import { BACK_URL } from "../../../URL";

export const ModalMemberEdit = ({
  closeEditModal,
  memberId,
  setMemberIds,
  //
}) => {
  // const [images, setImages] = useState([]);
  // const [categories, setCategories] = useState([]);
  // const [selectedFiles, setSelectedFiles] = useState([]);
  // const [previewImages, setPreviewImages] = useState([]);
  // const [data, setData] = useState(  { name: '', description: '',status:'' })
  const token = JSON.parse(localStorage.getItem("auth")).token;
  const [data, setData] = useState("");
  // const [name, setName] = useState('');
  const [images, setImages] = useState([]);
  // const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");

  const fetchMemberId = async (id) => {
    try {
      const response = await axios.get(`${BACK_URL}/members/` + id);
      // alert(JSON.stringify(response.data.Group.id));
      setGroupId(response.data.Group.id);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  //ลบ  image product
  const deletepro = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
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
    alert("submit");
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("status", data.status);
    formData.append("groupId", groupId);
    selectedFiles.forEach((image) => {
      formData.append("images", image);
    });
    try {
      if (memberId) {
        // await axios.put(`${BACK_URL}/members/` + memberId, formData);
        await axios.put(`${BACK_URL}/members/` + memberId, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedFiles([]);
        setPreviewImages([]);
        closeEditModal();
      } else {
        alert("error member Id");
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
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
    fetchMemberId(memberId);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const cancleinsert = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
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
        {/* <h2>{product ? 'Edit Product' : 'Add Product'}</h2> */}
        {/* {JSON.stringify(data)} */}
        <form onSubmit={handleSubmit}>
          {/* members: {JSON.stringify(data)} */}
          <label className="block text-gray-700 text-sm font-bold mb-5">
              รหัสสมาชิก :<b className="text-gray-400"> {data?.codeId}</b>
            </label>
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
          <label className="block text-gray-700 mx-2 text-sm font-bold mb-0">
             กลุ่มสมาชิก:
            </label>
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
          <hr className="my-2"></hr>
          <div className="flex flex-row justify-start mx-auto mb-1">
            <section className="pl-5 pr-2">รูปภาพใหม่: </section>
            {previewImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index}`}
                width="80"
              />
            ))}
            {/* </div>
          <hr />
          <div className="flex flex-row justify-start mx-auto mt-2"> */}
            <section className="pl-5">รูปภาพเก่า : </section>{" "}
            {data &&
              data.pictures.map((image, index) => (
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
          </div>
          <div className="flex flex-row justify-start mx-auto mt-3">
            <label className="mx-2">Images:</label>
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
