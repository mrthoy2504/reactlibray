

import Modal from "../../components/modal";
import Swal from "sweetalert2";

const AdminCategoryDetail = () => {
  const token = JSON.parse(localStorage.getItem("auth")).token;

  const [editId, setEditId] = useState(0);
  const [categories, setCategories] = useState([]);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({
    name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  //เพิ่มรายการ
  const openModal = () => {
    setData({ name: "" });
    setShowModal(true);
  };

    // เรียก MOdal Edit
    const editCategory = async (location) => {
        setEditId(location.id);
        setData(location);
        openModalEdit({ location });
      };
    
  //เปิดmodal แก้ไข
  const openModalEdit = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditId(0);
  };

  /* แก้ไขรายการ */
  {
    modalEditOpen && (
      <Modal isOpen={showModal} onClose={() => closeModal()} size="xl" />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = data.name;
    try {
      if (editId == 0) {
        await axios.post(
          `${BACK_URL}/categories/`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // fetchCategories();
        closeModal();
      } else {
        await axios.put(
          `${BACK_URL}/categories/` + editId,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // fetchCategories();
        closeModal();
      }
    } catch (error) {
      alert("เกิดข้อผิกพลาด" + error);
      console.error("Error saving books:", error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white  ">
      {/* ปุ่มเพิ่มรายการ */}
      <div className="flex flex-row py-2 mx-auto justify-between ">
        <button
          onClick={openModal}
          className="bg-green-400 px-5 py-2 rounded-md mx-10 text-white "
        >
          เพิ่มรายการ
        </button>


      </div>

      <div className="grid grid-cols-6 border-t border-stroke py-2 text-white bg-blue-400 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">ชื่อหมวดหมู่</p>
        </div>

        <div className="col-span-1 flex items-center">
          <p className="font-medium">Action</p>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {categories.map((Category, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="col-span-2 text-sm text-black dark:text-white">
                    {/* {key + 1 + itemsPerPage * currentPage - itemsPerPage}.{" "} */}
                    {Category.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-1 flex items-center">
              <HiPencil
                size={30}
                className="text-red-700 mx-4"
                onClick={() => {
                  editCategory(Category);
                }}
              />
              <HiTrash
                size={30}
                className="text-red-700"
                onClick={() => {
                  deletecategory(Category.id);
                }}
              />
            </div>
          </div>
        ))}

        <Modal
          title="เพิ่มการซ่อม"
          isOpen={showModal}
          onClose={() => closeModal()}
          size="xl"
        >
          <div className="flex gap-4">
            <div className="relative bg-white rounded-lg shadow w-[750px] px-10 py-10">
              <h2 className="flex flex-row text-xl text-gray-500 justify-center">
                {"เพิ่มรายการหมวดหมู่"}
              </h2>
              <form onSubmit={handleSubmit}>
                <label className=" text-gray-700 ">
                  ชื่อหมวดหมู่:
                  <input
                    type="text"
                    name="name"
                    value={data?.name}
                    onChange={handleInputChange}
                    className="shadow appearance-none border text-gray-500 rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </label>
                <button
                  className="bg-green-500 px-10 py-2 text-white rounded-md my-2 mx-5"
                  type="submit"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </Modal>

 
  
      </div>
    </div>
  );
};

export default AdminCategoryDetail;

        Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "บันทึกสำเร็จ",
                  showConfirmButton: false,
                  timer: 1000,
                });