import { Link } from "react-router-dom";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons"; // for customizing icons
import { HiTrash } from "react-icons/hi";
import { HiPencil } from "react-icons/hi";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth.jsx";
import { jwtDecode } from "jwt-decode";
export function Sidebar() {
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const token = auth?.token;
  const decoded = token ? jwtDecode(token) : null;
  const menuItems = [
    // { title: "Dashboard", href: "/admin", icon: "fa-solid fa-chart-simple" },

    {
      title: "ข้อมูลหมวดหมู่หนังสือ",
      href: "/admin/category",
      icon: "HiTrash",
    },
    {
      title: "ข้อมูลหนังสือ",
      href: "/admin/book",
      icon: "fa-solid fa-chart-simple",
    },
    {
      title: "สถานที่จัดเก็บหนังสือ",
      href: "/admin/location",
      icon: "fa-solid fa-shop",
    },
    {
      title: "ข้อมูลกลุ่มสมาชิก",
      href: "/admin/groupMember",
      icon: "fa-solid fa-screwdriver",
    },
    {
      title: "ข้อมูลสมาชิก",
      href: "/admin/member",
      icon: "fa-solid fa-right-from-bracket",
    },
    {
      title: "ยืม-คืนหนังสือ",
      href: "/admin/borrower",
      icon: "fa-solid fa-gear",
    },
    {
      title: "คืนหนังสือ",
      href: "/admin/return",
      icon: "fa-solid fa-gear",
    },
    {
      title: "รายงานยืม-คืนหนังสือ",
      href: "/admin/report",
      icon: "fa-solid fa-money-bill",
    },
    {
      title: "ข้อมูลค่าปรับ",
      href: "/admin/fine",
      icon: "fa-solid fa-shop",
    },
    {
      title: "สำรองข้อมูล",
      href: "/admin/backup",
      icon: "fa-solid fa-shop",
    },

    {
      title: "ข้อมูลร้าน",
      href: "/admin/printBarcode",
      icon: "fa-solid fa-shop",
    },
  ];
  useEffect(() => {
    setName(localStorage.getItem("token") || "");
  }, []);

  const handleLogout = async () => {
    const button = await Swal.fire({
      title: "ออกจากระบบ",
      text: "คุณต้องการออกจากระบบหรือไม่",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    });

    if (button.isConfirmed) {
      localStorage.removeItem("auth");
      localStorage.removeItem("user");
      localStorage.clear();
      navigate(`/login`);
      window.location.reload(false);
      // navigate('/login', { replace: true });
      // <Redirect to='/login' />
    }
  };
  return (
    <aside className="sidebar shadow-sm   sticky top-0 z-99">
      <nav className="mt-10">
        <ul>
          {menuItems.map((item) => (
            <li key={item.title}>
              <Link to={item.href} className="sidebar-item">
                <i className={item.icon + " mr-2 w-6"}></i>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={handleLogout}
        className="mx-10  bg-red-600 text-white rounded-md px-10 py-1"
      >
        Logout
      </button>
      <div className="text-gray-600 mt-5 mx-10">
        <span >
        User : <b> {decoded ? decoded.email : null}</b> 
        {/* {JSON.stringify(decoded)} */}
        </span>
      </div>
    </aside>
  );
}
