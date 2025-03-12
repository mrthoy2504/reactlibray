import React, { useEffect, useRef, useState } from "react";
import jsBarcode from "jsbarcode";
import "./Modal.css";
import axios from "axios";
import { BACK_URL } from "../../../URL";

const ModalPrint = ({ member }) => {
  const barcodeRef = useRef(null);

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
    <div
      className="modal-container "
      onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}
    >
   <div className="relative flex justify-center items-center h-screen bg-gray-200 print:bg-white">
      {/* พื้นที่พิมพ์ */}
      <div
       id= "print-content"
        className=" bg-white border border-gray-300 print:border-none"
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
            left: "100px", // ระยะจากด้านซ้าย
            width: "300px",
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
            <div className="ml-4">
              <p>รหัสสมาชิก: {member.codeId}</p>
              <p>ชื่อสมาชิก: {member.name}</p>
            </div>
          </div>
          <div className="mt-1 mx-10 h-16">
            <svg className="h-16" ref={barcodeRef} />
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

export default ModalPrint;
