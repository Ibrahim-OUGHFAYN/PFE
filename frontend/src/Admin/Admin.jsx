import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "./HeaderAdmin";
import UseUserStore from "../Store/UseUserStore";

const admin_name = "bonjour ibrahim";

const Admin = () => {
  const {logout,user} = UseUserStore();
  const admin_name = "bonjour "+user.name;


  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <HeaderAdmin name={admin_name} />

      <div className="mt-4 w-[90%] mx-auto flex flex-row justify-around items-center gap-6">
        <div
          className="bg-slate-400 text-white border border-black w-[45%] py-10 text-center rounded-lg text-xl cursor-pointer hover:bg-slate-300 hover:text-black transition"
          onClick={() => navigate("/Admin/Users")}
        >
          Gérer utilisateurs
        </div>
        <div
          className="bg-slate-400 text-white border border-black w-[45%] py-10 text-center rounded-lg text-xl cursor-pointer hover:bg-slate-300 hover:text-black transition"
          onClick={() => navigate("/Admin/Places")}
        >
          Gérer lieux
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="border-1 hover:shadow-2xl hover:shadow-red-300 border-red-500 cursor-pointer rounded-md p-3 w-[50%] hover:bg-red-200 transition duration-200 "
          onClick={() => handleLogout()}
        >
          Déconnexion
        </button>
      </div>
    </>
  );
};

export default Admin;
