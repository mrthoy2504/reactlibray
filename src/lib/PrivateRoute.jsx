import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Login from "../pages/Login.jsx";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(true)
  }, []);
  return ok ? <Outlet /> : <Login />;
}
