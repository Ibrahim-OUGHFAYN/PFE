import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Plus } from "lucide-react";
import HeaderAdmin from "./HeaderAdmin";
import { Button } from "@/components/ui/button";
import {useNavigate} from "react-router-dom"



const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/Admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Erreur lors de la récupération :", err));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/Admin/users/delete/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("La suppression a échoué.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRole === "all" || user.role === selectedRole;
    return matchSearch && matchRole;
  });

  return (
    <>
      <HeaderAdmin name="Gérer les lieux"/>

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
                className="ps-10 h-10 text-sm text-gray-900  rounded-lg w-full border-3 border-gray-300 bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Bouton Ajouter */}
            <Button
              onClick={() => navigate("/Admin/Places/AddPlace")}
              className="text-white bg-red-500  border-3 border-red-300 shadow-lg hover:bg-red-200 ml-4 hover:text-black w-[20%] h-10 rounded-lg"
            >
              <Plus className="mr-2" />
              Ajouter lieu
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
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
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="bg-white border-b">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      <Button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-700 mr-2 bg-white border border-red-500 hover:bg-red-400 hover:text-black"
                      >
                        supprimer
                      </Button>
                      <Button className="text-red-700 mr-2 bg-white border border-red-500 hover:bg-red-400 hover:text-black">
                        modifier
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      Aucun Lieu trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
