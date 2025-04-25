import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Place() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="w-80 border rounded-xl shadow-md">
      <CardContent className="p-4">
        <div className="h-40 bg-gray-200 mb-4 rounded-md"></div>

        <h2 className="text-lg font-semibold">Place El Amal</h2>
        <p className="text-sm text-gray-600">Un endroit calme et agréable</p>

        <Button 
          className="mt-4 w-full" 
        >
        </Button>

      </CardContent>
    </Card>
  );
}