import React, { useState } from "react";
import { useAuth } from "../../context/auth";
import { BACK_URL } from "../../URL.jsx";
import Swal from "sweetalert2";

export default function AdminBackup() {
  const [auth, setAuth] = useAuth();
  const [filename, setFilename] = useState("");
  const [restoreStatus, setRestoreStatus] = useState("");
  const token = JSON.parse(localStorage.getItem("auth")).token;

  const backupDatabase = async () => {
    try {
      const response = await fetch(`${BACK_URL}/api/backup`, {
        method: "get",
      });
      await response.text();
      Swal.fire("สำรองข้อมูลเสำเร็จ!");
    } catch (error) {
      console.error("Backup error:", error);
      alert("Backup failed");
    }
  };
  const handleRestore = async (event) => {
    event.preventDefault();
    const fileInput = event.target.elements.backupFile.files[0];
    if (!fileInput) return;

    const formData = new FormData();
    formData.append("backup", fileInput);

    try {
      const button = await Swal.fire({
        icon: "warning",
        title: "ยืนยันการคืนค่า",
        text: "คุณต้องการคืนค่าข้อมูลนี้หรือไม่",
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        const response = await fetch(`${BACK_URL}/api/backup/restore`, {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.text();
        setRestoreStatus(result);
        Swal.fire("คืนค่าสำเร็จ!");
      }
    } catch (error) {
      console.error("Restore failed", error);
      setRestoreStatus("Restore failed");
    }
  };
  return (
    <div className="flex flex-col mx-auto justify-center">
      <div className="border border-gray-500 px-32 py-10">
        <button
          className="px-5 py-2 bg-green-600 my-10 text-white rounded-md"
          onClick={backupDatabase}
        >
          สำรองฐานข้อมูล
        </button>
      </div>
      <br></br>
      <div className="border border-gray-500 px-32 py-10">
        <div>
          {/* Restore Section */}
          <form onSubmit={handleRestore}>
            <input type="file" name="backupFile" accept=".sql" />

            <button
              className="px-5 py-2 bg-blue-500 my-1 text-white rounded-md"
              type="submit"
            >
              Restore Database
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
