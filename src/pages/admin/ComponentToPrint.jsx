import axios from "axios";
import { BACK_URL } from "../../URL.jsx";
import React, { forwardRef, useState, useEffect } from "react";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { IconContext } from "react-icons";
import ReactPaginate from "react-paginate";
import jsBarcode from "jsbarcode";
import "./styles.css";

// eslint-disable-next-line react/display-name
const ComponentToPrint = forwardRef((props, ref) => {
  const token = JSON.parse(localStorage.getItem("auth"))?.token;
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [totalMembers, setTotalMembers] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalMembers / itemsPerPage);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/members`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, currentPage, itemsPerPage },
      });
      setTotalMembers(response.data.totalMembers);
      setMembers(response.data.Members);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(fetchMembers, 500);
    return () => clearTimeout(timeoutId); // Clean up debounce timeout
  }, [search, currentPage, itemsPerPage]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-content");
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
    } else {
      console.error("Print content not found.");
    }
  };

  return (
    <div className="my-5">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="my-1">
          <div className="flex flex-row py-1 mx-10 justify-between">

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              className="w-96 text-xl rounded-md border border-spacing-2-c px-2 py-1"
              placeholder="ค้นหา..."
            />
            <label className="mx-4">
              <b>จำนวนรายการต่อหน้า: </b>
              <select
                name="selectedPage"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-5 bg-gray-3"
              >
                <option value="15">15</option>
                <option value="10">10</option>
                <option value="5">5</option>
              </select>
            </label>
          </div>
        </div>
        <div ref={ref}>
          <div className="grid grid-cols-2 gap-4">
            {members.map((member, index) => (
              <div className="flex flex-row border border-stroke" key={index}>
                <div className="mx-5 py-5">
                  <img
                    src={`${BACK_URL}${member?.image}`}
                    className="h-32"
                    alt="Member"
                  />
                </div>
                <div className="py-2 text-xs mt-2">
                  <p className="text-xs">รหัสสมาชิก: {member.codeId}</p>
                  <p>ชื่อสมาชิก: {member.name}</p>
                  <p>โทรศัพท์: {member.phone}</p>
                  <p>
                    วันที่ออกบัตร:{" "}
                    {new Date(member.updatedAt).toLocaleDateString()}
                  </p>
                  <p>กลุ่มสมาชิก: {member.Group?.name}</p>
                  <div>
                    <svg
                      id={`barcode-${member.codeId}`}
                      ref={(el) => {
                        if (el) {
                          jsBarcode(el, member.codeId || "", {
                            format: "CODE128",
                            displayValue: true,
                            fontSize: 14,
                            height: 25,
                          });
                        }
                      }}
                    ></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-2 text-xl text-gray-500">
          รายการทั้งหมด {totalMembers}
        </div>
        <div className="flex flex-row mx-auto justify-center py-2 px-4 md:px-6 xl:px-7.5">
          <ReactPaginate
            breakLabel="..."
            pageCount={endpoint}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName="flex items-center space-x-2"
            activeClassName="bg-blue-300 text-white rounded-md border-blue-100"
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
    </div>
  );
});

export default ComponentToPrint;
