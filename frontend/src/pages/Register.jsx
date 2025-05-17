import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import UseUserStore from "../Store/UseUserStore";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "", // full name (nom complet)
    email: "",
    password: "",
    confirmPassword: "",
    role: "voyageur",
  });

  const { signup } = UseUserStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.role === "guide") {
      navigate("/complete-guide-profile", {
        state: { registrationData: formData },
      });
      return;
    }

    const result = await signup(formData);

    if (result.success) {
      alert("Inscription réussie !");
      navigate("/");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <Card className="w-96 p-6 border-red-300 border-1 shadow-2xl shadow-red-300">
        <CardContent>
          <h2 className="text-2xl font-semibold text-red-500 text-center mb-4">
            S'inscrire
          </h2>
          <form onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nom complet"
                className="hover:border-red-500"
              />
            </div>
            <div className="mt-3">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="E-mail"
                className="hover:border-red-500"
              />
            </div>
            <div className="mt-3">
              <Label htmlFor="role">Rôle</Label>
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full mt-1 p-2 shadow-xs rounded-md border hover:border-red-500"
              >
                <option value="voyageur">Voyageur</option>
                <option value="guide">Guide</option>
              </select>
            </div>
            <div className="mt-3 relative">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Mot de passe"
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
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirmer le mot de passe"
                  className="hover:border-red-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button
              className="w-full mt-4 bg-red-500 hover:bg-red-600"
              type="submit"
            >
              {formData.role === "guide" ? "Continuer" : "S'inscrire"}
            </Button>
          </form>
          <br />
          <div className="text-center">
            Vous avez déjà un compte ?
            <Link to="/login" className="underline text-red-500 ml-1">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
