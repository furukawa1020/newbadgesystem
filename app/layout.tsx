import type { Metadata } from "next";
// DotGothic16 is excellent for Japanese Pixel Art vibes
import { DotGothic16 } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import SeoStructuredData from "@/components/SeoStructuredData";

const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel", // CSS variable for Tailwind
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hakusan-badge-quest.dev'),
  title: {
    default: "白山バッジクエスト | 石川県白山市のジオパークスタンプラリー",
    template: "%s | 白山バッジクエスト"
  },
  description: "白山市の8つの旧市町村を巡りながらフィジカルなバッチとデジタルバッジを集める冒険に出かけよう！白山手取川ジオパークを周遊して回る無料デジタルスタンプラリーRPG。子供から大人まで楽しめる石川県の観光周遊ゲーム。",
  keywords: [
    "白山", "白山市", "石川県白山市", "観光", "周遊", "回る", "観光スポット", "ジオパーク", "石川県",
    "スタンプラリー", "デジタルバッジ", "バッジ", "バッチ", "NFCゲーム", "RPG",
    "白峰", "鶴来", "手取川", "子供連れ", "遊び場", "無料ゲーム"
  ],
  authors: [{ name: "Hakusan Geopark Badge Quest Team" }],
  openGraph: {
    title: "白山バッジクエスト | ジオパークを冒険するRPG",
    description: "白山手取川ジオパークでデジタルバッジを集めよう！スライムやドラゴンと戦い、限定バッジをコンプリートして伝説になろう。",
    url: 'https://hakusan-badge-quest.dev',
    siteName: '白山バッジクエスト (Hakusan Badge Quest)',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hakusan Badge Quest RPG',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "白山バッジクエスト | ジオパーク冒険",
    description: "白山手取川ジオパークを冒険してバッジを集めよう！",
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
        <SeoStructuredData />
        <main className="w-full max-w-md flex-1 relative bg-[#1a1a2e] shadow-2xl overflow-hidden min-h-screen border-x-2 border-gray-800">
          <Providers>
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}
