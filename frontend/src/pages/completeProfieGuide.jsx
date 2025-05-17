import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSelectDropdown from "../components1/MultiSelect";
import { useNavigate, useLocation } from "react-router-dom";
import UseUserStore from "../Store/UseUserStore";
import toast from 'react-hot-toast';


const CompleteGuideProfile = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { completeGuideRegistration } = UseUserStore();

  // Get registration data passed from the Register component
  const basicRegistrationData = location.state?.registrationData || null;

  // If no data was passed, redirect back to registration
  useEffect(() => {
    if (!basicRegistrationData) {
      navigate("/register");
    }
  }, [basicRegistrationData, navigate]);

  const [formData, setFormData] = useState({
    // Preserve data from initial registration
    ...basicRegistrationData,
    // Additional guide-specific fields
    ville: "",
    experience: "",
    image: null,
    Langues: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLanguagesChange = (selectedLanguages) => {
    setFormData({
      ...formData,
      Langues: selectedLanguages,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create FormData object for file upload
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "Langues") {
          data.append("Langues", JSON.stringify(value || []));
        } else if (key === "image" && value) {
          data.append("image", value);
        } else {
          data.append(key, value);
        }
      });

      // Call complete registration API
      const result = await completeGuideRegistration(data);

      if (result.success) {
        toast.success("l'inscription est complete avec succes");
        navigate("/");
      } else {
        alert(result.message || "Failed to complete registration");
      }
    } catch (error) {
      console.error("Error completing guide registration:", error);
      alert("An error occurred while completing registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-transparent space-y-6">
      <Card className="w-full max-w-md border-red-300 border shadow-2xl shadow-red-300">
        <CardHeader>
          <CardTitle className="text-center capitalize">
            Complete Guide Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ville">Ville</Label>
              <select
                name="ville"
                id="ville"
                value={formData.ville}
                onChange={handleChange}
                className="py-2 w-full border rounded-lg"
                required
              >
                <option value="">Selectionnez votre ville</option>
                <option value="ouarzazate">ouarzazate</option>
                <option value="marrakech">marrakech</option>
                <option value="zagora">zagora</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Langues</Label>
              <MultiSelectDropdown
                options={["Français", "Anglais", "arabic", "tamazight"]}
                selected={formData.Langues}
                setSelected={handleLanguagesChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Expérience (années)</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                required
                placeholder="Nombre d'années d'expérience"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-upload">Photo de profil</Label>
              <label
                htmlFor="image-upload"
                className="inline-flex items-center gap-2 px-6 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 text-gray-700 w-fit"
              >
                <span>Upload Image</span>
              </label>
              <input
                id="image-upload"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                required
              />
              {formData.image && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected file: {formData.image.name}
                </p>
              )}
            </div>

            <Button
              className="w-full bg-red-500 hover:bg-red-300"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteGuideProfile;
