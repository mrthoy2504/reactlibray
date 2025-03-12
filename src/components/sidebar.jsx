import { Link } from "react-router-dom";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.jsx";
import {jwtDecode} from "jwt-decode";

export function Sidebar() {
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [dropdown, setDropdown] = useState({});
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const token = auth?.token;
  const decoded = token ? jwtDecode(token) : null;

  const menuCategories = [
    {
      category: "ข้อมูลหนังสือ",
      items: [
        { title: "ข้อมูลหมวดหมู่หนังสือ", href: "/admin/category" },
        { title: "รายการหนังสือ", href: "/admin/book" },
        { title: "สถานที่จัดเก็บหนังสือ", href: "/admin/location" },
      ],
    },
    {
      category: "ข้อมูลสมาชิก",
      items: [
        { title: "ข้อมูลกลุ่มสมาชิก", href: "/admin/groupMember" },
        { title: "รายการสมาชิก", href: "/admin/member" },
        { title: "พิมพ์บัตรสมาชิกห้องสมุด", href: "/admin/printBarcode" },
      ],
    },
    {
      category: "การจัดการหนังสือ",
      items: [
        { title: "ยืมหนังสือ", href: "/admin/borrower" },
        { title: "ส่งคืนหนังสือ", href: "/admin/return" },
      ],
    },

    {
      category: "รายงาน",
      items: [
        { title: "รายงาน", href: "/admin/report" },
        { title: "รายงานรายชื่อสมาชิกค้างส่งหนังสือ", href: "/admin/adminunreturn" },
        { title: "รายงานค้นหาตามวันที่", href: "/admin/dayreport" },
        { title: "รายการค่าปรับ", href: "/admin/fine" },
      ],
    },
    {
      category: "การตั้งค่า",
      items: [
        
      
        { title: "เปลี่ยนรหัสผ่าน", href: "/admin/profile" },
        { title: "สำรองข้อมูล", href: "/admin/backup" },
      ],
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
    }
  };

  const toggleDropdown = (category) => {
    setDropdown((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <aside className="sidebar shadow-sm sticky top-0 z-99 ">
            <div className="text-gray-600 mt-1 mx-10">
        <span>
          <b className="text-white">{decoded ? decoded.email : null}</b>
        </span>
      </div>
      <nav className="mt-2">
        <ul>
          {menuCategories.map((menu) => (
            <li key={menu.category} className="mb-3">
              <button
                onClick={() => toggleDropdown(menu.category)}
                className="flex justify-between items-center w-[200px] px-4 py-2  mx-5 bg-gray-500 hover:bg-gray-400 rounded-md text-left"
              >
                <span>{menu.category}</span>
                {dropdown[menu.category] ? (
                  <AiFillCaretUp className="ml-2" />
                ) : (
                  <AiFillCaretDown className="ml-2" />
                )}
              </button>
              {dropdown[menu.category] && (
                <ul className="mt-2 ml-4">
                  {menu.items.map((item) => (
                    <li key={item.title} className="mb-1">
                      <Link
                        to={item.href}
                        className="block px-3 py-1 rounded-md hover:bg-gray-400"
                      >
                        - {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={handleLogout}
        className="mx-10 bg-red-600 text-white rounded-md px-10 py-1"
      >
        Logout
      </button>

    </aside>
  );
}
