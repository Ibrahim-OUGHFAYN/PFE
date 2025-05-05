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
import AdminHome from "./Admin/Admin";
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
        <Route path="/Guides" element={<Guides />} />
        <Route path="/Places" element={<Places />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/Guides/Profile" element={<Profile />} />
        {/* Admin  */}
        <Route
          path="/Admin"
          element={isAdmin ? <AdminHome /> : <Navigate to="/" />}
        />
        <Route
          path="/Admin/Users"
          element={isAdmin ? <AdminUsers /> : <Navigate to="/" />}
        />
        <Route
          path="/Admin/Places"
          element={isAdmin ? <AdminPlaces /> : <Navigate to="/" />}
        />
        <Route
          path="/Admin/Places/AddPlace"
          element={isAdmin ? <AddPlace /> : <Navigate to="/" />}
        />
        {/*guide*/}
        <Route
          path="/Guide"
          element={isGuide ? <GuideHome /> : <Navigate to="/" />}
        />
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

const Root = () => {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
};

const container = document.getElementById("root");
if (!container._root) {
  container._root = createRoot(container);
  container._root.render(<Root />);
}
