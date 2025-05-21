import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const GuideReservationsList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/guides/reservations', {
          withCredentials: true,
        });
        setReservations(res.data);
      } catch (err) {
        console.error('Erreur chargement:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReject = (res) => {
    setSelectedReservation(res);
    setDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedReservation) return;
    try {
      await axios.put(
        `http://localhost:5000/api/reservations/${selectedReservation._id}/status`,
        { status: 'annulé' },
        { withCredentials: true }
      );
      setReservations((prev) =>
        prev.map((r) =>
          r._id === selectedReservation._id ? { ...r, status: 'annulé' } : r
        )
      );
    } catch (err) {
      console.error('Erreur annulation:', err);
    } finally {
      setDialogOpen(false);
      setSelectedReservation(null);
    }
  };

  const handleAccept = async (res) => {
    try {
      await axios.put(
        `http://localhost:5000/api/reservations/${res._id}/status`,
        { status: 'confirmé' },
        { withCredentials: true }
      );
      setReservations((prev) =>
        prev.map((r) => (r._id === res._id ? { ...r, status: 'confirmé' } : r))
      );
    } catch (err) {
      console.error('Erreur confirmation:', err);
    }
  };

  const filteredReservations = reservations.filter((res) => {
    if (searchTerm === '') return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (res._id && res._id.toLowerCase().includes(searchLower)) ||
      (res.dates && res.dates.some(date => date.toLowerCase().includes(searchLower))) ||
      (res.userId?.name && res.userId.name.toLowerCase().includes(searchLower)) ||
      (res.status && res.status.toLowerCase().includes(searchLower))
    );
  });

  if (loading) return <p className="p-4">Chargement...</p>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Mes Réservations</h2>

      {/* Search Input */}
      <div className="w-full">
        <input
          type="text"
          placeholder="Rechercher par ID, dates, voyageur ou statut..."
          className="w-full p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* No global dates display here - will show per reservation */}

      {filteredReservations.length === 0 && (
        <p className="text-muted-foreground">Aucune réservation trouvée.</p>
      )}

      {filteredReservations.map((res) => (
        <div
          key={res._id}
          className="border rounded-lg p-4 space-y-2 bg-white shadow-sm"
        >
          <p><span className="font-medium">ID:</span> {res._id}</p>
          <p><span className="font-medium">Dates:(anne-mois-jour)</span></p>
          <div className="flex flex-wrap gap-2 mt-2 mb-2">
            {res.dates?.map((date, index) => {
              // Format date to YYYY-MM-DD
              let formattedDate = date;
              try {
                // Try to parse the date and format it
                const dateObj = new Date(date);
                if (!isNaN(dateObj.getTime())) {
                  formattedDate = dateObj.toISOString().split('T')[0]; // Gets YYYY-MM-DD
                }
              } catch (error) {
                // If parsing fails, keep the original format
                console.error('Error formatting date:', error);
              }
              
              return (
                <div key={index} className="bg-red-100 rounded-md px-3 py-2 text-red-800">
                  {formattedDate}
                </div>
              );
            })}
          </div>
          <p><span className="font-medium">Voyageur:</span> {res.userId?.name || 'Inconnu'}</p>
          <p><span className="font-medium">Statut:</span> {res.status}</p>

          {res.status === 'en_attente' && (
            <div className="flex gap-2 mt-2">
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50" onClick={() => handleReject(res)}>
                Annuler
              </Button>
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50" onClick={() => handleAccept(res)}>
                Confirmer
              </Button>
            </div>
          )}
        </div>
      ))}

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation d'annulation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action libérera les dates réservées et informera le voyageur.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReject} className="bg-red-500 hover:bg-red-600">
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default GuideReservationsList;