// src/Store/useUserStore.js
import { create } from "zustand";
import axios from "axios";

const UseUserStore = create((set) => ({
  user: null,
  loading: true,

  setUser: (userData) => set({ user: userData }),

  logout: async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        { withCredentials: true }
      );
      set({ user: null });
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  },

  fetchUser: async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/user-profile",
        {
          withCredentials: true,
        }
      );
      set({ user: res.data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

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
        "http://localhost:5000/api/users/signup",
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

  login:async(data)=>{
    try {
      const res=await axios.post("http://localhost:5000/api/users/login",data,{ withCredentials: true })
      if (res.status === 201 || res.status === 200) {
        set({ user: res.data });
        return { success: true };
      } else {
        return { success: false, message: "Erreur lors de connexion." };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Une erreur est survenue.",
      };
    }
  }

}));

export default UseUserStore;
