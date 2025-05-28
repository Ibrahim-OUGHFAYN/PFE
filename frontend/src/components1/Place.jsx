import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Place({
  _id,
  nom,
  description,
  images,
  latitude,
  longitude,
}) {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    // Passer toutes les données du lieu via state
    const placeData = {
      _id,
      nom,
      description,
      images,
      latitude,
      longitude,
    };

    navigate(`/Places/${_id}`, {
      state: { place: placeData },
    });
  };

  return (
    <Card className="w-full border rounded-xl shadow-none flex flex-col justify-center border-red-200 transition duration-200">
      <CardContent>
        {/* Container avec overflow hidden pour l'animation */}
        <div
          className="h-40 w-full bg-gray-200 rounded-md overflow-hidden"
          onClick={handleDetailsClick}
        >
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={nom}
              className="w-full h-full rounded-md object-cover transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : (
            <div className="w-full h-full rounded-md bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Pas d'image</span>
            </div>
          )}
        </div>

        <h2 className="text-lg font-semibold break-words line-clamp-2">
          {nom}
        </h2>
        <p className="text-sm text-gray-500 break-words line-clamp-2">
          {description}
        </p>

        <Button className="mt-4 w-full" onClick={handleDetailsClick}>
          Détails
        </Button>
      </CardContent>
    </Card>
  );
}