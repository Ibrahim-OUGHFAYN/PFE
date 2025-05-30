import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";

const GuidesContactList = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/allguides", { withCredentials: true })
      .then((res) => {
        setGuides(res.data.data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des guides :", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10 mt-24 mb-24 min-h-screen">Chargement...</div>;
  }

  if (guides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <p className="text-gray-500 mb-4">Aucun guide contacté.</p>
        <Button
          onClick={() => navigate("/guides")}
          className="bg-red-500 hover:bg-red-400"
        >
          Voir tout les guides
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-48 mb-48 px-4 min-h-screen">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {guides.map((guide) => (
          <div
            key={guide._id}
            onClick={() => navigate(`/contactGuides/${guide._id}`)}
            className="flex items-center gap-4 px-4 py-3 border-b last:border-none hover:bg-gray-50 cursor-pointer transition"
          >
            <img
              src={guide.imgUrl || "/default-profile.png"}
              alt={guide.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{guide.name}</p>
              <p className="text-sm text-gray-500">{guide.ville}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuidesContactList;
