import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-heading text-primary mb-4">Welcome to My Blog</h1>
      <p className="text-lg text-gray-700 mb-6">Hi, I Marklewis Mutugi. Sharing my thoughts and journey here!</p>
      <Link href="/blog" className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-accent hover:text-primary transition">
        Check Out My Blog
      </Link>
    </div>
  );
}