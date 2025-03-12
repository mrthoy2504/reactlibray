import { useState, useEffect } from "react";
import axios from "axios";
import { BACK_URL } from "../../URL.jsx";
import ModalPrint from "./Modal/ModalPrint.jsx";
import { HiTrash } from "react-icons/hi";
import { HiPencil } from "react-icons/hi";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { IconContext } from "react-icons";
import ReactPaginate from "react-paginate";
import Modal from "../../components/modal";
import Swal from "sweetalert2";

const AdminMemberDetail = () => {
  const token = JSON.parse(localStorage.getItem("auth")).token;
  const [memberId, setMemberId] = useState("");
  const [members, setMembers] = useState([]);
  const [refresh, setRefresh] = useState("");

  const [modalPrintOpen, setModalPrintOpen] = useState(false);
  //page
  const [search, setSearch] = useState("");
  const [totalProducts, setTotalMembers] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalProducts / itemsPerPage);

  const [editId, setEditId] = useState(0);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // ดึงไฟล์ตัวแรกจาก FileList
    if (!file) return; // ป้องกัน error ถ้าไม่มีไฟล์
    if (file.size > 2 * 1024 * 1024) { // ตรวจสอบขนาดไฟล์ (ไม่เกิน 2MB)
      alert("File size must be less than 2MB");
      return;
    }
    const previewUrl = URL.createObjectURL(file); // สร้าง URL ชั่วคราว
    setImagePreviewUrl(previewUrl); // ตั้งค่ารูปตัวอย่าง
    setSelectedFiles(file); // เก็บไฟล์ที่เลือก
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  //เพิ่มรายการ
  const openModal = () => {
    setData({ name: "" });
    setImagePreviewUrl(null);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditId(0);
  };
  const cancleinsert = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      closeModal();
    }
  };

  // เรียก Modal Edit
  const editMember = async (member) => {
    setEditId(member.id);
    if (member.image) {
      setImagePreviewUrl(`${BACK_URL}${member.image}`);
    } else {
      setImagePreviewUrl(null);
    }
    setData(member);
    openModalEdit({ member });
  };

  //เปิดmodal แก้ไข
  const openModalEdit = () => {
    setShowModal(true);
  };

  /* แก้ไขรายการ */
  {
    modalEditOpen && (
      <Modal isOpen={showModal} onClose={() => closeModal()} size="xl" />
    );
  }

  //ลบ  members
  const deletemember = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await axios.delete(`${BACK_URL}/members/` + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMembers();
      } catch (error) {
        console.error("Error fetching products", error);
      }
    }
  };

  const fetchGroup = async () => {
    const group = await axios.get(`${BACK_URL}/api/group/all/group`);
    setGroups(group.data);
  };
  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/members`, {
        params: { search, currentPage, itemsPerPage },
      });
      setTotalMembers(response.data.totalMembers);
      setMembers(response.data.Members);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [search, currentPage, refresh, itemsPerPage]);
  //เรียกข้อมูล
  useEffect(() => {
    if (!data?.groupId && groups.length > 0) {
      setData((prev) => ({ ...prev, groupId: groups[0].id }));
    }
  }, [groups]);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPage(currentPage);
  };

  //search
  const handleSearchChange = (e) => {
    setCurrentPage(1);
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("groupId", data.groupId);
    formData.append("phone", data.phone);
    formData.append("images", selectedFiles);
    // alert(data.groupId);
    if (!data.groupId) {
      alert("กรุณาเลือกกลุ่มสมาชิก");
      return;
    }
    try {
      if (editId == 0) {
        await axios.post(`${BACK_URL}/members`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setImagePreviewUrl(null);
        closeModal();
        fetchMembers();
      } else {
        // alert(editId);
        await axios.put(`${BACK_URL}/members/` + editId, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedFiles([]);
        setImagePreviewUrl(null);
        closeModal();
        fetchMembers();
      }
    } catch (error) {
      alert("เกิดข้อผิกพลาด" + error);
      console.error("Error saving books:", error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* {JSON.stringify(data)} */}
      <div className="my-1">
        <div className="flex flex-row py-1 mx-auto justify-between ">
          <button
            onClick={openModal}
            className="bg-green-400 px-5  rounded-md mx-10 1 text-white "
          >
            เพิ่มรายการ
          </button>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            className="w-96 text-xl rounded-md border border-spacing-2-c px-2 py-1"
            placeholder="ค้นหา..."
          />

          <label className="mx-4  ">
            <b> จำนวนรายการต่อหน้า: </b>
            <select
              name="selectedPage"
              onChange={(e) => setItemsPerPage(e.target.value)}
              className="px-5  bg-gray-3"
            >
              <option value="15">15</option>
              <option value="10">10</option>
              <option value="5">5</option>
            </select>
          </label>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => closeModal()} size="xl">
        <h2 className="flex flex-row text-xl text-gray-500 justify-center">
          {"เพิ่มรายการสมาชิก"}
        </h2>

        <div className="relative bg-white rounded-lg shadow w-[750px] px-10 py-10">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-500 text-sm font-bold mb-1">
                ชื่อสมาชิก
              </label>
              <input
                className="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                value={data?.name}
                name="name"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-500 text-sm font-bold mb-1">
                รายละเอียด:
              </label>
              <textarea
                rows={3}
                cols={10}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="description"
                value={data?.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-gray-500 text-sm font-bold mb-1">
                เบอร์โทรศัพท์:
              </label>
              <input
                className="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="phone"
                value={data?.phone}
                onChange={handleInputChange}
              />
            </div>
            <label className="block text-gray-500 text-sm font-bold mb-1">
              กลุ่มสมาชิก:
            </label>
            <div className="text-gray-600 border border-gray-200 w-48 mt-2 mb-2">
              <select
                className="px-1  my-1 py-1"
                name="groupId"
                value={data?.groupId || ""}
                onChange={handleInputChange}
              >
                <option value="" disabled hidden>
                  เลือกกลุ่มสมาชิก
                </option>
                {groups?.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            {/* <hr className="my-2"></hr> */}

            <div className="flex flex-row justify-start mx-auto mb-1">
              <section className="pl-5 pr-2">รูปภาพ: </section>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div>
                {imagePreviewUrl && (
                  <img
                    src={imagePreviewUrl}
                    alt="Book Preview"
                    className="w-32 h-32 object-cover rounded-lg mt-2"
                  />
                )}
              </div>
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
      </Modal>

     {/* ModalPrint */}
      {modalPrintOpen && ( 
        <ModalPrint
          closeEditModal={() => {
            setModalPrintOpen(false);
          }}
          member={membertest}
        />
      )}

      <div className="grid grid-cols-6 border-t border-stroke py-2 text-white bg-blue-400 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-1 flex items-center">
          <p className="font-medium">รหัสสมาชิก</p>
        </div>

        <div className="col-span-1 flex items-center">
          <p className="font-medium"></p>
        </div>

        <div className="col-span-1 flex items-center">
          <p className="font-medium">ชื่อสมาชิก</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium mx-10">รายละเอียด</p>
        </div>

        <div className="col-span-1 flex items-center">
          <p className="font-medium">กลุ่มสมาชิก</p>
        </div>
      </div>
      {members.map((member, key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke py-2 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-1 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="col-span-1 text-sm text-black dark:text-white">
                <b className="text-gray-400">
                  {" "}
                  {key + 1 + itemsPerPage * currentPage - itemsPerPage}.{" "}
                </b>
                {member.codeId}
              </p>
            </div>
          </div>
          <div className="col-span-1 flex items-center">
            <img src={`${BACK_URL}` + member.image} className="h-10" />
          </div>
          <div className="col-span-1 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="col-span-2 text-sm text-black dark:text-white">
                {member.name}
              </p>
            </div>
          </div>

          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {member.description}
            </p>
          </div>
          <div className="mx-2  ">{member.Group?.name}</div>

          <div className="col-span-1 flex items-center">
            <HiPencil
              size={30}
              className="text-red-700 mx-2"
              onClick={() => {
                editMember(member);
              }}
            />
            <HiTrash
              size={30}
              className="text-red-700"
              onClick={() => {
                deletemember(member.id);
              }}
            />

            {/* <HiTrash
              size={30}
              className="text-red-700"
              onClick={() => {
                setModalPrintOpen(true);
              }}
            /> */}
          </div>
        </div>
      ))}

      {/* {JSON.stringify(members)} */}

      <div className="flex  justify-center mt-2 text-xl text-gray-500">
        รายการทั้งหมด {totalProducts}
      </div>
      <div className="flex flex-row mx-auto justify-center py-2 px-4 md:px-6 xl:px-7.5">
        <ReactPaginate
          breakLabel={"..."}
          pageCount={endpoint}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          pageClassName={"inline-block mx-1"}
          pageLinkClassName={
            "block px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          }
          previousClassName={"inline-block mx-1"}
          previousLinkClassName={
            "block px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          }
          nextClassName={"inline-block mx-1"}
          nextLinkClassName={
            "block px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          }
          breakClassName={"inline-block mx-1"}
          breakLinkClassName={
            "block px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          }
          activeClassName={"bg-blue-300 text-white rounded-md border-blue-100"}
          containerClassName={"flex items-center space-x-2"}
          previousLabel={
            <IconContext.Provider value={{ color: "#B8C1CC", size: "24px" }}>
              <AiFillLeftCircle />
            </IconContext.Provider>
          }
          nextLabel={
            <IconContext.Provider value={{ color: "#B8C1CC", size: "24px" }}>
              <AiFillRightCircle />
            </IconContext.Provider>
          }
        />
      </div>
    </div>
  );
};

export default AdminMemberDetail;
