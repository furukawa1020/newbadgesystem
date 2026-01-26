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
        localStorage.setItem('hakusan_device_id', data.userId);
        router.push('/profile');
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

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-8 h-full min-h-screen relative overflow-hidden box-border font-pixel bg-[#1a1a2e]">

      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0 opacity-50 bg-[url('/assets/map-bg.png')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#1a1a2e]/60 to-[#1a1a2e] z-0"></div>

      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>

      <div className="z-10 relative space-y-4 animate-pulse-slow">
        {/* Main Title H1 for SEO */}
        <h1 className="text-4xl md:text-5xl text-white drop-shadow-[4px_4px_0_#000] tracking-widest leading-tight pixel-text">
          白山バッジ<br />クエスト
        </h1>
        {/* Subtitle */}
        <p className="text-xl text-[#e94560] font-bold tracking-widest mt-2 drop-shadow-[2px_2px_0_#000]">
          HAKUSAN LEAGUE
        </p>

        {/* Keyword Rich Description */}
        <div className="bg-black/60 p-4 rounded border-2 border-gray-600 mt-4 max-w-xs mx-auto backdrop-blur-sm">
          <h2 className="text-sm text-yellow-400 font-bold mb-2">石川県白山市観光の決定版</h2>
          <p className="text-xs text-gray-200 leading-relaxed text-left">
            白山手取川ジオパークを<span className="text-white font-bold">周遊して回る</span><br />
            無料デジタルスタンプラリー。<br />
            スマホ片手に観光名所を巡り、<br />
            限定の<span className="text-[#e94560]">ピクセルバッジ</span>を集めよう！
          </p>
        </div>
      </div>

      <div className="z-10 relative w-64 h-64 my-4 animate-float">
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
        <Image
          src="/icon.png"
          alt="白山バッジクエスト アプリアイコン"
          width={256}
          height={256}
          className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] filter contrast-125 rounded-3xl"
          priority
        />
      </div>

      <div className="z-10 relative w-full space-y-6 px-4">
        <button
          onClick={handleStart}
          disabled={isLoading}
          className="w-full py-4 bg-[#e94560] text-white border-4 border-white shadow-[4px_4px_0_#000] active:shadow-[0_0_0_#000] active:translate-x-[4px] active:translate-y-[4px] transition-all pixel-text text-xl tracking-widest hover:bg-[#ff6b81] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "LOADING..." : "冒険を始める"}
        </button>

        <div className="text-[10px] text-gray-400 pixel-text space-y-1">
          <p>会員登録不要・インストール不要</p>
          <p className="opacity-50">VERSION 2.1.0 (SEO BOOST)</p>
        </div>
      </div>

      <div className="absolute bottom-4 text-[10px] text-gray-600 z-10 pixel-text">
        &copy; Hakusan Tedorigawa Geopark Badge Quest<br />
        白山市観光・ジオパーク・デジタル推進
      </div>
    </div>
  );
}
