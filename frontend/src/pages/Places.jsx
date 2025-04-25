import React from "react";
import br from "../assets/brahim.jpg";
import ay from "../assets/ayoub.png";
import Guide from "../components1/guide";
import  Search  from "../components1/mySearch";

const guides = [
  {
    id: 1,
    name: "ibrahim oughfayn",
    img: br,
    city: "ouarzazate",
    languages: ["English", "Arabic", "French", "tamazight"],
  },
  {
    id: 2,
    name: "ayoub jabir",
    img: ay,
    city: "tinghir",
    languages: ["English", "Arabic", "French", "tamazight"],
  },
  {
    id: 3,
    name: "ibrahim oughfayn",
    img: br,
    city: "ouarzazate",
    languages: ["English", "Arabic", "French", "tamazight"],
  },
  
];

const Guides = () => {
  return (
    <div className="pt-[110px]"> 
      <div className="fixed top-[90px] left-0 right-0 z-40 flex justify-center">
        <Search ph="entrer le nom d'un ville"/>
      </div>

      <div className="flex flex-wrap justify-center mt-[170px] gap-6">
        {guides.map((guide) => (
          <Guide key={guide.id} {...guide} />
        ))}
      </div>
    </div>
  );
};

export default Guides;
