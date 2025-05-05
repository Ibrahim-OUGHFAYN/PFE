import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Place({ _id, nom, description, images }) {
  return (
    <Card className="w-full max-w-xs border rounded-xl shadow-md flex flex-col justify-center border-red-200 hover:shadow-2xl hover:shadow-red-300 transition duration-200">
      <CardContent>
        <div className="h-40 bg-gray-200  rounded-md">
          <img src={images[0]} alt={nom} className="w-full h-full rounded-md" />
        </div>

        <h2 className="text-lg font-semibold break-words line-clamp-2">{nom}</h2>
        <p className="text-sm text-gray-500 break-words line-clamp-2">{description}</p>

        <Button className="mt-4 w-full">detailes</Button>
      </CardContent>
    </Card>
  );
}
