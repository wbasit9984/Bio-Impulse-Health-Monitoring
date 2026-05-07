import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../state/state";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlelogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://health-risk-detector-back.onrender.com/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const userInfo = await res.json();

      if (userInfo.error) {
        return console.log("Error logging in:", userInfo.error);
      }

      console.log("Login successful:", userInfo);

      dispatch(
        setLogin({
          user: {
            id: userInfo.user.id,
            username: userInfo.user.username,
            email: userInfo.user.email,
          },
        })
      );

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen w-full flex">
      <section className="w-[40%] flex flex-col justify-center items-center">
        <div className="backdrop-blur-xl bg-blue-800/10 border border-white/20 h-[12rem] w-[20rem] rounded-md flex flex-col items-center pt-5 gap-3 shadow-2xl">
          <div className="">
            <p className="mb-1 font-bold">Username</p>
            <input
              type="text"
              className="rounded-md px-3 py-1"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="">
            <p className="mb-1 font-bold">Password</p>
            <input
              type="password"
              className="rounded-md px-3 py-1"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-400 hover:bg-blue-500 text-white hover:text-cyan-400 font-semibold mt-5 rounded-b-lg shadow-lg hover:shadow-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlelogin}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div className="flex mt-1">
            <div className="flex justify-center items-center text-sm text-amber-100/70 gap-1">
              Don't have an account?{" "}
              <p className="text-blue-400 hover:text-cyan-400 font-semibold transition cursor-pointer">
                Sign up
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-[60%] flex justify-center items-center mx-10">
        <div className="">
          <img
            src="https://res.cloudinary.com/dmnspicpk/image/upload/v1776371806/BioImpulse_Logo_xjawfw.png"
            alt=""
            className=" rounded-full"
          />
        </div>
      </section>
    </div>
  );
};

export default Login;
