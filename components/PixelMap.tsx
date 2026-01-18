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

            {/* Grid Overlay for "RPG" feel - subtle scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none z-0"></div>

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
                        <div className="absolute -inset-2 bg-yellow-400/30 rounded-full animate-ping opacity-0 hover:opacity-100"></div>
                        <Image
                            src={`/assets/badges/${town.badgeImage}`}
                            alt={town.name}
                            width={48}
                            height={48}
                            className="object-contain pixelated filter drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]"
                        />
                    </div>

                    <div className="mt-1 px-1.5 py-0.5 bg-black/80 border border-white/40 text-[9px] text-white pixel-text rounded-sm whitespace-nowrap backdrop-blur-sm">
                        {town.name}
                    </div>
                </motion.button>
            ))}
        </div>
    );
}
