import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

const AventuresForm = () => {
  const [aventures, setAventures] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyAventures();
  }, []);

  const fetchMyAventures = async () => {
    try {
      setLoadingFetch(true);
      const response = await axios.get("http://localhost:5000/api/my-aventures", {
        withCredentials: true, 
      });
      
      if (response.data.success) {
        setAventures(response.data.data.aventures || []);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des aventures:", err);
      if (err.response?.status === 403) {
        toast.error("Vous devez être un guide pour accéder à cette fonctionnalité.");
      } else {
        toast.error("Erreur lors du chargement de vos aventures.");
      }
    } finally {
      setLoadingFetch(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setAventures((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setAventures(aventures.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();

    aventures.forEach((img) => {
      if (typeof img !== "string") {
        formData.append("aventures", img); 
      }
    });

    // Inclure les anciennes images (URLs) à conserver
    const oldImages = aventures.filter((img) => typeof img === "string");
    formData.append("oldImages", JSON.stringify(oldImages));

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        "http://localhost:5000/api/aventures",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // Pour envoyer les cookies (JWT)
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchMyAventures();
      }
    } catch (err) {
      console.error("Erreur:", err);
      if (err.response?.status === 403) {
        setError("Vous devez être un guide pour modifier des aventures.");
        toast.error("Vous devez être un guide pour modifier des aventures.");
      } else if (err.response?.status === 401) {
        setError("Veuillez vous connecter pour continuer.");
        toast.error("Veuillez vous connecter pour continuer.");
      } else {
        setError("Échec de la mise à jour des aventures.");
        toast.error("Échec de la mise à jour des aventures.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingFetch) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-gray-600">Chargement de vos aventures...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-5">
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Mes Aventures
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 text-gray-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5 text-red-500" />
              <span className="font-medium">Ajouter des images d'aventures</span>
            </label>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-2">
              Vous pouvez sélectionner plusieurs images à la fois (JPG, PNG, etc.)
            </p>
          </div>

          {/* Affichage des images sélectionnées */}
          {aventures.length > 0 && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {aventures.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={
                        typeof img === "string" ? img : URL.createObjectURL(img)
                      }
                      alt={`aventure-${index}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg  hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {/* Indicateur de type d'image */}
                    <div className="absolute bottom-2 left-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          typeof img === "string"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {typeof img === "string" ? "Existante" : "Nouvelle"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages d'état */}
          {loading && (
            <div className="text-blue-500 text-center py-4">
              Mise à jour en cours...
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-center py-2 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {/* Bouton de soumission */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 px-8 py-3 text-lg font-medium rounded-lg transition-colors"
              disabled={loading }
            >
              {loading ? "Mise à jour..." : "Mettre à jour mes aventures"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AventuresForm;