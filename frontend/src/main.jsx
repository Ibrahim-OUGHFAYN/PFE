import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components1/Header";
import Forget from "./pages/Forget";
import Reset from "./pages/Reset";
import Guides from "./pages/Guides";
import Footer from "./components1/Footer";
import Admin from "./components1/Admin";
import Profile from "./pages/ProfileGuide";
import Places from "./pages/Places";
import UpdateProfile from "./pages/UpdateProfile";
import UseUserStore from "./Store/UseUserStore";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Cookies from "js-cookie"; 



const Root = () => {
  const user = UseUserStore((state) => state.user);
  const fetchUser = UseUserStore((state) => state.fetchUser);
  const loading = UseUserStore((state) => state.loading);

  useEffect(() => {
    // const token = Cookies.get("jwt");
  
    // if (!token) {
    //   // 🔑 no session → stop the spinner
    //   UseUserStore.getState().setLoading(false);
    //   return;
    // }
  
    fetchUser();
  }, [/*fetchUser*/]);

  if (loading) return <div></div>;
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route index element={<App />} />
        <Route path="/Login" element={user ? <Navigate to="/" /> : <Login />} />
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
        <Route path="/Guides" element={<Guides />} />
        <Route path="/Admin" element={user?<Navigate to="/" />:<Admin />} />
        <Route path="/Guides/Profile" element={<Profile />} />
        <Route path="/Places" element={<Places />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
      </Routes>
      <Footer />

      <Toaster
        position="top-center"
        toastOptions={{
          className: "rounded-2xl shadow-xl font-medium",
        }}
      />
    </BrowserRouter>
  );
};
const container = document.getElementById("root");
if (!container._root) {
  container._root = createRoot(container);
  container._root.render(<Root />);
}
