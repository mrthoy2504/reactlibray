import { useState, useEffect } from "react";
import axios from "axios";
import { HiPencil } from "react-icons/hi";
import ReactPaginate from "react-paginate";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons"; // for customizing icons
import "./styles.css";
import { BACK_URL } from "../../URL.jsx";

const AdminFineDetail = () => {
  const fineprice = 10;
  const [unpaid, setUnPaid] = useState([]);
  const [fineget, setFineGet] = useState([]);
  //เรียกข้อมูล
  const fetchFine = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/api/fine/`, {});
      setFineGet(response.data.fines);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  const totalFine = fineget.reduce((sum, member) => sum + member.fineAmount, 0);
  const uppaidFine = unpaid.reduce(
    (sum, member) => sum + member.totalUnpaidFine,
    0
  );
  const nopaidFine = totalFine - uppaidFine;

  const Thaidate = (date) => {
    const parsedDate = new Date(date); // Ensure it's a Date object

    if (isNaN(parsedDate)) {
      throw new Error("Invalid date format"); // Handle invalid dates
    }

    const year = parsedDate.getFullYear() + 543;
    const month = parsedDate.getMonth() + 1; // Months are 0-indexed
    const day = parsedDate.getDate();

    return `${day}/${month}/${year}`;
  };

  const fetchFinesumUnpaid = async () => {
    const response = await axios.get(`${BACK_URL}/api/fine/sumUnpaid/2`, {});
    setUnPaid(response.data);
  };

  useEffect(() => {
    // setTimeout(() => {
    fetchFine();
    fetchFinesumUnpaid();
    // }, 500);
  }, []);

  const updateFineStatus = async (id, name) => {
    if (window.confirm("ยืนยันชำระเงินค่าปรับสมาชิก " + name)) {
      const response = await fetch(`${BACK_URL}/api/fine/` + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      alert(result.message);
      fetchFine();
      fetchFinesumUnpaid();
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      
      
      <div className="rounded-sm border text-xl border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <b className="flex flex-row justify-start mx-2 text-gray-900  ">
          <b className="text-gray-400 ml-5 mr-2"> ยอดรวมค่าปรับทั้งหมด:</b>{" "}
          {totalFine} <b className="text-gray-400 ml-5 mr-2">ยอดชำระค่าปรับ:</b>{" "}
          {nopaidFine}
          <b className="text-gray-400 ml-5 mr-2">ยอดค้างชำระค่าปรับ:</b>
          <b className="text-red-600 "> {uppaidFine} </b>
        </b>
        <div className="grid grid-cols-6 border-t border-stroke py-2 text-white bg-gray-600 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">ชื่อสมาชิก</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">ยอดรวมค่าปรับ/สมาชิก</p>
        </div>
      </div>

      {unpaid.map((memberunpaid, index) => (
        <div
          key={index}
          className="grid grid-cols-6 border-t border-stroke py-2 text-white  px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
        >
          <div className="col-span-2 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className=" text-sm text-black dark:text-white">
                {index + 1}. {memberunpaid.memberName}
              </p>
            </div>
          </div>

          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {memberunpaid.totalUnpaidFine} 
            </p>
          </div>
          <div className="col-span-1 hidden mx-auto items-center sm:flex">
            <HiPencil
              size={30}
              className="text-red-700 mx-5"
              onClick={() => {
                updateFineStatus(
                  memberunpaid.memberId,
                  memberunpaid.memberName
                );
              }}
            />
          </div>
        </div>
      ))}

        <div className="my-2">
          {/* ตาราง */}
          <div className="grid grid-cols-6 border-t border-stroke py-2 text-white bg-blue-400 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
            <div className="col-span-2 flex items-center">
              <p className="font-medium">ชื่อสมาชิก</p>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="font-medium">รายละเอียด</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">วันที่ยืม</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">วันที่ส่งคืน</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">จำนวนวันค่าปรับ</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">ค่าปรับ</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">วันที่ชำระค่าปรับ</p>
            </div>
          </div>

          {fineget?.map((fine, key) => (
            <div
              className="grid grid-cols-6 border-t border-stroke py-2 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
              key={key}
            >
              <div className="col-span-1 flex items-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <p className=" text-sm text-black dark:text-white">
                    {key + 1}. {fine.member.name}
                  </p>
                </div>
              </div>

              <div className="col-span-2 hidden items-center sm:flex">
                <p className="text-sm text-black dark:text-white">
                  {fine.borrowing.book.title}
                </p>
              </div>

              <div className="col-span-1 hidden items-center sm:flex">
                <p className="text-sm text-black dark:text-white">
                  {Thaidate(fine.borrowing.borrowDate)}
                </p>
              </div>
              <div className="col-span-1 hidden items-center sm:flex">
                <p className="text-sm text-black dark:text-white">
                  {Thaidate(fine.borrowing.returnDate)}
                </p>
              </div>
              <div className="col-span-1 hidden items-center mx-auto  sm:flex">
                <p className="text-sm text-black dark:text-white mx-auto ">
                  {Number(fine.fineAmount) / fineprice}
                </p>
              </div>
              <div className="col-span-1 flex items-center">
                {/* {fine.paid?<b className="text-gray-300">{fine.fineAmount} </b>:<b className="text-red-600">{fine.fineAmount} </b>} */}
                {fine.paid ? (
                  <b className="text-gray-300">{fine.fineAmount} </b>
                ) : (
                  <b className="text-red-300">{fine.fineAmount} </b>
                )}
                <div className="col-span-1 flex mx-16 items-center">
                  {fine.updatedAt ? Thaidate(fine.updatedAt) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* memberName":"สมเกียรติ จันวัน","totalUnpaidFine */}


    </div>
  );
};

export default AdminFineDetail;
