import React, { useState, useRef, useEffect } from "react";
import useUserStore from "../Store/UseUserStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import MultiSelectDropdown from "../components1/MultiSelect";
import { ImageUp } from "lucide-react";

export default function GuideProfileForm() {
  const languageOptions = [
    "Français",
    "Anglais",
    "Espagnol",
    "Allemand",
    "Italien",
    "tamazight",
    "arabic",
  ];
  const { user, setUser } = useUserStore();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(user?.imgUrl || "");
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLangues, setSelectedLangues] = useState(user?.Langues || []);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    ville: user?.ville || "",
    experience: user?.experience || "",
    Langues: user?.Langues?.join(", ") || "",
  });

  useEffect(() => {
    if (img) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(img);
    }
  }, [img]);

  const validateImage = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error("Format d'image non supporté. Utilisez JPG ou PNG.");
    }
    if (file.size > maxSize) {
      throw new Error("L'image ne doit pas dépasser 5MB.");
    }
  };

  const handleImgClick = () => {
    fileInputRef.current.click();
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        validateImage(file);
        setImg(file);
        setError("");
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Create FormData object
      const data = new FormData();

      // Append text fields
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("ville", formData.ville);
      data.append("experience", formData.experience);

      // Handle languages correctly - send as stringified array
      const languesArray = formData.Langues.split(",").map((lang) =>
        lang.trim()
      );
      data.append("Langues", JSON.stringify(selectedLangues));

      // Append image if exists
      if (img) {
        data.append("file", img); // Note: backend expects 'file' as the field name
      }

      // Debug logging
      console.log("Sending data to server:", {
        userId: user._id,
        name: formData.name,
        email: formData.email,
        ville: formData.ville,
        experience: formData.experience,
        Langues: languesArray,
      });

      const res = await fetch("http://localhost:5000/api/guides/update", {
        method: "PUT",
        credentials: "include", // Important for cookies/auth
        body: data,
        // Don't set Content-Type header - FormData sets it automatically with boundary
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour");
      }

      const result = await res.json();
      setUser(result.guide);
      toast.success("Profil mis à jour avec succès !");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto space-y-4 p-4 text-center"
    >
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Image de profil */}
      <div className="flex flex-col items-center gap-2">
        <img
          src={preview || "/default-avatar.png"} // Fallback to default image
          alt="Profil"
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
          onClick={handleImgClick}
        />
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImgChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleImgClick}
          disabled={isLoading}
        >
          <ImageUp className="w-5 h-5" />
        </Button>
      </div>

      {/* Champs de formulaire */}
      <div className="text-left space-y-4">
        <div>
          <Label>Nom</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="mt-1 rounded-md"
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
                        className="mt-1 rounded-md"

          />
        </div>
        <div>
          <Label>Ville</Label>
          <Input
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            required
            disabled={isLoading}
                        className="mt-1 rounded-md"

          />
        </div>
        <div>
          <Label>Langues</Label>
          <MultiSelectDropdown
            options={languageOptions}
            selected={selectedLangues}
            setSelected={setSelectedLangues}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Expérience (années)</Label>
          <Input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            min="0"
            disabled={isLoading}
                        className="mt-1 rounded-md"

          />
        </div>
      </div>

      <Button type="submit" className="mt-4" disabled={isLoading}>
        {isLoading ? "enregistrement en cours..." : "enregistrer les modifications"}
      </Button>
    </form>
  );
}
