import React from "react";
import Avatar from "@mui/material/Avatar";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogout } from "../state/state";

const Toolbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      const res = await fetch("https://health-risk-detector-back.onrender.com/api/user/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userData: {
            id: user?.id,
          },
        }),
      });

      const data = await res.json();
      if (data.error) {
        return console.error("Error during logout:", data.error);
      }
      dispatch(setLogout());
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  return (
    <div className="fixed mt-3 w-[84.5%] h-[8.5%] flex justify-center items-center z-10">
      <div className="flex justify-between items-center border border-black w-[80%] h-[73px] rounded-2xl bg-zinc-950 z-10 shadow-xl p-8">
        <div className="">
          <input
            type="text"
            className=" rounded-md bg-zinc-700 h-[40px] pl-4"
            placeholder="Search"
          />
          <SearchIcon className="relative right-8 bottom-[2px] text-blue-400" />
        </div>
        <div className="flex gap-3 items-center">
          <TuneIcon className="text-blue-400" style={{ fontSize: 25 }} />
          <NotificationsIcon
            className="text-blue-400"
            style={{ fontSize: 25 }}
          />
          <SettingsIcon className="text-blue-400" style={{ fontSize: 25 }} />
          <Avatar
            alt="Profile Image"
            src={"https://res.cloudinary.com/dmnspicpk/image/upload/v1776371806/BioImpulse_Logo_xjawfw.png"}
            sx={{ width: 45, height: 45 }}
            className="border border-2 border-blue-400"
          />
          <LogoutIcon
            className="text-blue-400 cursor-pointer"
            style={{ fontSize: 25 }}
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
