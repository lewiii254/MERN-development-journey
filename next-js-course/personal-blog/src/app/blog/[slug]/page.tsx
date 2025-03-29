import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDir);
  return filenames.map((filename) => ({
    slug: filename.replace(".md", ""),
  }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), "posts", `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-heading text-primary mb-4">{data.title}</h1>
        <p className="text-gray-600 text-sm mb-6">
          {new Date(data.date).toLocaleDateString()}
        </p>
        <div className="prose prose-lg text-gray-800 font-sans">
  <ReactMarkdown>{content}</ReactMarkdown>
</div>
      </div>
    </div>
  );
}