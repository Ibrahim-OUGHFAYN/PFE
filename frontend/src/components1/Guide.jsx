import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import bg from "../assets/Gimg.png"; 
import {Link} from "react-router-dom"
// { id, name, img, city, languages = [] }

const Guide = ({ id, first_name, avatar, last_name }) => {
  return (
    <Card
      className="w-100 rounded-3xl border pt-2 pb-0 border-red-500 shadow-md bg-no-repeat bg-cover bg-right relative overflow-hidden"
      style={{
        transform: "scaleX(-1)",
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-right"
        style={{
          backgroundImage: `url(${bg})`,
          opacity: 0.2,
        }}
      ></div>

      <CardContent className="pt-6 pb-4 transform scale-x-[-1]">
        <div className="flex flex-col justify-center items-center text-center space-y-2">
          <img
            src={avatar}
            alt={name}
            className="w-40 h-40 rounded-full object-cover"
          />
          <h2 className="text-lg font-semibold">{first_name}</h2>
          <h3 className="text-red-500">{last_name}</h3>
          {/* <h4 className="text-sm text-gray-600">
            {languages.map((lang, key) => (
              <span key={key}>
                {lang}
                {key !== languages.length - 1 && ", "}
              </span>
            ))}
          </h4> */}
          <Link to="/Guides/Profile">
            <Button className="bg-red-400 mt-4 rounded-full mb-0 w-full h-10 hover:bg-red-500 transition">
              Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Guide;
