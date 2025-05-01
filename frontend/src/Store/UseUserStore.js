// src/Store/useUserStore.js
import { create } from "zustand";
import axios from "axios";

const UseUserStore = create((set) => ({
  user: null,

  setUser: (userData) => set({ user: userData }),

  logout: async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/user/logout",
        {},
        { withCredentials: true }
      );
      set({ user: null });
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  },

  // Fetch the current user profile
  fetchUser: async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/user-profile", {
        withCredentials: true,
      });
      set({ user: res.data });
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  },

  // Handle signup
  signup: async (formData) => {
    try {
      const payload = {
        name: `${formData.firstname} ${formData.lastname}`,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        experience: formData.experience,
      };

      const response = await axios.post(
        "http://localhost:5000/api/user/signup",
        payload,
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        set({ user: response.data });
        return { success: true };
      } else {
        return { success: false, message: "Erreur lors de l'inscription." };
      }
    } catch (error) {
      console.error("Erreur axios :", error);
      return {
        success: false,
        message: error.response?.data?.message || "Une erreur est survenue.",
      };
    }
  },

  // Login method: after successful login, fetch the user profile
  login: async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/user/login", data, {
        withCredentials: true,
      });

      if (res.status === 201 || res.status === 200) {
        // After login success, fetch the user profile
        await UseUserStore.getState().fetchUser();
        return { success: true };
      } else {
        return { success: false, message: "Erreur lors de la connexion." };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Une erreur est survenue.",
      };
    }
  },
}));

export default UseUserStore;
