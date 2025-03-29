import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "My Personal Blog",
  description: "A blog built with Next.js by [Your Name]",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50 font-sans">
        <nav className="bg-primary text-white p-4 sticky top-0 shadow-md">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-heading">
              My Blog
            </Link>
            <div>
              <Link href="/" className="mr-6 hover:text-accent">
                Home
              </Link>
              <Link href="/blog" className="hover:text-accent">
                Blog
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}