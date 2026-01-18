import type { Metadata } from "next";
import { DotGothic16 } from "next/font/google";
import "./globals.css";

const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "Hakusan Badge Quest",
  description: "Collect digital badges in the Hakusan Tedorigawa Geopark",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${dotGothic.variable} antialiased min-h-screen flex flex-col items-center bg-gray-950 font-pixel`}>
        <main className="w-full max-w-md flex-1 relative bg-[#1a1a2e] shadow-2xl overflow-hidden min-h-screen border-x-4 border-gray-700">
          {children}
        </main>
      </body>
    </html>
  );
}
