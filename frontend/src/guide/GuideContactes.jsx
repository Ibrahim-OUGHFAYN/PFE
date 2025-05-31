import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VoyageursContactesParGuide = () => {
  const [voyageurs, setVoyageurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/allvoyageurs", { withCredentials: true })
      .then((res) => {
        setVoyageurs(res.data.data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des voyageurs :", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  if (voyageurs.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Aucun voyageur contacté.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Voyageurs contactés</h1>

      <div className="divide-y border rounded-md overflow-hidden border-gray-200">
        {voyageurs.map((voyageur) => (
          <button
            key={voyageur._id}
            onClick={() => navigate(`/Guide/messagrie/${voyageur._id}`)}
            className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-4 cursor-pointer"
          >
            <img
              src={voyageur.imgUrl || "/default-profile.png"}
              alt={voyageur.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-lg">{voyageur.name}</p>
              <p className="text-sm text-gray-500">{voyageur.ville}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VoyageursContactesParGuide;
