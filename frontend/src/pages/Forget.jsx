import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';



export default function Forget(){
  const Navigate=useNavigate();
  
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-transparent space-y-6">
      <Card className="w-96 shadow-lg border-red-300 border-1 shadow-2xl shadow-red-300">
        <CardHeader>
          <CardTitle className="text-center">Mot de passe oublié</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="otp">Code de vérification</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Entrez le code envoyé a votre E-mail"
                className="hover:border-red-500"
                aria-label="Username"
              />
            </div>  
            <Button
              className="w-full bg-red-500 hover:bg-red-300"
           >
              <Link to="/Forget/Reset">Submit</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
