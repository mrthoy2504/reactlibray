import React, { useState, useEffect } from 'react';
import './Modal.css';
import axios from 'axios';
import { BACK_URL } from '../../../URL.jsx';


import ReactPaginate from 'react-paginate';
import { AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai'; // icons form react-icons
import { IconContext } from 'react-icons'; // for customizing icons

export const ModalBookBorrower = ({ closeModal, bookId,setBookId,searchModal,setSearchModal,
  title,settitle,setBook
}) => {
  const [memberId, setMemberId] = useState('');
  const [books, setBooks] = useState([{ title: '', isbn: '' }]);
  // const [refresh, setRefresh] = useState('');
  const [search, setSearch] = useState('');
  //searchModal
  // const [modalOpen, setModalOpen] = useState(false);
  // const [modalEditOpen, setModalEditOpen] = useState(false);
  //page
  const [totalBooks, setTotalBooks] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const endpoint = Math.ceil(totalBooks / itemsPerPage);

  useEffect(() => {
    // setTimeout(() => {
      // setSearch("")
      fetchBooks();
    // }, 100);
  }, [search, currentPage,  itemsPerPage]);

  
  //เรียกข้อมูล
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/books`, {
        params: { search, currentPage, itemsPerPage },
      });
  
      setTotalBooks(response.data.totalBooks);
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching products', error);
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

  const selectBook = (e) => {
    // alert(e.isbn+e.title+e.id);
    setSearchModal(e.isbn);
    settitle(e.title);
    setBookId(e.id);
    setBook("");

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
            <p className="font-medium">ชื่อหนังสือ</p>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="font-medium">ISBN</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium"></p>
          </div>

          <div className="col-span-2 flex items-center">
            <p className="font-medium">รูปภาพ</p>
          </div>

        </div>

        {/* สมาชิก */}
        {books.map((book, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke py-2 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
            onClick={() => selectBook(book)}
          >
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="col-span-2 text-sm text-black dark:text-white">
                  {key + 1 + itemsPerPage * currentPage - itemsPerPage}.{' '}
                  {book.title}
                </p>
              </div>
            </div>
            <div className="col-span-4  items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {book.isbn}
              </p>
            </div>
            {/* <div className="col-span-1 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {book.status}
              </p>
            </div> */}
            {/* รูปภาพ */}
            <div className="col-span-1 hidden items-center sm:flex">
              {book.length?book.bookpictures.map((picture,index) => (
                <div className="flex flex-row justify-start " key={index}>
                  <img
                    key={picture.id}
                    src={`http://localhost:5000` + picture.url}
                    onClick={() => {
                      // deleteimage(picture.id);
                    }}
                    className="mx-5 px-1  h-10 "
                  />
                </div>
              )):null}
            </div>
          </div>
        ))}
      <div className="flex  justify-center mt-2 text-xl text-gray-500">
        รายการทั้งหมด {totalBooks}
      </div>
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
