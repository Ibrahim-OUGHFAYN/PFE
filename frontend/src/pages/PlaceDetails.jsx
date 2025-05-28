import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Camera, Star, Navigation, ArrowLeft } from 'lucide-react';

const PlaceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Récupérer les données depuis state
  const place = location.state?.place;

  // États pour la gestion des images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Navigation entre les images
  const nextImage = () => {
    if (place?.images && place.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === place.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (place?.images && place.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? place.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const goBack = () => {
    navigate('/places'); // Ou navigate(-1) pour retourner à la page précédente
  };

  // Si pas de données, rediriger ou afficher erreur
  if (!place) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-20">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Aucune donnée de lieu trouvée</p>
          <button 
            onClick={goBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux lieux
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-18">
      {/* Header */}
      <div className="">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={goBack}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Retour aux lieux"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 capitalize">
                  {place.nom}
                </h1>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section Images et Carte */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Images */}
            <div className="bg-white rounded-xl border overflow-hidden">
              {/* Image principale */}
              <div className="relative h-96 bg-gray-200">
                {place.images && place.images.length > 0 && !imageError ? (
                  <img
                    src={place.images[currentImageIndex]}
                    alt={`${place.nom} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">
                        {place.images && place.images.length > 0 
                          ? "Image non disponible" 
                          : "Aucune image disponible"
                        }
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Navigation des images (si plus d'une image) */}
                {place.images && place.images.length > 1 && !imageError && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      →
                    </button>
                    
                    {/* Indicateur d'image */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                      <span className="text-white text-sm">
                        {currentImageIndex + 1} / {place.images.length}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Miniatures (si plus d'une image) */}
              {place.images && place.images.length > 1 && (
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {place.images.slice(0, 30).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index 
                            ? 'border-red-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Miniature ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  {place.images.length > 30 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Et {place.images.length - 30} autres images...
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Carte */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Navigation className="w-5 h-5 mr-2" />
                Carte
              </h2>
              <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.longitude-0.01},${place.latitude-0.01},${place.longitude+0.01},${place.latitude+0.01}&layer=mapnik&marker=${place.latitude},${place.longitude}`}
                  width="100%"
                  height="100%"
                  className="border-0"
                  title={`Carte de ${place.nom}`}
                />
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>Coordonnées: {place.latitude}, {place.longitude}</p>
              </div>
            </div>
          </div>

          {/* Informations du lieu */}
          <div className="space-y-6">
            
            {/* Description */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {place.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;