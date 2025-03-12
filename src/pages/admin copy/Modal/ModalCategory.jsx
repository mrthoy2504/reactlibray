import React, { useState } from 'react';
import './Modal.css';
import axios from 'axios';
import {BACK_URL} from '../../../URL';

export const ModalCategory = ({ closeModal,refresh,setRefresh }) => {
  const [name, setName] = useState('');
  const token = JSON.parse(localStorage.getItem("auth")).token;

  // alert(JSON.stringify(category))
  // const {id,name} = category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await axios.post(`${BACK_URL}/categories`, { name });
      await axios.post(
        `${BACK_URL}/categories/` ,{name},
        { headers: { Authorization: `Bearer ${token}` } },
        
      );
      closeModal()
      setRefresh(!refresh)
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === 'modal-container') closeModal();
      }}
    >
         <div className="relative bg-white rounded-lg shadow w-[750px] px-10 py-10">
        <h2 className='flex flex-row text-xl text-gray-500 justify-center'>{'เพิ่มรายการหมวดหมู่'}</h2>
        <form onSubmit={handleSubmit}>
          <label className=' text-gray-700 '>
            ชื่อหมวดหมู่:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
               className="shadow appearance-none border text-gray-500 rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </label>
          <button className="bg-green-500 px-10 py-2 text-white rounded-md my-2 mx-5" type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};
