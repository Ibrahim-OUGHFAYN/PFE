import React, { useState, useEffect } from "react";
import Search from "../components1/mySearch";
import Place from "../components1/Place";
import axios from "axios";

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [searchTerm,setSearchTerm]=useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/places")
      .then((res) => setPlaces(res.data))
      .catch((err) => console.error("Erreur lors de la récupération :", err));
  }, []);

  const filteredPlaces = places.filter((place) =>
    place.nom.toLowerCase().includes(searchTerm.toLowerCase()) || place.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="pt-[80px] w-[90%] mx-auto max-w-screen-xl">
      <div className="fixed top-[90px] left-0 right-0 z-40 flex justify-center">
        <Search ph="entrer le nom d'un ville" onSearch={setSearchTerm}/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-[200px] justify-items-center">
        {filteredPlaces.map((place) => (
          <Place key={place._id} {...place} />
        ))}
      </div>
    </div>
  );
};

export default Places;
