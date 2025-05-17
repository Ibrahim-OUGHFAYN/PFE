import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Briefcase, MessageCircle } from "lucide-react";
import Carousel from "../components1/Carousel";
import useUserStore from "../Store/UseUserStore";

function formatDateDDMMYYYY(date) {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const ProfileGuidePage = () => {
  const { user, fetchUser } = useUserStore();
  const { id } = useParams();

  const [guide, setGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    idvoyageur: "",
    idguide: "",
    text: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const guideRes = await axios.get(
          `http://localhost:5000/api/guides/${id}`
        );
        setGuide(guideRes.data);

        const reviewsRes = await axios.get(
          `http://localhost:5000/api/avis/${id}`
        );
        setReviews(reviewsRes.data);

        setFormData({
          idvoyageur: user._id,
          idguide: id,
          text: "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, user]);

  const handleReviewChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    try {
      setSubmitting(true);
      await axios.post("http://localhost:5000/api/avis/saveavis", formData);
      const reviewsRes = await axios.get(
        `http://localhost:5000/api/avis/${id}`
      );
      setReviews(reviewsRes.data);
      setFormData((prev) => ({ ...prev, text: "" }));
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 5);

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <h1 className="font-bold">vous devez vous connecter avec nous </h1>
        <br />
        <Link to="/Login">
          <Button className="bg-red-500 hover:bg-white border hover:border-red-500 hover:text-black">
            connectez-vous maintenant
          </Button>
        </Link>
      </div>
    );

  if (!guide)
    return (
      <div className="flex justify-center items-center h-screen">
        Guide not found
      </div>
    );

  return (
    <div className="flex flex-col items-center w-full px-4 pb-12 mt-25">
      <div className="w-4/5 max-w-screen-xl mx-auto space-y-12">
        {/* Guide Info */}
        <div className="w-full">
          <Card className="relative w-full flex flex-col md:flex-row p-6 rounded-2xl border-red-500 gap-6 items-center mt-8">
            <div className="flex flex-col md:flex-row flex-1 items-start gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto md:mx-0 overflow-hidden">
                <img
                  src={guide.imgUrl}
                  alt={guide.name}
                  className="rounded-full border border-red-500 w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-2 mt-2 mx-auto md:mx-0 items-center">
                <h2 className="h-3 w-40 ml-0 font-bold">{guide.name}</h2>
                <h2 className="h-3 w-40 text-red-800">{guide.ville}</h2>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Button
                    className="bg-red-500 hover:bg-red-400 rounded-sm"
                    size="sm"
                  >
                    Contacter
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-400 rounded-sm"
                    size="sm"
                  >
                    Réserver
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-6">
              <div className="flex flex-col items-center">
                <Globe className="w-6 h-6 text-gray-600" />
                <span className="text-sm text-red-700 mt-1 font-bold">
                  Langues
                </span>
                <div className="flex flex-wrap justify-center w-40">
                  {guide.Langues?.map((lang, key) => (
                    <span key={key}>
                      {lang}
                      {key !== guide.Langues.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <Briefcase className="w-6 h-6 text-gray-600" />
                <span className="text-sm mt-1 font-bold text-red-700">
                  Guide Depuis
                </span>
                <span className="text-sm text-gray-700 mt-1">
                  {guide.experience} ans
                </span>
              </div>
              <div className="flex flex-col items-center">
                <MessageCircle className="w-6 h-6 text-gray-600" />
                <span className="text-sm mt-1 font-bold text-red-700">
                  Avis
                </span>
                <span className="text-sm text-gray-700 mt-1">
                  {reviews.length}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Reviews Section */}
        <div className="w-full">
          <h1 className="text-2xl text-red-800 font-bold text-center mb-4">
            Les avis
          </h1>

          {reviews.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              Il n’y a aucun avis. Soyez le premier à laisser un avis !
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayedReviews.map((item) => (
                <Card
                  key={item._id || Math.random()}
                  className="rounded-2xl  border border-red-300"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-3">
                      <img
                        src={item.voyageurimg}
                        alt={item.voyageurName}
                        className="rounded-full w-10 h-10"
                      />
                      <h2 className="text-xl font-bold text-red-800 mb-2">
                        {item.voyageurName || "Anonyme"}
                      </h2>
                    </div>
                    <p>{item.text}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatDateDDMMYYYY(item.date)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {reviews.length > 5 && (
            <div className="flex justify-center">
              <Button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white"
              >
                {showAllReviews ? "Voir moins" : "Voir tout"}
              </Button>
            </div>
          )}

          {/* Review Form */}
          <div className="w-full flex justify-center mt-8">
            <form
              onSubmit={handleReviewSubmit}
              className="w-full bg-white p-6 rounded-xl border border-gray-200 space-y-4"
            >
              <h2 className="text-xl font-bold text-slate-800">
                Laisser un avis
              </h2>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleReviewChange}
                placeholder="Votre avis"
                className="w-full border p-2 rounded-md"
                required
                rows={4}
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {submitting ? "Envoi..." : "Envoyer"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="w-full">
        <h1 className="text-2xl text-red-800 font-bold text-center mb-4">
          Les aventures
        </h1>
        <div className="w-full bg-gray-100 h-100 rounded-xl flex items-center justify-center text-gray-500">
          <Carousel />
        </div>
      </div>
    </div>
  );
};

export default ProfileGuidePage;
