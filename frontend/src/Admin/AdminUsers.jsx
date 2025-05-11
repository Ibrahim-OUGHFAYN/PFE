import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import HeaderAdmin from "./HomeAdmin";
import { Button } from "@/components/ui/button";

const title = "Gérer utilisateurs";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Erreur lors de la récupération :", err));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/delete/${id}`);
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
      {/* Contenu principal */}
      <div className="flex flex-col justify-around items-center">
        <div className="mt-4 flex flex-col gap-6 w-[90%]">
          {/* Search and Select */}
          <div className="flex gap-6 mb-4 items-center">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom ou email"
                className="ps-10 h-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Select role */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="pt-2 ps-3 text-sm text-gray-900 border border-gray-300 rounded-lg h-[38px] bg-gray-50"
            >
              <option value="all">Tous les rôles</option>
              <option value="voyageur">Voyageurs</option>
              <option value="guide">Guides</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="min-w-full table-auto w-full">
              <thead className="bg-red-100">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    profile
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    nom d'utilisateur
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    Role
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
                      <img
                        src={user.imgUrl}
                        alt="place image"
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <Button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-700 mr-2 bg-white border border-red-500 hover:bg-red-400 hover:text-black"
                      >
                        supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      Aucun utilisateur trouvé
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
