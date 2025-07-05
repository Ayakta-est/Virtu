import HeroCarousel from "../components/home/HeroCarousel";
import NewsGrid from "../components/home/NewsGrid";

const carouselData = [
  {
    id: "1",
    title: "¡Nueva expansión del juego!",
    image: "/images/banner1.jpg",
    shortDescription: "Descubre el nuevo contenido de la categoría Harry Potter.",
    link: "/noticias/1",
  },
  {
    id: "2",
    title: "Se vienen torneos físicos",
    image: "/images/banner2.jpg",
    shortDescription: "Prepárate para los eventos presenciales este verano.",
    link: "/noticias/2",
  },
];

const noticias = [
  {
    id: "1",
    title: "Apoyamos la cultura local con jóvenes ilustradores",
    image: "https://i.pinimg.com/736x/f0/1d/89/f01d895dc2a35a884f69c069b7ac2fe0.jpg",
    shortDescription: "Una iniciativa para dar visibilidad a talento emergente en ilustración.",
    category: "Grupo",
    link: "/noticias/1",
  },
  {
    id: "2",
    title: "Un verano de fútbol y diversión",
    image: "https://i.pinimg.com/736x/00/bb/a9/00bba9a2d855d2cc08c9ae96339664f8.jpg",
    shortDescription: "Así vivieron los niños el Camp de LaLiga este año.",
    category: "Personas",
    link: "/noticias/2",
  },
  {
    id: "3",
    title: "El nuevo modo desafío ya está disponible",
    image: "https://i.pinimg.com/736x/ef/83/12/ef83122faee8a0c3cc1ccd1513f8fb7f.jpg",
    shortDescription: "Pon a prueba tus conocimientos en partidas temáticas especiales.",
    category: "Juego",
    link: "/noticias/3",
  },
];

export const Home = () => {
  return (
    <div className="p-4 space-y-6">
      <HeroCarousel items={carouselData} />
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-800">Noticias de actualidad</h2>
        <NewsGrid items={noticias} />
      </div>
    </div>
  );
};
