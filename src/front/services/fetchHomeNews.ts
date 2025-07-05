type NewsItem = {
  id: number;
  title: string;
  image: string;
  shortDescription: string;
  content: string;
  category: string;
  link: string;
  isFeatured: boolean;
  createdAt: string;
};

type HomeNewsResponse = {
  destacados: NewsItem[];
  noticias: NewsItem[];
};

export async function fetchHomeNews(): Promise<HomeNewsResponse> {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/noticias/home`);
  if (!res.ok) throw new Error("Error al cargar las noticias");
  return res.json();
}
