"use client";

import { useEffect, useState } from "react";
import { Star, Trophy, Crown, Sparkles } from "lucide-react";
import { useAudio } from "@/lib/audio-context";

interface EndingModalProps {
    onClose: () => void;
    milestone: 'bronze' | 'silver' | 'gold';
}

export default function EndingModal({ onClose, milestone }: EndingModalProps) {
    const { playSfx } = useAudio();
    const [step, setStep] = useState(0);

    const isGold = milestone === 'gold';
    const isSilver = milestone === 'silver';

    useEffect(() => {
        const timers = [
            setTimeout(() => {
                playSfx(isGold ? "/assets/audio/sfx_badge_get.wav" : "/assets/audio/sfx_click.wav");
                setStep(1);
            }, 500),
            setTimeout(() => setStep(2), 2000),
            setTimeout(() => setStep(3), 4000),
        ];
        return () => timers.forEach(clearTimeout);
    }, [playSfx, isGold]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 animate-fade-in p-4 font-pixel overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                {isGold && [...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-yellow-400 rounded-full animate-ping"
                        style={{
                            width: Math.random() * 8 + 2 + 'px',
                            height: Math.random() * 8 + 2 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            animationDuration: Math.random() * 3 + 1 + 's',
                            opacity: 0.5
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 text-center space-y-8 max-w-lg w-full">

                {step >= 1 && (
                    <div className="animate-bounce mb-8">
                        {isGold ? (
                            <div className="relative inline-block">
                                <Crown className="w-32 h-32 text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,1)]" />
                                <Sparkles className="absolute -top-4 -right-4 text-white w-12 h-12 animate-spin-slow" />
                            </div>
                        ) : isSilver ? (
                            <Trophy className="w-24 h-24 text-gray-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                        ) : (
                            <Star className="w-24 h-24 text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]" />
                        )}
                    </div>
                )}

                {step >= 1 && (
                    <h1 className={`text-4xl md:text-5xl font-bold animate-fade-in-up pixel-text tracking-widest ${isGold ? 'text-[#e94560]' : 'text-white'}`}>
                        {isGold ? "LEGENDARY!" : "MILESTONE!"}
                    </h1>
                )}

                {step >= 2 && (
                    <div className="space-y-4 animate-fade-in-up delay-300">
                        <p className={`text-xl ${isGold ? 'text-yellow-400' : 'text-gray-300'}`}>
                            {isGold ? "ALL BADGES COLLECTED" :
                                isSilver ? "HALFWAY THERE!" : "ADVENTURE BEGUN!"}
                        </p>
                        <p className="text-gray-400 text-sm px-4">
                            {isGold ? "You have visited every town and uncovered every secret of the Hakusan Geopark. Use this power wisely." :
                                isSilver ? "You have collected 4 badges. The journey is half done, but the hardest challenges lie ahead." :
                                    "You have collected 3 badges. You are becoming a seasoned adventurer."}
                        </p>
                    </div>
                )}

                {step >= 3 && (
                    <div className="animate-fade-in-up delay-500 pt-8 border-t border-white/20 mt-8">
                        {isGold && (
                            <>
                                <p className="text-yellow-400 text-lg mb-2">TITLE UNLOCKED</p>
                                <p className="text-3xl text-white pixel-text border-2 border-white inline-block px-6 py-2 bg-gray-800 shadow-[0_0_20px_#e94560]">
                                    LEGEND
                                </p>
                            </>
                        )}

                        <div className="mt-8">
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-[#e94560] text-white hover:bg-white hover:text-red-500 transition-colors rounded pixel-text border-2 border-white"
                            >
                                CONTINUE JOURNEY
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
