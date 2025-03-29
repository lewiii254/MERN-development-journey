import fs from "fs";
import path from "path";
import matter from "gray-matter";
import PostCard from "@/components/PostCard";

export default function Blog() {
  const postsDir = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDir);

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    return {
      slug: filename.replace(".md", ""),
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
    };
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-heading text-primary mb-8">Blog Posts</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  );
}