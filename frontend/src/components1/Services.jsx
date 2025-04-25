import GI from "../assets/guidesimg.jpg";
import PI from "../assets/placesimg.jpg";
import {Link} from "react-router-dom"

const cardData = [
  {
    id: 1,
    title: "Explorer Maroc",
    description:
      "écouvrir les lieux touristiques du Maroc, c'est plonger dans une richesse culturelle et naturelle exceptionnelle. Des médinas historiques aux plages d'Agadir, chaque région offre une expérience unique.",
    imageUrl: PI,
  },
  {
    id: 2,
    title: "Trouver guide",
    description:
      "Explorez le Maroc autrement grâce à nos guides touristiques, riches en découvertes uniques, conseils pratiques et lieux incontournables, pour une expérience authentique et mémorable. Cliquez ici pour explorer.",
    imageUrl: GI,
  },
];

const Services = () => {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-10">
        <h2 className="text-2xl text-center font-bold text-red-900">
          nos services
        </h2>
      </div>

      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cardData.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            description={card.description}
            imageUrl={card.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

const Card = ({ title, description, imageUrl }) => {
  return (
    <div className="relative flex flex-col max-w-sm w-full rounded-xl bg-gradient-to-br from-white to-gray-50 text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mx-auto border">
      <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl shadow-lg">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h5 className="mb-2 text-lg sm:text-xl font-semibold text-gray-900 transition-colors duration-300">
          {title}
        </h5>
        <p className="text-sm sm:text-base font-light text-gray-700">
          {description}
        </p>
      </div>
      <div className="p-6 pt-0">
      <Link
  to="/Guides"
  className="group relative w-full inline-flex items-center justify-center px-6 py-3 sm:py-3.5 font-bold text-white rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/30 hover:shadow-red-500/40 transition-all duration-300 hover:-translate-y-0.5"
>          <span className="flex items-center gap-2">
            aller
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              className="w-5 h-5 transform transition-transform group-hover:translate-x-1"
            >
              <path
                d="M17 8l4 4m0 0l-4 4m4-4H3"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </span>
          </Link>
      </div>
    </div>
  );
};


export default Services;
