import React, { useEffect, useState } from "react";
import axios from "axios";
import Guide from "../components1/guide";
import SearchG from "../components1/mySearch";

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    axios.get("http://localhost:5000/api/guides")
      .then(response => {
        setGuides(response.data);
      })
      .catch(error => {
        console.error("Failed to fetch guides:", error);
      });
  }, []);

  const filteredGuides = guides.filter((guide) =>
    `${guide.name}`.toLowerCase().includes(searchTerm.toLowerCase())||
    `${guide.ville}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-[110px]">
      <div className="fixed top-[90px] left-0 right-0 z-40 flex justify-center">
        <SearchG ph="entrer le nom de guide ou le nom d'un ville" onSearch={setSearchTerm}/>
      </div>

      <div className="flex flex-wrap justify-center mt-[170px] gap-6">
        {filteredGuides.map((guide) => (
          <Guide key={guide._id} {...guide} />
        ))}
      </div>
    </div>
  );
};

export default Guides;
