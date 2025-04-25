import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";


const LogoComp = () => {
const navigate = useNavigate();
  return (
    <div
      className="flex items-center justify-center cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img src={logo} alt="Logo" className="h-8 w-8" />
      <span className="text-xl text-red-500 font-bold">E-Guide</span>
    </div>
  );
};

export default LogoComp;
