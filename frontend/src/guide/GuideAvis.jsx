import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AvisTable = () => {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvis = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/guides/avis', {
        withCredentials: true // Important for sending cookies with the request
      });
      setAvis(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching avis:', err);
      setError('Impossible de charger les avis. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvis();
  }, []);

  const handleDelete = async (avisId) => {
    try {
      await axios.delete(`http://localhost:5000/api/guides/avis/${avisId}`, {
        withCredentials: true
      });
      // Update the state to remove the deleted avis
      setAvis(avis.filter(item => item._id !== avisId));
    } catch (err) {
      console.error('Error deleting avis:', err);
      setError('Impossible de supprimer cet avis. Veuillez réessayer plus tard.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full rounded-md border p-1">
      <Table>
        <TableCaption>Liste des avis reçus</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Voyageur</TableHead>
            <TableHead className="w-full">Contenu</TableHead>
            <TableHead className="w-32">Date</TableHead>
            <TableHead className="w-16 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {avis.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                Aucun avis trouvé
              </TableCell>
            </TableRow>
          ) : (
            avis.map((item, index) => (
              <TableRow key={item._id || index} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.voyageurimg} alt={item.voyageurName} />
                      <AvatarFallback>{item.voyageurName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="truncate max-w-24">{item.voyageurName}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="truncate md:whitespace-normal">{item.text}</div>
                </TableCell>
                <TableCell>
                  {item.date ? format(new Date(item.date), 'dd MMM yyyy', { locale: fr }) : 'Date inconnue'}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. Cela supprimera définitivement cet avis.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AvisTable;