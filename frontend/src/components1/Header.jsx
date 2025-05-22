import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import MenuIcon from "../assets/menu.png";
import cancel from "../assets/cancel.png";
import { useNavigate, useLocation } from "react-router-dom";
import LogoComp from "./LogoComp";
import Bs from "./Bs";
import UseUserStore from "../Store/UseUserStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from "../Loader";
import { CalendarCheck } from "lucide-react";

const Header = () => {
  const { user, logout, fetchUser, reservations, fetchUserReservations } =
    UseUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [hasReservations, setHasReservations] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUser = async () => {
      await fetchUser();
      setLoading(false);
    };
    loadUser();
  }, []);

  // Add a separate effect for fetching reservations
  useEffect(() => {
    const fetchReservations = async () => {
      if (user) {
        console.log("Fetching reservations for user:", user.id);
        const result = await fetchUserReservations();
        console.log("Fetch result:", result);
        setHasReservations(
          result.success && result.data && result.data.length > 0
        );
      }
    };
    fetchReservations();
  }, [user, fetchUserReservations]);

  // Check for reservations when they change in the store
  useEffect(() => {
    setHasReservations(reservations && reservations.length > 0);
  }, [reservations]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = (id) => {
    setIsMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(id), 100);
    } else {
      scrollToSection(id);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const goToReservations = () => {
    navigate("/reservations");
    setIsMenuOpen(false);
  };

  const ProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <img
            src={user.imgUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-white shadow-lg rounded-md p-2 border border-gray-200"
      >
        <Button
          onClick={() => navigate("/update-profile")}
          variant="ghost"
          className="block w-full text-left text-gray-700 hover:text-red-900 transition hover:bg-gray-100 px-4 py-2 rounded-md"
        >
          Modifier le profil
        </Button>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="block w-full text-left text-red-500 hover:text-red-600 transition hover:bg-gray-100 px-4 py-2 rounded-md"
        >
          Déconnexion
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white z-50">
        <Loader />
      </div>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between p-4 w-full max-w-15xl border transition duration-300 ${
        scrolled ? "border-b-1 rounded-b-3xl bg-neutral-50 " : "border-gray-50"
      }`}
    >
      <div className="pl-3">
        <LogoComp />
      </div>

      <button className="lg:hidden p-2" onClick={toggleMenu}>
        <img
          src={isMenuOpen ? cancel : MenuIcon}
          alt="Menu"
          className="w-6 h-6"
        />
      </button>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-lg flex flex-col items-center py-4 gap-2 rounded-lg border-1 border-red-500">
          <Button
            variant="ghost"
            className="hover:text-red-500 cursor-pointer"
            onClick={() => handleScroll("hero")}
          >
            Accueil
          </Button>
          <Button
            variant="ghost"
            className="hover:text-red-500 cursor-pointer"
            onClick={() => handleScroll("about")}
          >
            À propos
          </Button>
          <Bs onNavigate={() => setIsMenuOpen(false)} />
          <Button
            variant="ghost"
            onClick={() => handleScroll("contact")}
            className="hover:text-red-500 cursor-pointer"
          >
            Contact
          </Button>
          {user ? (
            <>
              {hasReservations && (
                <Button
                  className="bg-white hover:bg-red-300 text-white border border-red-400"
                  onClick={goToReservations}
                >
                  <CalendarCheck></CalendarCheck>
                  Mes réservations
                </Button>
              )}
              <ProfileDropdown />
            </>
          ) : (
            <>
              <Button
                className="bg-red-500 hover:bg-red-300"
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
              >
                Se connecter
              </Button>
              <Button
                className="border border-red-500 bg-white text-black hover:bg-red-300"
                onClick={() => {
                  navigate("/register");
                  setIsMenuOpen(false);
                }}
              >
                S'inscrire
              </Button>
            </>
          )}
        </div>
      )}

      <div className="hidden lg:flex gap-4 items-center">
        <Button
          variant="ghost"
          className="hover:text-red-500 cursor-pointer"
          onClick={() => handleScroll("hero")}
        >
          Accueil
        </Button>
        <Button
          variant="ghost"
          className="hover:text-red-500 cursor-pointer"
          onClick={() => handleScroll("about")}
        >
          À propos
        </Button>
        <Button
          variant="ghost"
          className="hover:text-red-500 cursor-pointer"
          onClick={() => handleScroll("contact")}
        >
          Contact
        </Button>
        <Bs />
        {user ? (
          <>
            {hasReservations && (
              <Button
                className="bg-white hover:bg-red-300 text-black border-2 border-red-400 rounded-full"
                onClick={() => navigate("/reservations")}
              >
                <CalendarCheck></CalendarCheck>
                Mes réservations
              </Button>
            )}
            <ProfileDropdown />
          </>
        ) : (
          <>
            <Button
              className="bg-red-500 hover:bg-red-300 rounded-full"
              onClick={() => navigate("/login")}
            >
              Se connecter
            </Button>
            <Button
              className="border border-red-500 bg-white text-black hover:bg-red-300 rounded-full"
              onClick={() => navigate("/register")}
            >
              S'inscrire
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
