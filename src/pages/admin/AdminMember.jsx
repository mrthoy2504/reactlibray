import { useState, useEffect, useRef } from "react"; // เพิ่ม useRef
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

  const searchInputRef = useRef(null); // เพิ่ม ref สำหรับ input search

  // ฟังก์ชันเล่นเสียง Beep
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      playBeep(500, 0.3); // เสียงเตือนเมื่อไฟล์ใหญ่เกิน
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
    setSelectedFiles(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

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
    if (window.confirm("ยืนยัน ยกเลิกการทำรายการ ?")) {
      closeModal();
    }
  };

  const editMember = async (member) => {
    setEditId(member.id);
    if (member.image) {
      setImagePreviewUrl(`${BACK_URL}${member.image}`);
    } else {
      setImagePreviewUrl(null);
    }
    setData(member);
    openModalEdit();
  };

  const openModalEdit = () => {
    setShowModal(true);
  };

  const deletemember = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await axios.delete(`${BACK_URL}/members/` + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMembers();
        playBeep(1000, 0.1); // เสียงเมื่อลบสำเร็จ
      } catch (error) {
        console.error("Error deleting member", error);
        playBeep(700, 0.5); // เสียงเมื่อเกิดข้อผิดพลาด
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

  useEffect(() => {
    if (!data?.groupId && groups.length > 0) {
      setData((prev) => ({ ...prev, groupId: groups[0].id }));
    }
  }, [groups]);

  // เพิ่มการจัดการ Enter key ใน input search
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Enter" &&
        document.activeElement === searchInputRef.current
      ) {
        playBeep(800, 0.1); // เสียงเมื่อกด Enter ในช่องค้นหา
        fetchMembers(); // อัปเดตผลการค้นหา
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [search]);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPage(currentPage);
  };

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

    if (!data.groupId) {
      alert("กรุณาเลือกกลุ่มสมาชิก");
      playBeep(500, 0.3); // เสียงเตือนเมื่อไม่มีกลุ่มสมาชิก
      return;
    }
    try {
      if (editId === 0) {
        await axios.post(`${BACK_URL}/members`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        playBeep(1000, 0.1); // เสียงเมื่อเพิ่มสำเร็จ
      } else {
        await axios.put(`${BACK_URL}/members/` + editId, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        playBeep(1000, 0.1); // เสียงเมื่อแก้ไขสำเร็จ
      }
      setImagePreviewUrl(null);
      closeModal();
      fetchMembers();
    } catch (error) {
      alert("เกิดข้อผิกพลาด" + error);
      playBeep(700, 0.5); // เสียงเมื่อเกิดข้อผิดพลาด
      console.error("Error saving books:", error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="my-1">
        <div className="flex flex-row py-1 mx-auto justify-between">
          <button
            onClick={openModal}
            className="bg-green-400 px-5 rounded-md mx-10 text-white"
          >
            เพิ่มรายการ
          </button>
          <input
            type="text"
            ref={searchInputRef} // เพิ่ม ref ให้ input search
            value={search}
            onChange={handleSearchChange}
            className="w-96 text-xl rounded-md border border-spacing-2-c px-2 py-1"
            placeholder="ค้นหา..."
          />
          <label className="mx-4">
            <b> จำนวนรายการต่อหน้า: </b>
            <select
              name="selectedPage"
              onChange={(e) => setItemsPerPage(e.target.value)}
              className="px-5 bg-gray-3"
            >
              <option value="15">15</option>
              <option value="10">10</option>
              <option value="5">5</option>
            </select>
          </label>
        </div>
      </div>
      {/* <Modal isOpen={showModal} onClose={closeModal} size="xl">
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
                value={data?.name || ""}
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
                value={data?.description || ""}
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
                value={data?.phone || ""}
                onChange={handleInputChange}
              />
            </div>
            <label className="block text-gray-500 text-sm font-bold mb-1">
              กลุ่มสมาชิก:
            </label>
            <div className="text-gray-600 border border-gray-200 w-48 mt-2 mb-2">
              <select
                className="px-1 my-1 py-1"
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
            <div className="flex flex-row justify-start mx-auto mb-1">
              <section className="pl-5 pr-2">รูปภาพ: </section>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div>
                {imagePreviewUrl && (
                  <img
                    src={imagePreviewUrl}
                    alt="Member Preview"
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
      </Modal> */}
      <Modal isOpen={showModal} onClose={closeModal} size="xl">
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-lg w-[750px] px-10 py-8">
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
              รายการสมาชิก
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ชื่อสมาชิก */}
              <div>
                <label className="block mx-2  text-sm font-medium text-gray-700 mb-2">
                  ชื่อสมาชิก
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  type="text"
                  value={data?.name || ""}
                  name="name"
                  onChange={handleInputChange}
                  required
                  placeholder="กรอกชื่อสมาชิก"
                />
              </div>

              {/* รายละเอียด */}
              <div>
                <label className="block text-sm mx-2 font-medium text-gray-700 mb-1">
                  รายละเอียด
                </label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  name="description"
                  value={data?.description || ""}
                  onChange={handleInputChange}
                  required
                  placeholder="กรอกรายละเอียด"
                />
              </div>

              {/* เบอร์โทรศัพท์ */}
              <div className="flex flex-row space-x-4">
                <div>
                  <label className="block text-md  font-medium text-gray-700 mx-2 mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    className="w-full max-w-xs px-4 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    type="text"
                    name="phone"
                    value={data?.phone || ""}
                    onChange={handleInputChange}
                    placeholder="กรอกเบอร์โทรศัพท์"
                  />
                </div>

                <div>
                  <label className="block text-md font-medium text-gray-700 mx-2 mb-1">
                    กลุ่มสมาชิก
                  </label>
                  <select
                    className="w-full max-w-xs px-4  border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 py-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
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
              </div>

              {/* กลุ่มสมาชิก */}

              {/* รูปภาพ */}
              <div>
                <label className="block text-md font-medium text-gray-700 mb-2">
                  รูปภาพ
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-md text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-md file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {imagePreviewUrl && (
                    <img
                      src={imagePreviewUrl}
                      alt="Member Preview"
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                    />
                  )}
                </div>
              </div>

              {/* ปุ่ม */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  type="submit"
                  className="px-8 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  บันทึก
                </button>
                <button
                  type="button"
                  onClick={cancleinsert}
                  className="px-8 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      {/* ModalPrint */}
      {modalPrintOpen && (
        <ModalPrint
          closeEditModal={() => {
            setModalPrintOpen(false);
          }}
          member={members} // แก้ membertest เป็น members หรือตัวแปรที่เหมาะสม
        />
      )}
      <div className="grid grid-cols-6 border-t border-stroke py-2 text-white bg-blue-400 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
     
        <div className="col-span-1 flex items-center">
          <p className="font-medium">รหัสสมาชิก</p>
        </div>
     
        <div className="col-span-2 text-center items-center">
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
                  {key + 1 + itemsPerPage * currentPage - itemsPerPage}.{" "}
                </b>
                {member.codeId}
              </p>
            </div>
          </div>
        
          <div className="col-span-2  items-center">
            <p className="col-span-2 text-sm text-black dark:text-white">
              {member.name}
             
            </p>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {member.description}
            </p>
          </div>
          <div className="mx-2">{member.Group?.name}</div>
          <div className="col-span-1 flex items-center">
            <HiPencil
              size={30}
              className="text-red-700 mx-2"
              onClick={() => editMember(member)}
            />
            <HiTrash
              size={30}
              className="text-red-700"
              onClick={() => deletemember(member.id)}
            />
          </div>
          <div className="col-span-1 flex items-center">
            <img src={`${BACK_URL}${member.image}`} className="h-10" />
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-2 text-xl text-gray-500">
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
