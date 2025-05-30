import React, { useEffect, useState } from "react";
import UseUserStore from "../Store/UseUserStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loader from "../Loader";


const UserReservations = () => {
  const { reservations, fetchUserReservations } = UseUserStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReservations = async () => {
      setLoading(true);
      await fetchUserReservations();
      setLoading(false);
    };

    loadReservations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader />
      </div>
    );
  }

  if (!reservations || reservations.length === 0) {
    return (
      <div className="flex flex-col items-center p-4">
        <p className="text-gray-600 mb-4">Aucune réservation</p>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white"
          onClick={() => navigate("/guides")}
        >
          Explorer les guides
        </Button>
      </div>
    );
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmé':
        return 'bg-green-200 text-green-1000';
      case 'annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto mt-50 mb-50">
      <h2 className="text-xl font-semibold mb-4">Mes Réservations</h2>
      
      <div className="space-y-3">
        {reservations.map((reservation) => (
          <div key={reservation._id} className="bg-white rounded p-3 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">
                ID: {reservation._id}
              </div>
              <span className={`px-4 py-2 rounded-full text-xs font-medium ${getStatusBadge(reservation.status)}`}>
                {reservation.status}
              </span>
            </div>
            
            {reservation.dates && reservation.dates.length > 0 && (
              <div className="text-sm font-medium">
                {reservation.dates.map((date, index) => (
                  <div key={index}>
                    {formatDate(date)}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2 mt-2">
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 h-8"
                onClick={() => navigate(`/guides/${reservation.guideId._id}`)}
              >
                Voir guide
              </Button>
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 h-8"
                onClick={() => navigate(`/contactGuides/${reservation.guideId._id}`)}
              >
                contacter le guide
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReservations;