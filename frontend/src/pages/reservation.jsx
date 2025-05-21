import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Reservation = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [filteredAvailabilities, setFilteredAvailabilities] = useState([]);
  const [selectedDatesMap, setSelectedDatesMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationError, setReservationError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [validationError, setValidationError] = useState(null);

  // Get params from URL
  const params = useParams();
  console.log("All URL params:", params);

  // Get guideId from params
  const guideId =
    params.id ||
    params.guideId ||
    window.location.pathname.split("/").pop() ||
    "";

  console.log("Using guideId:", guideId);

  // Extract month and year from date
  const getMonthYear = (dateString) => {
    const date = new Date(dateString);
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      label: date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
    };
  };

  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!guideId || guideId === "undefined") {
        setError("Invalid Guide ID. Please check the URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fixed URL - check if this matches your API's actual endpoint structure
        const response = await axios.get(
          `http://localhost:5000/api/guides/despopourvoyageurs/${guideId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response data:", response.data);

        // Handle the specific response structure with disponibilites array
        if (response.data && response.data.disponibilites) {
          const availabilitiesData = response.data.disponibilites;
          setAvailabilities(availabilitiesData);
          setFilteredAvailabilities(availabilitiesData);

          // Extract unique months from availabilities
          const months = {};
          availabilitiesData.forEach((date) => {
            const { month, year, label } = getMonthYear(date);
            const key = `${year}-${month}`;
            months[key] = label;
          });

          // Convert to array and sort chronologically
          const monthsArray = Object.entries(months).map(([key, label]) => {
            const [year, month] = key.split('-').map(Number);
            return { key, label, year, month };
          });
          
          monthsArray.sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.month - b.month;
          });
          
          setAvailableMonths(monthsArray);
        } else {
          setAvailabilities([]);
          setFilteredAvailabilities([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("API Error details:", err);

        // Provide more helpful error message based on the error
        let errorMessage = `Error: ${err.message}`;

        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = "Authentication required. Please log in first.";
          } else if (err.response.status === 403) {
            errorMessage =
              "You don't have permission to access this guide's availability.";
          } else if (err.response.status === 404) {
            errorMessage =
              "The guide's availability information was not found. Check if the API endpoint is correct.";
          }

          console.log("Error response data:", err.response.data);
        } else if (err.request) {
          errorMessage =
            "No response from server. Please check if the API is running.";
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, [guideId]);

  // Filter availabilities by selected month
  useEffect(() => {
    if (selectedMonth === "all") {
      setFilteredAvailabilities(availabilities);
      return;
    }

    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    const filtered = availabilities.filter((date) => {
      const dateObj = new Date(date);
      return dateObj.getFullYear() === year && dateObj.getMonth() === month;
    });

    setFilteredAvailabilities(filtered);
  }, [selectedMonth, availabilities]);

  // Check if selecting this date would create 5 consecutive days
  const wouldCreateConsecutiveDays = (dateStr) => {
    // Convert all selected dates to Date objects for comparison
    const selectedDates = Array.from(selectedDatesMap.keys()).map(d => new Date(d));
    
    // Add the new date
    const newDate = new Date(dateStr);
    const allDates = [...selectedDates, newDate];
    
    // Sort dates chronologically
    allDates.sort((a, b) => a - b);
    
    // Check for consecutive sequences
    let consecutiveCount = 1;
    let maxConsecutive = 1;
    
    for (let i = 1; i < allDates.length; i++) {
      const prevDay = allDates[i-1].getDate();
      const prevMonth = allDates[i-1].getMonth();
      const prevYear = allDates[i-1].getFullYear();
      
      const currDay = allDates[i].getDate();
      const currMonth = allDates[i].getMonth();
      const currYear = allDates[i].getFullYear();
      
      // Check if this is the next day (accounting for month boundaries)
      const prevDate = new Date(prevYear, prevMonth, prevDay + 1);
      if (prevDate.getDate() === currDay && 
          prevDate.getMonth() === currMonth && 
          prevDate.getFullYear() === currYear) {
        consecutiveCount++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
      } else {
        consecutiveCount = 1;
      }
    }
    
    return maxConsecutive >= 5;
  };

  const toggleSelection = (dateStr) => {
    const newSelectedDates = new Map(selectedDatesMap);
    
    if (newSelectedDates.has(dateStr)) {
      // If already selected, just remove it
      newSelectedDates.delete(dateStr);
      setValidationError(null);
    } else {
      // Check if adding this date would create 5 consecutive days
      if (wouldCreateConsecutiveDays(dateStr)) {
        setValidationError("Impossible de sélectionner 5 jours consécutifs (comme 30, 31, 1, 2, 3)");
        return;
      }
      
      // Otherwise add it
      newSelectedDates.set(dateStr, true);
    }
    
    setSelectedDatesMap(newSelectedDates);
  };

  // Format ISO date string to a more readable format
  const formatDate = (isoDateString) => {
    try {
      const date = new Date(isoDateString);
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return date.toLocaleDateString("fr-FR", options);
    } catch (error) {
      console.error("Date formatting error:", error);
      return isoDateString; // Return the original string if formatting fails
    }
  };

  // Get the selected dates array
  const getSelectedDates = () => {
    return Array.from(selectedDatesMap.keys());
  };

  // Handle reservation submission
  const handleReservation = async () => {
    const selectedDates = getSelectedDates();

    if (selectedDates.length === 0) {
      setReservationError(
        "Please select at least one date for your reservation."
      );
      return;
    }

    setReservationLoading(true);
    setReservationError(null);
    setReservationSuccess(false);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/reservations/add",
        {
          guideId,
          dates: selectedDates,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Reservation response:", response.data);
      setReservationSuccess(true);

      // Reset selected dates after successful reservation
      setSelectedDatesMap(new Map());
    } catch (err) {
      console.error("Reservation error:", err);

      let errorMessage = "Failed to make reservation. Please try again.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Authentication required. Please log in first.";
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }

      setReservationError(errorMessage);
    } finally {
      setReservationLoading(false);
    }
  };

  return (
    <div className="flex flex-col mt-30 mb-30">
      <div className="container mx-auto py-12 px-4 sm:px-6 flex-grow">
        <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 ">
          <h2 className="text-2xl font-bold mb-6 text-center">Disponibilités du guide</h2>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="text-gray-600">Chargement des disponibilités...</div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                {error}
                <p className="mt-2 text-sm">
                  Debug info: guideId = {guideId || "not found"}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {!loading && !error && (
            <>
              {availabilities.length > 0 ? (
                <div className="space-y-6">
                  {/* Month filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Filtrer par mois</label>
                    <Select
                      value={selectedMonth}
                      onValueChange={setSelectedMonth}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez un mois" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les mois</SelectItem>
                        {availableMonths.map((monthData) => (
                          <SelectItem key={monthData.key} value={monthData.key}>
                            {monthData.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected dates counter and viewer button */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Sélectionnez vos dates</h3>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={selectedDatesMap.size === 0}
                        >
                          Voir dates sélectionnées ({selectedDatesMap.size})
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Dates sélectionnées</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 mt-4">
                          {selectedDatesMap.size > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {Array.from(selectedDatesMap.keys()).map((date, index) => (
                                <Badge key={index} className="bg-red-500 text-primary-foreground px-3 py-1">
                                  {formatDate(date)}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center">Aucune date sélectionnée</p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {validationError && (
                    <Alert variant="destructive">
                      <AlertTitle>Erreur de validation</AlertTitle>
                      <AlertDescription>{validationError}</AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <div className="flex flex-wrap gap-2">
                      {filteredAvailabilities.map((availability, index) => (
                        <Badge
                          key={index}
                          variant={
                            selectedDatesMap.has(availability) ? "default" : "outline"
                          }
                          className={`px-3 py-1 cursor-pointer hover:opacity-90 transition-all ${
                            selectedDatesMap.has(availability)
                              ? "bg-red-500 text-primary-foreground"
                              : "bg-background"
                          }`}
                          onClick={() => toggleSelection(availability)}
                        >
                          {formatDate(availability)}
                        </Badge>
                      ))}
                    </div>

                    {filteredAvailabilities.length === 0 && (
                      <p className="text-gray-500 mt-4 text-center">Aucune disponibilité pour le mois sélectionné</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button
                      className="w-full"
                      onClick={handleReservation}
                      disabled={
                        selectedDatesMap.size === 0 || reservationLoading
                      }
                    >
                      {reservationLoading ? "Traitement en cours..." : "Réserver"}
                    </Button>

                    {reservationSuccess && (
                      <Alert className="mt-4">
                        <AlertTitle>Succès!</AlertTitle>
                        <AlertDescription>
                          Votre réservation a été effectuée avec succès.
                        </AlertDescription>
                      </Alert>
                    )}

                    {reservationError && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Échec de la réservation</AlertTitle>
                        <AlertDescription>{reservationError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ) : (
                <Alert variant="warning">
                  <AlertTitle>Aucune disponibilité</AlertTitle>
                  <AlertDescription>
                    Aucune disponibilité trouvée pour le guide ID: {guideId}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservation;