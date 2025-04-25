import React from "react";
import {
  FaWhatsappSquare,
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitterSquare,
} from "react-icons/fa";
import Logo from "./LogoComp";
import {Link} from "react-router-dom"

const Footer = () => {
  return (
    <div className="w-full bg-gray-900 py-5 px-10 grid md:grid-cols-2 gap-4 text-gray-300 bottom-0 mt-4 rounded-t-4xl">
      <div className="">
        <Logo />
        <p className="py-4">
          E-Guide est une plateforme indépendante qui facilite les échanges entre
          voyageurs et guides locaux, dans le respect de la culture et de l’environnement.
        </p>
        <div className="flex justify-start gap-10 md:w-[75%] my-6">
          <FaWhatsappSquare size={30} />
          <FaFacebookSquare size={30} />
          <FaInstagramSquare size={30} />
          <FaTwitterSquare size={30} />
        </div>
        <p className="text-sm text-gray-500 mt-4">
          © {new Date().getFullYear()} E-Guide. Tous droits réservés.
        </p>
      </div>
      <div className="flex md:justify-around justify-start">
        <div>
          <h6 className="font-bold text-red-500">Services</h6>
          <ul className="mt-2 font-light">
            <li className="py-2 text-sm"><Link to="/Places">Explorer Maroc</Link></li>
            <li className="py-2 text-sm"><Link to="/Guides">Trouver guide</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
