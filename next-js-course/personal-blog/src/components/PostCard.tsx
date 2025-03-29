import Link from "next/link";

type PostCardProps = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

export default function PostCard({ slug, title, date, excerpt }: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="block">
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition hover:bg-accent">
        <h2 className="text-2xl font-heading text-primary">{title}</h2>
        <p className="text-gray-600 text-sm">{new Date(date).toLocaleDateString()}</p>
        <p className="text-gray-700 mt-2">{excerpt}</p>
      </div>
    </Link>
  );
}