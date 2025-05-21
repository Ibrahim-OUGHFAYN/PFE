import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components1/Header";
import Forget from "./pages/Forget";
import Reset from "./pages/Reset";
import Guides from "./pages/Guides";
import Footer from "./components1/Footer";
import AdminHome from "./Admin/HomeAdmin";
import Profile from "./pages/ProfileGuide";
import Places from "./pages/Places";
import UpdateProfile from "./pages/UpdateProfile";
import UseUserStore from "./Store/UseUserStore";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import AdminUsers from "./Admin/AdminUsers";
import AdminPlaces from "./Admin/AdminPlaces";
import AddPlace from "./Admin/AddUpdatePlace";
import Loader from "./Loader";
import GuideHome from "./guide/GuideHome";
import GuideAventures from "./guide/GuideAventures";
import GuideContactes from "./guide/GuideContactes";
import GuideDesponibilities from "./guide/GuideDesponibilities";
import GuideReservations from "./guide/GuideReservations";
import GuideProfile from "./guide/Profile";
import CompleteGuideProfile from "./pages/completeProfieGuide";
import Reservation from "./pages/reservation";

const MainRoutes = () => {
  const user = UseUserStore((state) => state.user);
  const fetchUser = UseUserStore((state) => state.fetchUser);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get("jwt");
      if (token) {
        await fetchUser();
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const isAdmin = user && user.role === "admin";
  const isGuide = user && user.role === "guide";
  const hideLayout =
    location.pathname.startsWith("/Guide") ||
    location.pathname.startsWith("/Admin");

  if (loading) return <Loader />;

  if (user && location.pathname === "/" && isAdmin) {
    return <Navigate to="/Admin" />;
  }
  if (user && location.pathname === "/" && isGuide) {
    return <Navigate to="/Guide" />;
  }

  return (
    <>
      {!hideLayout && <Header />}
      <Routes>
        <Route index element={<App />} />
        <Route path="/loader" element={<Loader />} />
        {/* Auth  */}
        <Route
          path="/Login"
          element={
            user ? (
              isAdmin ? (
                <Navigate to="/Admin" />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/Register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/Forget"
          element={user ? <Navigate to="/" /> : <Forget />}
        />
        <Route
          path="/Forget/Reset"
          element={user ? <Navigate to="/" /> : <Reset />}
        />
        {/* Public  */}
        <Route path="/guides" element={<Guides />} />
        <Route path="/Places" element={<Places />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/guides/:id" element={<Profile />} />
        <Route
          path="/complete-guide-profile"
          element={<CompleteGuideProfile />}
        />
        <Route path="/guides/reservation/:id" element={<Reservation />} />

        {/* Admin  */}
        <Route
          path="/Admin"
          element={
            isAdmin ? <AdminHome name={user?.name} /> : <Navigate to="/" />
          }
        >
          <Route
            index
            element={<div>Bienvenue dans le tableau de bord admin</div>}
          />
          <Route path="Users" element={<AdminUsers />} />
          <Route path="Places" element={<AdminPlaces />} />
          <Route path="Places/AddPlace" element={<AddPlace />} />
          <Route path="Logout" element={<div>Déconnexion...</div>} />
          <Route path="Places/modifier/:id" element={<AddPlace />} />
        </Route>

        {/* Guide */}
        <Route
          path="/Guide"
          element={isGuide ? <GuideHome /> : <Navigate to="/" />}
        >
          <Route
            index
            element={<div>Bienvenue dans le tableau de bord guide</div>}
          />
          <Route path="profile" element={<GuideProfile />} />
          <Route path="disponibilites" element={<GuideDesponibilities />} />
          <Route path="reservations" element={<GuideReservations />} />
          <Route path="contacts" element={<GuideContactes />} />
          <Route path="aventures" element={<GuideAventures />} />
          <Route path="logout" element={<div>Déconnexion...</div>} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!hideLayout && <Footer />}
      <Toaster
        position="top-center"
        toastOptions={{
          className: "rounded-2xl shadow-xl font-medium",
        }}
      />
    </>
  );
};

const Root = () => (
  <BrowserRouter>
    <MainRoutes />
  </BrowserRouter>
);

const container = document.getElementById("root");
if (!container._root) {
  container._root = createRoot(container);
  container._root.render(<Root />);
}
