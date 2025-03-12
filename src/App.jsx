import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LayoutDashboard from "./pages/LayoutDashboard.jsx";
import Login from "./pages/Login.jsx";
import Users from "./pages/Users.jsx";
import { Toaster } from "react-hot-toast";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminBook from "./pages/admin/AdminBook.jsx";
import AdminCategory from "./pages/admin/AdminCategory.jsx";
import AdminBorrower from "./pages/admin/AdminBorrower.jsx";

import AdminMember from "./pages/admin/AdminMember.jsx";
import AdminReport from "./pages/admin/AdminReport.jsx";
import AdminFine from "./pages/admin/AdminFine.jsx";
import AdminGroupMember from "./pages/admin/AdminGroupMember.jsx";
import AdminPrint from "./pages/admin/AdminPrint.jsx";
//AdminDayReport
import AdminDayReport from "./pages/admin/AdminDayReport.jsx";
//Profile
import Profile from "./pages/admin/Profile.jsx";
import Home from "./pages/admin/Home.jsx";
//AdminLocation
import AdminLocation from "./pages/admin/AdminLocation.jsx";

//AdminReturn AdminUnReturn 
import AdminReturn from "./pages/admin/AdminReturn.jsx";
import AdminUnReturn  from "./pages/admin/AdminUnReturn.jsx";

import Register from "./pages/Register.jsx";

import AdminBackup from "./pages/admin/AdminBackup.jsx";
function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <LayoutDashboard>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<AdminDashboard/>} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/book"
            element={
              <ProtectedRoute>
                <AdminBook />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/category"
            element={
              <ProtectedRoute>
                <AdminCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/borrower"
            element={
              <ProtectedRoute>
                <AdminBorrower />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/return"
            element={
              <ProtectedRoute>
                <AdminReturn />
              </ProtectedRoute>
            }
          />

        <Route
            path="/admin/adminunreturn"
            element={
              <ProtectedRoute>
                <AdminUnReturn />
              </ProtectedRoute>
            }
          />      

          <Route
            path="/admin/member"
            element={
              <ProtectedRoute>
                <AdminMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/report"
            element={
              <ProtectedRoute>
                <AdminReport />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/admin/dayreport"
            element={
              <ProtectedRoute>
                <AdminDayReport />
              </ProtectedRoute>
            }
          />r

          <Route
            path="/admin/fine"
            element={
              <ProtectedRoute>
                <AdminFine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/groupMember"
            element={
              <ProtectedRoute>
                <AdminGroupMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/backup"
            element={
              <ProtectedRoute>
                <AdminBackup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/location"
            element={
              <ProtectedRoute>
                <AdminLocation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/printBarcode"
            element={
              <ProtectedRoute>
                <AdminPrint />
              </ProtectedRoute>
            }
          />
        </Routes>
      </LayoutDashboard>
    </Router>
  );
}

export default App;
