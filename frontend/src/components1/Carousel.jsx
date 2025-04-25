import React, { useRef, useEffect, useState } from 'react';
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import img5 from "../assets/img5.jpg";

const Carousel = () => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [img1, img2, img3, img4, img5];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const newIndex = Math.round(scrollLeft / containerWidth);
      setActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div id="carousel" className="relative w-full">
      {/* Scrollable image container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide gap-4 px-4"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="min-w-full flex-shrink-0 snap-center h-56 md:h-96 relative"
          >
            <img
              src={image}
              className="w-full h-full object-contain rounded-4xl"
              alt={`carousel-${index}`}
            />
          </div>
        ))}
      </div>

      {/* Bottom center indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black text-sm px-3 py-1 rounded-full shadow-md z-30 mb-2">
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default Carousel;
