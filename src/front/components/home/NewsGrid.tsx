import NewsCard from "./NewsCard";

type NewsItem = {
  id: number;
  title: string;
  image: string;
  shortDescription: string;
  category: string;
  link: string;
};

type Props = {
  items: NewsItem[];
};

export default function NewsGrid({ items }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
