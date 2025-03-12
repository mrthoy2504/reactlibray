import React, { useState, useEffect } from 'react';
import './Modal.css';
import axios from 'axios';
import {BACK_URL} from '../../../URL.jsx';

import ReactPaginate from 'react-paginate';
import { AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai'; // icons form react-icons
import { IconContext } from 'react-icons'; // for customizing icons

export const ModalMemberBorrower = ({
  closeModal,
  membersId,
  setMembersId,
  membersname,
  setMembersName,
  codeId,
  setCodeId
}) => {
  const [memberId, setMemberId] = useState('');
  const [members, setMembers] = useState([
    { name: '', description: '', pictures: [] },
  ]);
  const [refresh, setRefresh] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  //page
  const [search, setSearch] = useState('');
  const [totalProducts, setTotalMembers] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalProducts / itemsPerPage);

  useEffect(() => {
    // setTimeout(() => {
    fetchMembers();
    // }, 500);
  }, [search, currentPage, refresh, itemsPerPage]);

  //เรียกข้อมูล
  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/members`, {
        params: { search, currentPage, itemsPerPage },
      });
      setTotalMembers(response.data.totalMembers);
      setMembers(response.data.Members);
    } catch (error) {
      console.error('Error fetching members', error);
    }
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPage(currentPage);
  };

  //search
  const handleSearchChange = (e) => {
    setCurrentPage(1);
    setSearch(e.target.value);
  };

  const selectMember = (e) => {
    // alert(e.id + e.name);
    setMembersId(e.id);
    setMembersName(e.name);
    setCodeId(e.codeId)
    closeModal();
  };

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === 'modal-container') closeModal();
      }}
    >
      <div className="relative bg-white rounded-lg shadow w-[750px] px-10 py-10">
        {/* ค้นหา */}
        <div className="my-2">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            className="w-96 text-xl rounded-md border border-spacing-2-c px-2 py-1"
            placeholder="ค้นหา..."
          />
        </div>

        {/* ตาราง */}
        <div className="grid grid-cols-6 border-t border-stroke py-2 text-white bg-blue-400 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-2 flex items-center">
            <p className="font-medium">ชื่อสมาชิก</p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="font-medium">รายละเอียด</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">สถานะ</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Action</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">รูปภาพ</p>
          </div>
        </div>

        {/* สมาชิก */}
        {members.map((member, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke py-2 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
            onClick={() => selectMember(member)}
          >
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="col-span-2 text-sm text-black dark:text-white">
                  {key + 1 + itemsPerPage * currentPage - itemsPerPage}.{' '}
                  {member.name}
                </p>
              </div>
            </div>
            <div className="col-span-4  items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {member.description}
              </p>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {member.codeId}
              </p>
            </div>
            {/* รูปภาพ */}
            <div className="col-span-1 hidden items-center sm:flex">
              {member.pictures.map((picture,index) => (
                <div className="flex flex-row justify-start " key={index}>
                  <img
                    key={picture.id}
                    src={`${BACK_URL}` + picture.url}
                    onClick={() => {
                      // deleteimage(picture.id);
                    }}
                    className="mx-5 px-1  h-10 "
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-row mx-auto  justify-center py-6 px-4 md:px-6 xl:px-7.5 ">
          <ReactPaginate
            breakLabel={'...'}
            pageCount={endpoint}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            activeClassName={'activepag'}
            containerClassName={'pagination'}
            previousLabel={
              <IconContext.Provider value={{ color: '#B8C1CC', size: '36px' }}>
                <AiFillLeftCircle />
              </IconContext.Provider>
            }
            nextLabel={
              <IconContext.Provider value={{ color: '#B8C1CC', size: '36px' }}>
                <AiFillRightCircle />
              </IconContext.Provider>
            }
          />
        </div>
      </div>
    </div>
  );
};
