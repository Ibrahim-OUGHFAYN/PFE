import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AddPlaceForm = () => {
  const { id } = useParams(); // If present, we're in edit mode
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // Can contain both URLs and File objects
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load place data if in edit mode
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/places/${id}`)
        .then((res) => {
          const place = res.data;
          setNom(place.nom);
          setLatitude(place.latitude);
          setLongitude(place.longitude);
          setDescription(place.description);
          setImages(place.images || []);
        })
        .catch((err) => {
          console.error("Erreur lors du chargement :", err);
          toast.error("Erreur lors du chargement du lieu.");
        });
    }
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("description", description);

    images.forEach((img) => {
      if (typeof img !== "string") {
        formData.append("images", img); // Only upload new files
      }
    });

    // Also include old image URLs if in edit mode
    if (id) {
      const oldImages = images.filter((img) => typeof img === "string");
      formData.append("oldImages", JSON.stringify(oldImages));
    }

    setLoading(true);
    setError(null);

    try {
      if (id) {
        await axios.put(
          `http://localhost:5000/api/places/update/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Lieu mis à jour avec succès !");
      } else {
        await axios.post(
          "http://localhost:5000/api/places/Add",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Lieu ajouté avec succès !");
      }
      navigate("/Admin/Places");
    } catch (err) {
      console.error(err);
      setError("Échec de l'opération.");
      toast.error("Échec de l'opération.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-white p-6 rounded-lg shadow-md w-full max-w-xl mx-auto mt-5 border hover:shadow-2xl hover:shadow-red-300 transition duration-300 border-red-500"
      >
        <input
          type="text"
          placeholder="Nom du lieu"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="border border-gray-300 rounded px-4 py-2 hover:border-red-500"
        />

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            className="w-1/2 border border-gray-300 rounded px-4 py-2 hover:border-red-500"
          />
          <input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            className="w-1/2 border border-gray-300 rounded px-4 py-2 hover:border-red-500"
          />
        </div>

        <textarea
          placeholder="Description du lieu"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          required
          className="border border-gray-300 rounded px-4 py-2 hover:border-red-500"
        ></textarea>

        <div>
          <label
            htmlFor="image-upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 text-gray-700 w-fit"
          >
            <PlusCircle className="w-5 h-5 text-red-800" />
            <span>Ajouter des images</span>
          </label>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {/* Display selected images */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={typeof img === "string" ? img : URL.createObjectURL(img)}
                    alt={`preview-${index}`}
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 text-gray-700 hover:text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {loading && <p className="text-blue-500">En cours...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <Button
          type="submit"
          className="flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 h-12 rounded-md"
        >
          <PlusCircle className="w-5 h-5" />
          {id ? "Mettre à jour" : "Ajouter"}
        </Button>
      </form>
    </>
  );
};

export default AddPlaceForm;
