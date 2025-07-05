import { useEffect, useState } from "react";
import HeroCarousel from "../components/home/HeroCarousel";
import NewsGrid from "../components/home/NewsGrid";
import { fetchHomeNews } from "../services/fetchHomeNews";
import { NewsItem } from "../../types";

export const Home = () => {
  const [carouselData, setCarouselData] = useState<NewsItem[]>([]);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeNews()
      .then((data) => {
        setCarouselData(data.destacados);
        setNewsData(data.noticias);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Cargando noticias...</div>;

  return (
    <div className="p-4 space-y-6">
      {carouselData.length > 0 && <HeroCarousel items={carouselData} />}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-800">Noticias de actualidad</h2>
        <NewsGrid items={newsData} />
      </div>
    </div>
  );
};
