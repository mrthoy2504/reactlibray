import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import { BACK_URL } from "./../URL.jsx";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  //
  // axios config
  axios.defaults.baseURL = { URL };
  axios.defaults.headers.common["Authorization"] = auth?.token;

  const check = async () => {
    const token = JSON.parse(localStorage.getItem("auth")).token;
    const checkMe = await axios.get(`${BACK_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (checkMe) {  
      const data = localStorage.getItem("auth");
       alert(JSON.stringify(data));
      if (data) {
        const parsed = JSON.parse(data);
        setAuth({ ...auth, token: parsed.token });
      }
    }
    
  };

  // alert(auth?.token)
  useEffect(() => {
    check();
    // const data = localStorage.getItem("auth");
    // if (data) {
    //   const parsed = JSON.parse(data);
    //   setAuth({ ...auth, token: parsed.token });
    // }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
