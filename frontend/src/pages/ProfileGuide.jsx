import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Info from "../components1/ProfileG_info";
import Carousel from "../components1/carousel";

const ProfileGuide = () => {
  const { id } = useParams(); // Get guide ID from URL
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/guides/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGuide(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch guide by ID:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!guide) return <div>Guide not found</div>;

  return (
    <div className="relative w-full flex gap-[20px] flex-col items-center flex-wrap justify-center">
      <div className="w-[90%] grow flex justify-center">
        <Info Guide={guide} />
      </div>
      <div>
        <h1 className="text-red-800 font-bold">les aventures</h1>
      </div>
      <div className="w-[90%] grow flex justify-center">
        <Carousel />
      </div>
    </div>
  );
};

export default ProfileGuide;
