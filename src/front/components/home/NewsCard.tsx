import { useNavigate } from "react-router-dom";

type NewsItem = {
  id: number;
  title: string;
  image: string;
  shortDescription: string;
  category: string;
  link: string;
};

type Props = {
  item: NewsItem;
};

export default function NewsCard({ item }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/notices/${item.id}`)}
      className="cursor-pointer rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300 bg-white"
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 space-y-1">
        <p className="text-sm text-gray-500">{item.category}</p>
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {item.shortDescription}
        </p>
      </div>
    </div>
  );
}
