import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

import useUserStore from "../Store/UseUserStore";

export default function DisponibilitesGuide() {
  const { user, setUser } = useUserStore();
  const disponibilites = user?.disponibilites || [];

  // state pour plusieurs dates sélectionnées
  const [dates, setDates] = useState([]); // tableau de Date

  // formater une date en string YYYY-MM-DD
  const formatDate = (date) => format(date, "yyyy-MM-dd");

  // formater pour affichage
  const formatDisplayDate = (date) =>
    format(date, "d MMMM yyyy", { locale: fr });

  // Fonction pour désactiver les dates avant aujourd'hui
  const disablePastDates = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Début de la journée
    return date < today;
  };

  const ajouterDisponibilites = async () => {
    if (dates.length === 0) {
      return toast.error("Veuillez choisir au moins une date");
    }

    // Transformer en string format YYYY-MM-DD et filtrer les doublons déjà présents
    const newDates = dates
      .map(formatDate)
      .filter((d) => !disponibilites.includes(d));

    if (newDates.length === 0) {
      return toast.error("Ces dates sont déjà ajoutées");
    }

    const updated = [...disponibilites, ...newDates];

    try {
      await axios.put(
        "http://localhost:5000/api/guides/despo",
        { disponibilites: updated },
        { withCredentials: true }
      );

      setUser({ ...user, disponibilites: updated });
      setDates([]);
      toast.success("Disponibilités ajoutées !");
    } catch (error) {
      console.error("Erreur d'ajout :", error);
      toast.error("Échec de l'ajout des disponibilités");
    }
  };

  // Supprimer une date de la sélection temporaire
  const removeDateFromSelection = (dateToRemove) => {
    setDates(dates.filter((date) => date.getTime() !== dateToRemove.getTime()));
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[85%]">
        <h2 className="text-2xl font-bold text-gray-800">
          Gerer Disponibilités
        </h2>

        <Card className="bg-white shadow-none border-none ">
          <CardContent className="p-4 space-y-4">
            <div>
              <div className="flex space-x-2 items-center">
                {/* Calendrier en mode multiple */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full h-20 cursor-pointer justify-start text-left font-medium ${
                        dates.length === 0 ? "text-gray-500" : "text-gray-800"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5 text-gray-600" />
                      {dates.length === 0
                        ? "Choisir une ou plusieurs dates"
                        : `${dates.length} date${
                            dates.length > 1 ? "s" : ""
                          } sélectionnée${dates.length > 1 ? "s" : ""}`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="multiple"
                      selected={dates}
                      onSelect={setDates}
                      initialFocus
                      locale={fr}
                      className="rounded-md border"
                      disabled={disablePastDates} // Désactive les dates avant aujourd'hui
                      fromDate={new Date()} // Optionnel: empêche également la navigation vers les mois passés
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Affichage des dates sélectionnées */}
            {dates.length > 0 && (
              <div className="flex flex-col gap-2">
              <div className=" p-3 rounded-md border">
                <p className="text-sm text-gray-600 mb-2">
                  Dates sélectionnées:
                </p>
                <div className="flex flex-wrap gap-2">
                  {dates.map((date, idx) => (
                    <Badge
                      key={idx}
                      className="py-2 pl-3 pr-1 border-1 border-black bg-white text-gray-700 flex items-center gap-1"
                    >
                      {formatDisplayDate(date)}
                      <button
                        onClick={() => removeDateFromSelection(date)}
                        className="ml-1 bg-red-300  hover:bg-red-200 rounded-full h-5 w-5 inline-flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
               
              </div>
               <Button
                  onClick={ajouterDisponibilites}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={dates.length === 0}
                >
                  Ajouter
                </Button>
                </div>
            )}
          </CardContent>
        </Card>

        <div className="bg-white p-5 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Liste des disponibilités
          </h3>
          {disponibilites.length === 0 ? (
            <p className="text-gray-500 italic">
              Aucune disponibilité définie.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {disponibilites.map((dateStr, idx) => (
                <Badge
                  key={idx}
                  className="py-2 px-5 bg-red-100 text-red-800 hover:bg-red-200 cursor-default"
                >
                  {format(new Date(dateStr), "d MMMM yyyy", { locale: fr })}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}