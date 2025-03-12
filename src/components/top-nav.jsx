import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth.jsx";
import { jwtDecode } from "jwt-decode";

export function TopNav() {
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const token = auth?.token;
  const decoded = token?jwtDecode(token):null;

  // const router = useRouter();
//   if (token) {
//     
//     setUser(decoded)
//   }

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

  const handleProfile = () => {
    // router.push('/backoffice/profile');
  };

  return (
    <nav className="bg-white shadow-sm  overflow-hidden sticky top-0 z-999">
      <div className="mx-auto px-6">
        <div className="flex h-8 justify-between items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold overflow-hidden sticky top-0 z-999">Library Service 2025</h1>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600">{decoded?(decoded.email):null}</span>
            {/* <span className="text-indigo-400 ml-5 font-bold">( {level} )</span> */}

            {/* <button
              onClick={handleProfile}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-5 hover:bg-indigo-600"
            >
              <i className="fa-solid fa-user mr-3"></i>
              Profile
            </button> */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-red-600"
            >
              <i className="fa-solid fa-right-from-bracket mr-3"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
