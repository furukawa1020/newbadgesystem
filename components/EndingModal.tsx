"use client";

import { useEffect, useState } from "react";
import { Star, Trophy, X } from "lucide-react";
import { useAudio } from "@/lib/audio-context";

interface EndingModalProps {
    onClose: () => void;
}

export default function EndingModal({ onClose }: EndingModalProps) {
    const { playSfx } = useAudio();
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Simple animation sequence
        const timers = [
            setTimeout(() => {
                playSfx("/assets/audio/sfx_badge_get.wav");
                setStep(1);
            }, 500),
            setTimeout(() => setStep(2), 2500),
            setTimeout(() => setStep(3), 5000),
        ];
        return () => timers.forEach(clearTimeout);
    }, [playSfx]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 animate-fade-in p-4 font-pixel overflow-hidden">
            {/* Background Stars */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-yellow-200 rounded-full animate-pulse"
                        style={{
                            width: Math.random() * 4 + 2 + 'px',
                            height: Math.random() * 4 + 2 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            animationDelay: Math.random() * 2 + 's'
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 text-center space-y-8 max-w-lg w-full">

                {step >= 1 && (
                    <div className="animate-bounce mb-8">
                        <Trophy className="w-24 h-24 text-yellow-400 mx-auto drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
                    </div>
                )}

                {step >= 1 && (
                    <h1 className="text-4xl md:text-6xl text-[#e94560] font-bold animate-fade-in-up pixel-text tracking-widest">
                        CONGRATULATIONS!
                    </h1>
                )}

                {step >= 2 && (
                    <div className="space-y-4 animate-fade-in-up delay-300">
                        <p className="text-xl text-white">ALL BADGES COLLECTED</p>
                        <p className="text-gray-400 text-sm">
                            You have visited every town and uncovered every secret of the Hakusan Geopark.
                        </p>
                    </div>
                )}

                {step >= 3 && (
                    <div className="animate-fade-in-up delay-500 pt-8 border-t border-white/20 mt-8">
                        <p className="text-yellow-400 text-lg mb-2">YOU ARE NOW A</p>
                        <p className="text-3xl text-white pixel-text border-2 border-white inline-block px-6 py-2 bg-gray-800">
                            LEGENDARY HERO
                        </p>
                        <p className="text-[10px] text-gray-500 mt-8">Thank you for playing!</p>

                        <button
                            onClick={onClose}
                            className="mt-8 px-8 py-3 bg-[#e94560] text-white hover:bg-white hover:text-red-500 transition-colors rounded pixel-text"
                        >
                            RETURN TO WORLD
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
