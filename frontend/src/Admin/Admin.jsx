import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "./HeaderAdmin";

const admin_name = "bonjour ibrahim";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header affiché en haut */}
      <HeaderAdmin name={admin_name} />

      {/* Contenu principal */}
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
    </>
  );
};

export default Admin;
