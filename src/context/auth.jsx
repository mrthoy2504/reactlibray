import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import {BACK_URL} from "./../URL.jsx";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
    memberCon: "test",
  });

  // axios config
  axios.defaults.baseURL = {BACK_URL};
  axios.defaults.headers.common["Authorization"] = auth?.token;

  // alert(auth?.token)
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parsed = JSON.parse(data);
      setAuth({ ...auth,token: parsed.token,memberCon:"case" });
   
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider};
