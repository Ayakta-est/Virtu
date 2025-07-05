import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type CarouselItem = {
  id: string;
  title: string;
  image: string;
  shortDescription: string;
  link: string;
};

type Props = {
  items: CarouselItem[];
};

export default function HeroCarousel({ items }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // auto-slide cada 5s
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return null;

  const current = items[currentIndex];

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-xl shadow-md">
      <img
        src={current.image}
        alt={current.title}
        className="w-full h-full object-cover transition-opacity duration-500"
        onClick={() => navigate(current.link)}
        style={{ cursor: "pointer" }}
      />
      <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-4 backdrop-blur-sm">
        <h2 className="text-lg md:text-2xl font-semibold">{current.title}</h2>
        <p className="text-sm md:text-base">{current.shortDescription}</p>
      </div>

      {/* Flechas de navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white"
      >
        ›
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
