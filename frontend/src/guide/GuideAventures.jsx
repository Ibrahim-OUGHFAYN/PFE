import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Plus, Loader } from "lucide-react"; 
import HeaderAdmin from "./HeaderAdmin";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // State places
  const [deleteLoading, setDeleteLoading] = useState(false); // State deletion

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/places")
      .then((res) => {
        setPlaces(res.data);
        setLoading(false); 
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération :", err);
        setLoading(false); 
      });
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet lieu ?"
    );
    if (!confirmDelete) return;

    setDeleteLoading(true); // Start loading when delete is initiated

    try {
      await axios.delete(`http://localhost:5000/api/places/delete/${id}`);
      setPlaces(places.filter((place) => place._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("La suppression a échoué.");
    } finally {
      setDeleteLoading(false); // Stop loading when delete is done
    }
  };

  const filteredPlaces = places.filter((place) => {
    const matchSearch = place.nom
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <>
      <HeaderAdmin name="Gérer les lieux" />

      {/* Contenu principal */}
      <div className="flex flex-col justify-around items-center">
        <div className="mt-4 flex flex-col gap-6 w-[90%]">
          {/* Search and Button */}
          <div className="flex justify-between items-center w-full mb-4">
            {/* Champ de recherche */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher Lieu par nom"
                className="ps-10 h-10 text-sm text-gray-900 rounded-lg w-full border-3 border-gray-300 bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Bouton Ajouter */}
            <Button
              onClick={() => navigate("/Admin/Places/AddPlace")}
              className="text-white bg-cyan-500 border-3 border-gray-300 shadow-lg hover:bg-cyan-200 ml-4 hover:text-black w-[20%] h-10 rounded-lg"
            >
              <Plus className="mr-2" />
              Ajouter lieu
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            {loading ? (
              <div className="flex justify-center items-center py-4">
                <Loader className="w-8 h-8 text-gray-500 animate-spin" />
              </div>
            ) : (
              <table className="min-w-full table-auto w-full">
                <thead className="bg-red-100">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      image
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      nom de lieu
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlaces.map((place) => (
                    <tr key={place._id} className="bg-white border-b">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <img
                          src={place.images[0]}
                          alt="place image"
                          className="w-40 h-30 rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 truncate max-w-xs">
                        {place.nom.length > 15
                          ? `${place.nom.slice(0, 15)}...`
                          : place.nom}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {deleteLoading ? (
                          <Loader className="w-4 h-4 text-gray-500 animate-spin" />
                        ) : (
                          <>
                            <Button
                              onClick={() => handleDelete(place._id)}
                              className="text-red-700 mr-2 bg-white border border-red-500 hover:bg-red-400 hover:text-black"
                            >
                              supprimer
                            </Button>
                            <Button className="text-red-700 mr-2 bg-white border border-red-500 hover:bg-red-400 hover:text-black">
                              modifier
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredPlaces.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        Aucun Lieu trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
