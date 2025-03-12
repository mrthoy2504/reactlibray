import React from 'react';
// import { useSelector } from 'react-redux';

import { Navigate } from 'react-router-dom';
import { useAuth } from "../../context/auth.jsx";

const Home = () => {

   const [auth, setAuth] = useAuth();
   const token = auth?.token;
//    const { role } = useSelector(state => state.auth)
   if (token) return <Navigate to='/admin/dashboard' replace /> 
   // else if (role === 'admin') return <Navigate to='/admin/dashboard' replace />   
   else return <Navigate to='/login' replace /> 
};

export default Home;