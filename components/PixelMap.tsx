"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function PixelMap({ towns, onTownClick }: { towns: any[], onTownClick: (id: string) => void }) {

    return (
        <div className="relative w-full aspect-square bg-[#1a1a2e] overflow-hidden pixel-box p-1 group cursor-crosshair">
            {/* Background Layer - User Provided Map */}
            <div className="absolute inset-0">
                <Image
                    src="/assets/map-bg.png"
                    alt="Hakusan Pixel Map"
                    fill
                    className="object-cover pixelated opacity-90"
                    priority
                />
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none z-0"></div>

            {/* Dynamic Environment Overlays */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 z-0">
                {/* Level 1-2: Bright Day (Default) */}
                {/* Level 3-4: Sunset */}
                {towns.filter(t => t.unlocked).length >= 3 && towns.filter(t => t.unlocked).length < 6 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/50 to-purple-900/30"></div>
                )}
                {/* Level 5-6: Night */}
                {towns.filter(t => t.unlocked).length >= 6 && towns.filter(t => t.unlocked).length < 8 && (
                    <div className="absolute inset-0 bg-[#0a0a2a]/60"></div>
                )}
                {/* Level 7-8: Storm/Final */}
                {towns.filter(t => t.unlocked).length >= 8 && (
                    <div className="absolute inset-0 bg-red-900/30 animate-pulse"></div>
                )}
            </div>

            {towns.filter(t => t.unlocked).length >= 8 && (
                <div className="absolute inset-0 pointer-events-none bg-[url('/assets/rain.png')] opacity-30 animate-rain z-1"></div>
            )}

            {/* Town Markers Placed Absolute % */}
            {towns.map((town) => (
                <motion.button
                    key={town.id}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onTownClick(town.id)}
                    className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${town.x}%`, top: `${town.y}%` }}
                >
                    {/* Building/Badge Icon */}
                    <div className="relative w-10 h-10 md:w-12 md:h-12 shadow-black drop-shadow-md">
                        {/* Unlock glow animation */}
                        {town.unlocked && (
                            <div className="absolute -inset-2 bg-yellow-400/50 rounded-full animate-ping"></div>
                        )}
                        <div className={`absolute -inset-2 rounded-full ${town.unlocked ? 'opacity-100' : 'opacity-0'} bg-yellow-400/30 hover:opacity-100 transition-opacity`}></div>

                        <div className={`w-full h-full rounded-full overflow-hidden border-2 ${town.unlocked ? 'border-yellow-400 shadow-[0_0_12px_#facc15]' : 'border-white/30 brightness-50'} bg-black/20`}>
                            <Image
                                src={`/assets/badges/${town.badgeImage}`}
                                alt={town.name}
                                fill
                                className={`object-cover ${town.unlocked ? '' : 'grayscale brightness-50'}`}
                            />
                        </div>
                    </div>

                    <div className={`mt-1 px-1.5 py-0.5 border text-[9px] pixel-text rounded-sm whitespace-nowrap ${
                        town.unlocked
                            ? 'bg-yellow-900/80 border-yellow-400/70 text-yellow-300'
                            : 'bg-black/80 border-white/30 text-gray-400'
                    }`}>
                        {town.name}
                    </div>
                </motion.button>
            ))}
        </div>
    );
}
