import { Outlet, NavLink ,useNavigate} from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LogoComp from "@/components1/LogoComp";
import UseUserStore from "@/Store/UseUserStore";

const AdminHome = ({ name }) => {
    const navigate = useNavigate(); // Correct placement of useNavigate

  const { logout } = UseUserStore();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  return (
    <div className="flex flex-col w-[90%] mx-auto mt-5 gap-4 min-h-screen">
      {/* Header */}
      <div className="bg-red-400 p-5 rounded-md text-2xl text-black flex justify-center w-full">
        <h2>{name}</h2>
      </div>

      {/* Main layout */}
      <div className="flex w-full flex-grow gap-4">
        {/* Sidebar */}
        <Card className="hidden md:flex w-[20%] p-4 flex-col rounded-md items-center gap-4 h-fit">
          <LogoComp />
          <NavLink to="/Admin/Users" className="w-full">
            <Button className="w-full py-2 bg-gray-400 text-white">Gérer utilisateurs</Button>
          </NavLink>
          <NavLink to="/Admin/Places" className="w-full">
            <Button className="w-full py-2 bg-gray-400 text-white">Gérer lieux</Button>
          </NavLink>
          <Button className="w-full py-2 bg-gray-400 text-white" onClick={handleLogout}>
            Déconnexion
          </Button>
        </Card>

        {/* Main content area */}
        <div className="flex-2 bg-white border border-gray-200 p-2 mb-6 rounded-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
