import React from "react";
import Info from "../components1/ProfileG_info";
import img from "../assets/brahim.jpg";
import Carousel from "../components1/carousel";
let Guide = {
  id: 1,
  nom: "ibrahym oughfayn",
  image: img,
  langues: ["tamazight", "arabic", "french", "anglais"],
  ville: "ouarzazate",
  aviss: [
    {
      id: 1,
      name: "ayoub",
      avis: "Un traitement très très agréable",
    },
    {
      id: 2,
      name: "ayoub",
      avis: "tres bon travaille",
    },
  ],
  exp: 3,
};

const ProfileGuide = () => {
  return (
    <div className="relative w-full flex gap-[20px] flex-col items-center flex-wrap justify-center">
      <div className="w-[90%] grow flex justify-center">
        <Info Guide={Guide} />
      </div>
      <div>
        <h1 className="text-red-800 font-bold">les aventures</h1>
      </div>
      <div className="w-[90%] grow flex justify-center">
        <Carousel></Carousel>
      </div>
    </div>
  );
};

export default ProfileGuide;
