import React, { useEffect, useRef, useState } from "react";
import jsBarcode from "jsbarcode";
 import "./Modal.css";
import axios from "axios";
// import { BACK_URL } from "../../../URL";

const AdminPrint = () => {
  const barcodeRef = useRef(null);

  const member = {
    id: 5,
    name: "สมเกียรติ จันวัน ",
    description: "พนักงาน",
    status: true,
    groupId: 4,
    createdAt: "2024-12-12T05:41:30.856Z",
    updatedAt: "2024-12-22T06:45:06.331Z",
    codeId: 10005,
    pictures: [{ id: 7, url: "/uploads/1733982090842-2.jfif", memberId: 5 }],
    Group: {
      id: 4,
      name: "พนักงาน",
      borrowLimit: 4,
      returnDays: 4,
      status: true,
      fineprice: 10,
    },
  };

  // สร้าง Barcode จาก `codeId`
  useEffect(() => {
    console.log("Barcode Ref:", barcodeRef.current);
    console.log("Code ID:", member.codeId);
    if (barcodeRef.current && member.codeId) {
      jsBarcode(barcodeRef.current, member.codeId, {
        format: "CODE128",
        displayValue: true,
        fontSize: 14,
        height: 50,
      });
    }
  }, [member.codeId]);

  // ฟังก์ชันสำหรับพิมพ์บัตร
//   const handlePrint = () => {
//     window.print();
//   };

  const handlePrint = () => {
    // ซ่อนทุกสิ่งที่ไม่ใช่พื้นที่ที่ต้องการพิมพ์
    const printContent = document.getElementById("print-content");
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;

    window.print();

    // คืนค่าผลลัพธ์เดิมหลังพิมพ์เสร็จ
    document.body.innerHTML = originalContent;
  };


  return (
    <div className=" ">
      <div className="relative flex justify-center items-center h-screen  print:bg-white">
        {/* พื้นที่พิมพ์ */}
        <div
         id="print-content" // กำหนด id สำหรับการพิมพ
          className="  border-gray-300 print:border-none"
          style={{
            width: "800px",
            height: "1120px", // ขนาด A4 ที่ความละเอียด 72dpi
          }}
        >
          {/* ส่วนบัตรสมาชิก */}
          <div
            className="absolute"
           
            style={{
              top: "10px", // ระยะจากด้านบน
              left: "50px", // ระยะจากด้านซ้าย
              width: "400px",
              height: "200px",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
            }}
          >
            <div className="flex flex-row items-center">
              <img
                src={`http://localhost:5000` + member.pictures[0]?.url}
                alt="Member"
                style={{ width: "100px", height: "100px" }}
              />
             
              <div className="ml-4 text-sm ">
                <p>รหัสสมาชิก: {member.codeId}</p>
                <p>ชื่อสมาชิก: {member.name}</p>
                <p>วันที่ออกบัตร:{member.updatedAt}</p> 
              </div>
             
            </div>
            <div className="mt-1 mx-10 h-16 ">
 barcode   <svg className="h-16 w-64" ref={barcodeRef} />
            </div>
          </div>

          <div
            className="absolute"
            style={{
              top: "10px", // ระยะจากด้านบน
              left: "480px", // ระยะจากด้านซ้าย
              width: "400px",
              height: "200px",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
            }}
          >
            <div className="flex flex-row items-center">
              <img
                src={`http://localhost:5000` + member.pictures[0]?.url}
                alt="Member"
                style={{ width: "100px", height: "100px" }}
              />
              <div className="ml-4 text-sm ">
                <p>รหัสสมาชิก: {member.codeId}</p>
                <p>ชื่อสมาชิก: {member.name}</p>
                <p>วันที่ออกบัตร:{member.updatedAt}</p>
              </div>
            </div>
            <div className="mt-1 mx-10 h-16 ">
              {/* <svg className="h-16 w-64" ref={barcodeRef} /> */}
            </div>
          </div>
        </div>

        {/* ปุ่มพิมพ์ */}
        <button
          onClick={handlePrint}
          className="absolute bottom-10 bg-blue-500 text-white px-4 py-2 rounded print:hidden"
        >
          Print Member Card
        </button>
      </div>
    </div>
  );
};

export default AdminPrint;
