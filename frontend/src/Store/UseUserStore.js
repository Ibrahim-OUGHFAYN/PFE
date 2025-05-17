import { create } from "zustand";
import axios from "axios";

const UseUserStore = create((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),

  fetchUser: async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/me", {
        withCredentials: true,
      });
      set({ user: res.data });
    } catch (err) {
      set({ user: null });
      console.error("Erreur lors de la récupération de l'utilisateur :", err);
    }
  },

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

  signup: async (formData) => {
    try {
      const payload = {
      name: formData.name, // 👈 Use the `name` field directly
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

  login: async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/user/login", data, {
        withCredentials: true,
      });

      if (res.status === 201 || res.status === 200) {
        set({ user: res.data });
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

  completeGuideRegistration: async (formData) => {
    try {
      // Use FormData to handle file uploads
      // formData should already be a FormData object from the CompleteGuideProfile component
      console.log("form to send ",formData)
      const response = await axios.post(
        "http://localhost:5000/api/user/complete-guide-profile",
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        set({ user: response.data });
        return { success: true };
      } else {
        return { success: false, message: "Erreur lors de la complétion du profil guide." };
      }
    } catch (error) {
      console.error("Erreur lors de la complétion du profil guide:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Une erreur est survenue lors de la complétion du profil guide.",
      };
    }
  }
}));

export default UseUserStore;