import React from "react";
import img from "../assets/AboutImg.png";
import Equipe from "./Equipe";

const Hero = () => {
  return (
    <>
      <div className="md:px-36 px-8 md:py-10 py-0">
        <div className="mb-10">
          <h2 className="text-2xl text-center font-bold text-red-900">
            À propos de nous
          </h2>
        </div>
        <div className="flex lg:flex-row flex-col grid-cols-2 gap-4">
          {/* Image lysr */}
          <div className="lg:-translate-x-16">
            <img
              src={img}
              alt="heroimg"
              className="rounded-2xl h-[100%] w-full object-cover"
            />
          </div>
          {/* Text lymn */}
          <div className="flex flex-col gap-5  p-2 ">
            <p className="mt-4">
              E-Guide est une plateforme web que nous avons <br/>
              créée pour faciliter les rencontres entre voyageurs et guides
              touristiques.<br/> Nous sommes Ibrahym Oughfayn et Ayoub Jabir, deux
              étudiants passionnés par le développement web et le voyage.<br/> Avec
              E-Guide, les voyageurs peuvent découvrir des lieux touristiques,
              réserver un guide, et discuter avec lui en temps réel.<br/> Les guides,
              de leur côté, peuvent gérer leur profil et leurs disponibilités
              facilement. Ce projet est né de notre envie de proposer une
              solution simple, efficace et humaine pour vivre le tourisme
              autrement.
              Débutez votre aventure avec E-Guide, la plateforme qui rapproche voyageurs et guides passionnés.<br/> Avec nous, chaque voyage devient une expérience authentique et sur-mesure.
            </p>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl text-center font-bold text-red-900 mt-5">
            Equipe
          </h2>
        </div>
        <Equipe></Equipe>
      </div>
    </>
  );
};

export default Hero;
