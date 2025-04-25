// components/ProfileCard.jsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Briefcase, MessageCircle } from "lucide-react";
import img from "../assets/ayoub.png";



export default function ProfileGuide({Guide}) {
  return (
    <Card className="relative w-full  max-w-6xl flex flex-col md:flex-row  max-w-4xl p-6 rounded-2xl border-red-500 gap-6 items-center mt-25">
      {/* img+inofs */}
      <div className="flex flex-col md:flex-row flex-1 items-start gap-4">
        {/* img */}
        <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto md:mx-0">
          <img
            src={img}
            alt={Guide.nom}
            className="rounded-full border-1 border-red-500"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 mt-2 mx-auto md:mx-0 items-center ">
          <h2 className="h-3 w-40 ml-0 font-bold">{Guide.nom}</h2>
          <h2 className="h-3 w-40 text-red-800">{Guide.ville}</h2>
          {/* Buttons */}
          <div className="flex gap-2 mt-3 flex-wrap ">
            <Button
              className="bg-red-500 border-red-500 border-1 hover:bg-red-200 cursor-pointer transition duration-200 hover:text-gray-700 rounded-sm"
              size="sm"
            >
              Contacter
            </Button>
            <Button
              className="bg-red-500 border-red-500 border-1 hover:bg-red-200 cursor-pointer transition duration-200 hover:text-gray-700 rounded-sm"
              size="sm"
            >
              Reserver
            </Button>
          </div>
        </div>
      </div>

      {/* Exp+nbr avis+langues */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-6">
        {/* loghat */}
        <div className="flex flex-col items-center">
          <Globe className="w-6 h-6 text-gray-600" />
          <span className="text-sm text-gray-700 mt-1 font-bold text-red-700">
            Langues
          </span>
          <div className="flex flex-wrap justify-center w-40">
            {Guide.langues.map((lang, key) => (
              <span key={key}>
                {lang}
                {key !== Guide.langues.length - 1 && ", "}
              </span>
            ))}
          </div>
        </div>

        {/* exp */}
        <div className="flex flex-col items-center justify-center">
          <Briefcase className="w-6 h-6 text-gray-600" />
          <span className="text-sm text-gray-700 mt-1 font-bold text-red-700">
            Guide Depuis
          </span>
          <span className="text-sm text-gray-700 mt-1">{Guide.exp} ans</span>
        </div>

        {/* avis */}
        <div className="flex flex-col items-center">
          <MessageCircle className="w-6 h-6 text-gray-600" />
          <span className="text-sm text-gray-700 mt-1 font-bold text-red-700">
            Avis
          </span>
          <span className="text-sm text-gray-700 mt-1">
            {Guide.aviss.length}
          </span>
        </div>
      </div>
    </Card>
  );
}
