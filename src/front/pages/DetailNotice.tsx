import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface NewsItem {
  id: number;
  title: string;
  image: string;
  short_description: string;
  content: string;
  category: string;
  link: string;
  is_featured: boolean;
}

const DetailNotice = () => {
  const { id } = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notices/${id}`);
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error("Error al cargar la noticia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) return <p className="text-center py-10">Cargando...</p>;
  if (!news) return <p className="text-center py-10 text-red-600">Noticia no encontrada.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">{news.title}</h1>
      <p className="text-sm text-gray-500">{news.category}</p>
      <img src={news.image} alt={news.title} className="w-full rounded shadow" />
      <p className="text-lg text-gray-700 whitespace-pre-line">{news.content}</p>
    </div>
  );
};

export default DetailNotice;
