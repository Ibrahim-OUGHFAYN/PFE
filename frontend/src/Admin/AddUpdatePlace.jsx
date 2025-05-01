import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderAdmin from "./HeaderAdmin";
import axios from "axios"; // Import axios

const AddPlaceForm = () => {
  const [nom, setNom] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(null); // Success state

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
    images.forEach((file) => formData.append("images", file));

    setLoading(true); // Set loading to true when the API call starts
    setError(null); // Reset error
    setSuccess(null); // Reset success

    try {
      // Make a POST request to the backend API
      const response = await axios.post("http://localhost:5000/api/places/Add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // On successful response
      setSuccess("Place added successfully!");
      setNom("");
      setLatitude("");
      setLongitude("");
      setDescription("");
      setImages([]);
    } catch (err) {
      // On error
      setError("Failed to add place. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after the request completes
    }
  };

  return (
    <>
      <HeaderAdmin name="ajouter lieu" />
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
            className="w-1/2 border border-gray-300 rounded px-4 py-2  hover:border-red-500"
          />
          <input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            className="w-1/2 border border-gray-300 rounded px-4 py-2  hover:border-red-500"
          />
        </div>

        <textarea
          placeholder="Description du lieu"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          required
          className="border border-gray-300 rounded px-4 py-2  hover:border-red-500"
        ></textarea>

        <div>
          <label
            htmlFor="image-upload"
            className="inline-flex items-center gap-2 px-45 py-2 bg-gray-50 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 text-gray-700 w-fit "
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
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
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

        {/* Display loading, success, or error messages */}
        {loading && <p className="text-blue-500">Uploading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <Button
          type="submit"
          className="flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 h-12 rounded-md"
        >
          <PlusCircle className="w-5 h-5" />
          Ajouter
        </Button>
      </form>
    </>
  );
};

export default AddPlaceForm;
