import React from "react";
import img from "../assets/HeroImg.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
      <div className="md:px-36 px-8 md:py-28 py-5 pt-30 mt-15">
        <div className="flex lg:flex-row flex-col grid-cols-2 gap-10">
          {/* ns*/}
          <div className="flex flex-col gap-5 justify-center p-2 lg:-translate-x-16">
            <h1 className="text-4xl md:text-5xl font-bold">Explorez</h1>
            <h1 className="text-4xl md:text-5xl font-bold">
              les merveilles du
            </h1>
            <h1 className="text-4xl md:text-6xl font-bold text-red-500">
              Maroc
            </h1>
            <p className="mt-4">
              Partez à la découverte du Maroc, accompagné de nos guides locaux,
              et plongez dans un voyage fascinant à travers ses paysages variés,
              ses villes historiques, et ses coutumes authentiques, pour une
              expérience unique et enrichissante.
            </p>
            <Link to="/Places" className="w-full h-full block">
              <button className="bg-red-500 text-white w-1/2 py-3 rounded-full hover:bg-red-300 hover:text-red-800 font-bold mt-3 transition duration-200 shadow-2xl shadow-red-300 cursor-pointer">
                Explorer
              </button>
            </Link>
          </div>
          {/*l'image*/}
          <div className="lg:translate-x-16">
            <img
              src={img}
              alt="heroimg"
              className="rounded-2xl h-[100%] w-full object-cover "
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
