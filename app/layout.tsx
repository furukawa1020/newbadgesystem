import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Using system font or custom font later as per user request for "Modern"
import "./globals.css";

export const metadata: Metadata = {
  title: "Hakusan Badge Quest",
  description: "Collect digital badges in the Hakusan Tedorigawa Geopark",
  manifest: "/manifest.json",
  // themeColor: "#1a1a2e", // Deprecated in Next.js metadata, use viewport instead
};

export const viewport = {
  themeColor: "#1a1a2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen flex flex-col items-center">
        <main className="w-full max-w-md flex-1 relative bg-gray-900 shadow-2xl overflow-hidden min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
