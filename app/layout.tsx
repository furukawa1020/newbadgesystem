import type { Metadata } from "next";
// DotGothic16 is excellent for Japanese Pixel Art vibes
import { DotGothic16 } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel", // CSS variable for Tailwind
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hakusan-badge-quest.dev'),
  title: {
    default: "Hakusan Badge Quest | 白山手取川ジオパーク",
    template: "%s | Hakusan Badge Quest"
  },
  description: "白山手取川ジオパークでデジタルバッジを集めよう！NFCタグやQRコードを探して、限定のピクセルアートバッジをゲット。",
  keywords: ["Hakusan", "Geopark", "Badge Rally", "NFC", "Pixel Art", "白山手取川ジオパーク", "スタンプラリー", "観光"],
  authors: [{ name: "Hakusan Geopark" }],
  openGraph: {
    title: "Hakusan Badge Quest",
    description: "白山手取川ジオパークでデジタルバッジを集めよう！限定バッジをコンプリートして伝説になろう。",
    url: 'https://hakusan-badge-quest.dev',
    siteName: 'Hakusan Badge Quest',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hakusan Badge Quest',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Hakusan Badge Quest",
    description: "白山手取川ジオパークでデジタルバッジを集めよう！",
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hakusan Quest",
  },
};

export const viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevent zooming for "App-like" feel
  userScalable: false, // Strictly prevent zooming on iOS
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${dotGothic.variable} antialiased min-h-screen flex flex-col items-center bg-gray-950 font-pixel`}>
        <main className="w-full max-w-md flex-1 relative bg-[#1a1a2e] shadow-2xl overflow-hidden min-h-screen border-x-2 border-gray-800">
          <Providers>
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}
