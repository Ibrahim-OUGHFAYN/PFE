import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components1/Header";
import Forget from "./pages/Forget";
import Reset from "./pages/Reset";
import Guides from "./pages/Guides";
import Footer from "./components1/Footer";
import Admin from "./Admin/Admin";
import Profile from "./pages/ProfileGuide";
import Places from "./pages/Places";
import UpdateProfile from "./pages/UpdateProfile";
import UseUserStore from "./Store/UseUserStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import AdminUsers from "./Admin/AdminUsers"
import AdminPlaces from "./Admin/AdminPlaces"
import AddPlace from "./Admin/AddUpdatePlace"

// Move this inside BrowserRouter context so useLocation can work
const MainRoutes = () => {
  const user = UseUserStore((state) => state.user);
  const fetchUser = UseUserStore((state) => state.fetchUser);
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) return;
    fetchUser();
  }, []);

  // Hide layout for /Admin page (you can add more paths here)
  const hideLayout = location.pathname.startsWith("/Admin");

  return (
    <>
      {!hideLayout && <Header />}
      <Routes>
        <Route index element={<App />} />
        <Route path="/Login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/Register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/Forget" element={user ? <Navigate to="/" /> : <Forget />} />
        <Route path="/Forget/Reset" element={user ? <Navigate to="/" /> : <Reset />} />
        <Route path="/Guides" element={<Guides />} />
        <Route path="/Admin" element={user ? <Navigate to="/" /> : <Admin />} />
        <Route path="/Admin/Users" element={user ? <Navigate to="/" /> : <AdminUsers />} />
        <Route path="/Admin/Places" element={user ? <Navigate to="/" /> : <AdminPlaces />} />
        <Route path="/Admin/Places/AddPlace" element={user ? <Navigate to="/" /> : <AddPlace />} />
        <Route path="/Guides/Profile" element={<Profile />} />
        <Route path="/Places" element={<Places />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
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
