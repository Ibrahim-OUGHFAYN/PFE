import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import LogoComp from "@/components1/LogoComp";
import UseUserStore from "@/Store/UseUserStore";
import { useState } from "react";
import { X } from "lucide-react";

const GuideHome = () => {
  const navigate = useNavigate();
  const { logout, user } = UseUserStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Toggle the menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col w-[95%] mx-auto mt-5 gap-4 min-h-screen">
      {/* L'juz' dial header */}
      <div className="bg-red-400 p-5 rounded-md text-2xl text-black text-center flex justify-between items-center">
        <h2 className="text-left md:text-center flex-1">
          Bonjour {user?.name}
        </h2>

        {/* Trigger dial menu li fi mobile */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            onClick={toggleMenu}
          >
            <div>
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Rwabito dial mobile - visible only when menu is open */}
      {isMenuOpen && (
        <div className="absolute right-0 top-20 w-[250px] bg-white p-3 border border-gray-300 rounded-md">
          <LogoComp />
          <div className="mt-4 flex flex-col gap-3">
            <NavLink to="/Guide/profile">
              <Button className="w-full bg-gray-400 text-white">
                Gérer Profil
              </Button>
            </NavLink>
            <NavLink to="/Guide/disponibilites">
              <Button className="w-full bg-gray-400 text-white">
                Disponibilités
              </Button>
            </NavLink>
            <NavLink to="/Guide/reservations">
              <Button className="w-full bg-gray-400 text-white">
                Réservations
              </Button>
            </NavLink>
            <NavLink to="/Guide/contacts">
              <Button className="w-full bg-gray-400 text-white">
                Contacts
              </Button>
            </NavLink>
            <NavLink to="/Guide/aventures">
              <Button className="w-full bg-gray-400 text-white">
                Aventures
              </Button>
            </NavLink>
            <NavLink to="/Guide/avis" className="w-full">
              <Button className="w-full bg-gray-400 text-white">Avis</Button>
            </NavLink>
            <Button
              className="w-full bg-gray-400 text-white"
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      )}

      {/* L'juz' dial main layout */}
      <div className="flex flex-col md:flex-row w-full flex-grow gap-4">
        {/* Sidebar dial desktop */}
        <Card className="hidden md:flex md:w-[20%] p-4 flex-col items-center gap-3 rounded-md shadow-none">
          <LogoComp />
          <NavLink to="/Guide/profile" className="w-full">
            <Button className="w-full bg-gray-400 text-white">
              Gérer Profil
            </Button>
          </NavLink>
          <NavLink to="/Guide/disponibilites" className="w-full">
            <Button className="w-full bg-gray-400 text-white">
              Disponibilités
            </Button>
          </NavLink>
          <NavLink to="/Guide/reservations" className="w-full">
            <Button className="w-full bg-gray-400 text-white">
              Réservations
            </Button>
          </NavLink>
          <NavLink to="/Guide/contacts" className="w-full">
            <Button className="w-full bg-gray-400 text-white">Contacts</Button>
          </NavLink>
          <NavLink to="/Guide/aventures" className="w-full">
            <Button className="w-full bg-gray-400 text-white">Aventures</Button>
          </NavLink>
          <NavLink to="/Guide/avis" className="w-full">
            <Button className="w-full bg-gray-400 text-white">Avis</Button>
          </NavLink>
          <Button
            className="w-full bg-gray-400 text-white"
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </Card>

        {/* L'juz' dial content principal */}
        <div className="flex-1 bg-white border border-gray-200 p-2 mb-6 rounded-md">
          {/* Rwabito dial nested routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default GuideHome;
