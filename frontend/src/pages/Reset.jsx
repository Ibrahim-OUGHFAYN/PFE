import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";


const Reset = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/reset-password",
        {
          password: formData.password,
        }
      );

      setSuccess("Mot de passe réinitialisé avec succès !");
      setFormData({ password: "", confirmPassword: "" }); // Réinitialiser le formulaire
    } catch (error) {
      setError(error.response?.data?.message || "Une erreur est survenue.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-transparent"
    
    >
      <Card className="w-96 p-6 border-red-300 border-1 shadow-2xl shadow-red-300">
        <CardContent>
          <h2 className="text-2xl font-semibold text-red-500 text-center mb-4">
            Réinitialiser le mot de passe
          </h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mt-3 relative">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="hover:border-red-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="mt-3 relative">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmer le mot de passe"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="hover:border-red-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-red-500 hover:bg-red-300"
            >
              Envoyer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reset;
