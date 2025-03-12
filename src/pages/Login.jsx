import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { BACK_URL } from "./../URL.jsx";

const Login = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = auth?.token;

  // Redirect to home if already logged in
  useEffect(() => {
    if (token) {
      navigate(`/dashboard`);
    }
  }, [token, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BACK_URL}/api/auth/login`, {
        email,
        password,
      });
      if (response?.data?.error) {
        toast.error(response.data.error);
      } else {

        localStorage.setItem("auth", JSON.stringify(response.data));
        // localStorage.setItem("user", JSON.stringify(response.data.user));
        setAuth({
          ...auth,
          token: response.data.token,
          user: response.data.user,
        });

        toast.success("Login successful");
        navigate(
          location.state ||
            `/${response?.data.user.role === "admin" ? "home" : "user"}`
        );
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.log(error);
    }
  };

  return (
    <div className="h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

  

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                placeholder="Email"
                value={email}
                className="w-full px-2"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                className="w-full px-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
