import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("password", formData.password);
    if (formData.image) {
      data.append("image", formData.image);
    }

    // Exemple pour l'envoyer à ton API
    // axios.put('/api/user/update-profile', data)
    //   .then(response => console.log(response))
    //   .catch(error => console.error(error));

    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-transparent space-y-6">
      <Card className="w-96  border-red-300 border shadow-2xl shadow-red-300">
        <CardHeader>
          <CardTitle className="text-center capitalize">
            mettre à jour le profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Entrez votre prénom"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Entrez votre nom"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="image-upload"
                className="inline-flex items-center gap-2 px-36 py-2 bg-gray-50 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 text-gray-700 w-fit "
              >
                <span>Profile</span>
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>
            <Button
              className="w-full bg-red-500 hover:bg-red-300"
              type="submit"
            >
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateProfile;
