"use client";

import { useEffect, useState } from "react";
import { Star, Trophy, Crown, Sparkles, Scroll } from "lucide-react";
import { useAudio } from "@/lib/audio-context";
import Image from "next/image";

interface EndingModalProps {
    onClose: () => void;
    milestone: 'bronze' | 'silver' | 'gold';
}

export default function EndingModal({ onClose, milestone }: EndingModalProps) {
    const { playSfx } = useAudio();
    const [step, setStep] = useState(0);

    const isGold = milestone === 'gold';
    const isSilver = milestone === 'silver';

    // Animation Sequence
    useEffect(() => {
        const timers = [
            setTimeout(() => {
                playSfx(isGold ? "/assets/audio/sfx_badge_get.wav" : "/assets/audio/sfx_click.wav");
                setStep(1); // Icon + Title
            }, 500),
            setTimeout(() => setStep(2), 2500), // Message
            setTimeout(() => setStep(3), 6000), // Credits (Gold only) or Continue
        ];
        return () => timers.forEach(clearTimeout);
    }, [playSfx, isGold]);

    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 animate-fade-in font-pixel overflow-hidden">

            {/* 1. Dynamic Background Particles (CSS) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {isGold && [...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-yellow-400 rounded-full animate-firework"
                        style={{
                            width: Math.random() * 6 + 2 + 'px',
                            height: Math.random() * 6 + 2 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            animationDelay: Math.random() * 5 + 's',
                            opacity: 0
                        }}
                    />
                ))}
                {(isSilver || isGold) && [...Array(20)].map((_, i) => (
                    <div
                        key={`confetti-${i}`}
                        className="absolute w-2 h-2 bg-white animate-confetti opacity-0"
                        style={{
                            left: Math.random() * 100 + '%',
                            top: '-10%',
                            backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'][Math.floor(Math.random() * 4)],
                            animationDuration: Math.random() * 3 + 2 + 's',
                            animationDelay: Math.random() * 2 + 's'
                        }}
                    />
                ))}
            </div>

            {/* 2. Main Content Container */}
            <div className="relative z-10 text-center space-y-8 max-w-lg w-full p-4">

                {/* Step 1: Big Icon */}
                {step >= 1 && (
                    <div className="animate-bounce-slow mb-4">
                        {isGold ? (
                            <div className="relative inline-block">
                                <Crown className="w-40 h-40 text-yellow-400 drop-shadow-[0_0_35px_rgba(250,204,21,0.8)]" />
                                <Sparkles className="absolute -top-8 -right-8 text-white w-16 h-16 animate-spin-slow" />
                                <Sparkles className="absolute bottom-0 -left-8 text-white w-12 h-12 animate-pulse" />
                            </div>
                        ) : isSilver ? (
                            <Trophy className="w-32 h-32 text-gray-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
                        ) : (
                            <Star className="w-32 h-32 text-orange-400 drop-shadow-[0_0_20px_rgba(251,146,60,0.6)]" />
                        )}
                    </div>
                )}

                {/* Step 1: Title */}
                {step >= 1 && (
                    <h1 className={`text-5xl md:text-6xl font-black animate-fade-in-up pixel-text tracking-widest ${isGold ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[4px_4px_0_#b45309]' : 'text-white'}`}>
                        {isGold ? "LEGENDARY!" : isSilver ? "MILESTONE!" : "LEVEL UP!"}
                    </h1>
                )}

                {/* Step 2: Message & Certificate */}
                {step >= 2 && step < 3 && (
                    <div className="space-y-6 animate-fade-in-up delay-300">
                        <p className={`text-xl md:text-2xl ${isGold ? 'text-yellow-200' : 'text-gray-300'}`}>
                            {isGold ? "YOU HAVE CONQUERED HAKUSAN!" :
                                isSilver ? "HALFWAY TO GLORY!" : "THE ADVENTURE BEGINS!"}
                        </p>

                        {isGold && (
                            <div className="mx-auto bg-[#fffbe6] text-black p-6 w-64 border-8 border-double border-[#e94560] shadow-2xl rotate-1 transform hover:rotate-0 transition-transform cursor-pointer">
                                <div className="border-b-2 border-black pb-2 mb-2 font-serif text-2xl font-bold">CERTIFICATE</div>
                                <div className="text-sm font-serif mb-4">OF HEROISM</div>
                                <div className="text-4xl">👑</div>
                                <div className="text-[10px] mt-4 text-gray-600">Hakusan Geopark Authority</div>
                            </div>
                        )}

                        <p className="text-gray-400 text-sm px-4 max-w-sm mx-auto leading-relaxed">
                            {isGold ? "You have visited every town and uncovered every secret. The bards will sing of your journey for generations." :
                                isSilver ? "You have collected 4 badges. The path gets steeper from here, but your spirit is stronger." :
                                    "You have collected 3 badges. You are becoming a seasoned adventurer. Keep going!"}
                        </p>
                    </div>
                )}

                {/* Step 3: Credits Roll (Gold Only) or Continue */}
                {step >= 3 && (
                    <div className="animate-fade-in">
                        {isGold ? (
                            <div className="h-64 overflow-hidden relative border-t-2 border-b-2 border-white/20 my-4 bg-black/50">
                                <div className="animate-credits-scroll absolute w-full text-center space-y-8 pb-10">
                                    <h3 className="text-yellow-500 text-lg mb-4">--- CREDITS ---</h3>

                                    <div>
                                        <div className="text-gray-400 text-xs">PRODUCER</div>
                                        <div className="text-white">HATAKE</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs">DEVELOPMENT</div>
                                        <div className="text-white">ANTIGRAVITY AI</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs">PIXEL ART</div>
                                        <div className="text-white">GENERATIVE AI</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs">SPECIAL THANKS</div>
                                        <div className="text-white">HAKUSAN GEOPARK</div>
                                        <div className="text-white">YOU (THE HERO)</div>
                                    </div>

                                    <div className="pt-8 text-yellow-500 text-xl font-bold">THANK YOU FOR PLAYING!</div>
                                </div>
                            </div>
                        ) : null}

                        <div className="mt-8">
                            {/* Unlock Title Display */}
                            {isGold && (
                                <div className="mb-6 animate-pulse">
                                    <p className="text-yellow-400 text-xs mb-1">NEW TITLE UNLOCKED</p>
                                    <span className="text-2xl text-white pixel-text border-2 border-white px-4 py-1 bg-[#e94560]">
                                        LEGEND
                                    </span>
                                </div>
                            )}

                            <button
                                onClick={onClose}
                                className="px-10 py-4 bg-[#e94560] text-white hover:bg-white hover:text-[#e94560] transition-colors rounded pixel-text border-4 border-white shadow-[4px_4px_0_black]"
                            >
                                {isGold ? "FINISH ADVENTURE" : "CONTINUE JOURNEY"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
