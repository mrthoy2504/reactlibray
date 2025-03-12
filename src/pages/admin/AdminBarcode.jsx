import React, { useEffect, useRef } from "react";
import jsBarcode from "jsbarcode";

const MemberCard = ({ member }) => {
  const barcodeRef = useRef(null);

  // สร้าง Barcode จาก `codeId`
  useEffect(() => {
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
    window.print();
  };

  return (
    <div className="member-card">
      <div
        className="card-container"
        style={{
          width: "300px",
          height: "200px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ margin: "0", textAlign: "center" }}>Member Card</h3>
        <div className="member-details" style={{ textAlign: "center" }}>
          <p style={{ margin: "0" }}>Name: {member.name}</p>
          <p style={{ margin: "0" }}>Member ID: {member.codeId}</p>
        </div>
        {/* Barcode */}
        <svg ref={barcodeRef} style={{ marginTop: "10px" }} />
      </div>
      {/* ปุ่มพิมพ์บัตร */}
      <button
        onClick={handlePrint}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Print Member Card
      </button>
    </div>
  );
};

export default MemberCard;
