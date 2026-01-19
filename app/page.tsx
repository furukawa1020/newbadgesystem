"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAudio } from "@/lib/audio-context";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { playSfx } = useAudio();

  const handleStart = async () => {
    playSfx("/assets/audio/sfx_click.wav");
    setIsLoading(true);
    try {
      // Automatic "Device Registration" flow
      const res = await fetch('/api/auth', { method: 'POST' });
      if (res.ok) {
        const data: { userId: string } = await res.json();
        console.log("Device registered:", data.userId);
        // Store simple visual flag but rely on cookie for auth
        localStorage.setItem('hakusan_device_id', data.userId);
        router.push('/profile'); // Redirect to Profile/Map
      } else {
        const errData: any = await res.json().catch(() => ({}));
        alert(`Verification failed: ${errData.error || res.statusText} (${res.status})`);
      }
    } catch (e: any) {
      console.error(e);
      alert(`Error starting adventure: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Hakusan Badge Quest',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Any',
    description: '白山手取川ジオパークを巡るデジタルスタンプラリーゲーム',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    author: {
      '@type': 'Organization',
      name: 'Hakusan Geopark'
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-8 h-full min-h-screen relative overflow-hidden box-border font-pixel bg-[#1a1a2e]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0 opacity-50 bg-[url('/assets/bg-hakusan.jpg')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#1a1a2e]/60 to-[#1a1a2e] z-0"></div>

      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>

      <div className="z-10 relative space-y-4 animate-pulse-slow">
        <h1 className="text-5xl text-white drop-shadow-[4px_4px_0_#000] tracking-widest leading-none pixel-text">
          HAKUSAN<br />LEAGUE
        </h1>
        <div className="pixel-box inline-block px-4 py-1 text-xs text-gray-200 pixel-text bg-gray-900 border-2 border-gray-600">
          白山手取川ジオパーク・クエスト
        </div>
      </div>

      <div className="z-10 relative w-64 h-64 my-8 animate-float">
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
        <Image
          src="/assets/badges/processed_icon_sample.png"
          alt="Adventure Badge"
          width={256}
          height={256}
          className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] filter contrast-125"
          priority
        />
      </div>

      <div className="z-10 relative w-full space-y-6 px-4">
        <button
          onClick={handleStart}
          disabled={isLoading}
          className="w-full py-4 bg-[#e94560] text-white border-4 border-white shadow-[4px_4px_0_#000] active:shadow-[0_0_0_#000] active:translate-x-[4px] active:translate-y-[4px] transition-all pixel-text text-xl tracking-widest hover:bg-[#ff6b81] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "LOADING..." : "START ADVENTURE"}
        </button>

        <div className="text-[10px] text-gray-400 pixel-text space-y-1">
          <p>NO ACCOUNT NEEDED • AUTO SAVE</p>
          <p className="opacity-50">VERSION 2.0.0 (NEXT/D1)</p>
        </div>
      </div>

      <div className="absolute bottom-4 text-[10px] text-gray-600 z-10 pixel-text">
        &copy; Hakusan Tedorigawa Geopark
      </div>
    </div>
  );
}
