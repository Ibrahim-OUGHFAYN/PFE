import { Card, CardContent } from "@/components/ui/card";
import br from "../assets/brahim.jpg";
import ay from "../assets/ayoub.png";

const guides = [
  {
    name: "Ibrahym OUGHFAYN",
    image: br,
  },
  {
    name: "Ayoub JABIR",
    image: ay,
  },
];

export default function Equipe() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {guides.map((guide, index) => (
        <Card
          key={index}
          className="rounded-2xl shadow-md border border-red-500 hover:border-2 transition duration-1000"
        >
          <CardContent className="flex flex-row items-center p-6">
            <img
              src={guide.image}
              alt={guide.name}
              className="w-20 h-20 rounded-full object-cover mr-4"
            />
            <div className="flex flex-col items-start">
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                {guide.name}
              </h2>
              <h3>
                Etudiant en BTS
              </h3>
              </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
