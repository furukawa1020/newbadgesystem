"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PixelMap from "@/components/PixelMap";
import { TOWNS } from "@/lib/towns";
import Image from "next/image";
import { useAudio } from "@/lib/audio-context";

// Dynamically import RealMap to avoid SSR issues with Leaflet
const RealMap = dynamic(() => import("@/components/RealMap"), { ssr: false });

export default function Profile() {
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pixel' | 'real'>('pixel');
    const [selectedTown, setSelectedTown] = useState<any>(null);
    const [userBadges, setUserBadges] = useState<string[]>([]);
    const { playSfx } = useAudio();

    useEffect(() => {
        const initProfile = async () => {
            const storedId = localStorage.getItem('hakusan_device_id');
            setDeviceId(storedId);

            if (storedId) {
                try {
                    const res = await fetch('/api/profile');
                    if (res.ok) {
                        const data = await res.json();
                        setUserBadges(data.badges || []);
                    }
                } catch (e) {
                    console.error("Failed to load profile", e);
                }
            }
        };
        initProfile();
    }, []);

    const handleTownClick = (id: string) => {
        playSfx("/assets/audio/sfx_click.wav");
        const town = TOWNS.find(t => t.id === id);
        setSelectedTown(town);
    };

    const isUnlocked = (townId: string) => userBadges.includes(townId);

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white p-4 font-pixel pb-20">
            <div className="retro-container space-y-4 mb-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl text-[#e94560] pixel-text">TRAINER CARD</h1>
                    <span className="text-xs text-gray-400">ID: {deviceId ? deviceId.slice(0, 6) : "..."}</span>
                </div>

                {/* Map Toggle Tabs */}
                <div className="flex gap-2 border-b-2 border-gray-600 pb-2">
                    <button
                        onClick={() => {
                            playSfx("/assets/audio/sfx_click.wav");
                            setActiveTab('pixel');
                        }}
                        className={`px-4 py-1 text-sm ${activeTab === 'pixel' ? 'bg-[#e94560] text-white' : 'bg-gray-800 text-gray-400'} pixel-box transition-colors`}
                    >
                        PIXEL MAP
                    </button>
                    <button
                        onClick={() => setActiveTab('real')}
                        className={`px-4 py-1 text-sm ${activeTab === 'real' ? 'bg-[#e94560] text-white' : 'bg-gray-800 text-gray-400'} pixel-box transition-colors`}
                    >
                        REAL MAP
                    </button>
                </div>

                {/* Map Display */}
                <div className="w-full">
                    {activeTab === 'pixel' ? (
                        <PixelMap towns={TOWNS} onTownClick={handleTownClick} />
                    ) : (
                        <RealMap towns={TOWNS} />
                    )}
                </div>

                {/* Selected Town Info */}
                {selectedTown && (
                    <div className="p-3 bg-gray-900 border-2 border-dashed border-gray-600 rounded animate-fade-in-up">
                        <div className="flex gap-4">
                            <div className="relative w-16 h-16 shrink-0">
                                <div className={`absolute inset-0 ${isUnlocked(selectedTown.id) ? 'bg-yellow-500/20' : 'bg-black/50'} rounded-full`}></div>
                                <Image
                                    src={`/assets/badges/${selectedTown.badgeImage}`}
                                    alt={selectedTown.name}
                                    fill
                                    className={`object-contain pixelated ${isUnlocked(selectedTown.id) ? '' : 'brightness-0 opacity-50'}`}
                                />
                            </div>
                            <div>
                                <h3 className="text-[#e94560] text-lg">{selectedTown.name}</h3>
                                <p className="text-xs text-gray-300">{selectedTown.description}</p>
                                <div className="mt-2 text-[10px] text-gray-500">
                                    STATUS: <span className={isUnlocked(selectedTown.id) ? "text-yellow-400" : "text-gray-400"}>
                                        {isUnlocked(selectedTown.id) ? "UNLOCKED" : "LOCKED"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Badge Grid */}
                <div className="border-t-2 border-white/20 pt-4">
                    <p className="text-center text-xs text-gray-500 mb-2">BADGE COLLECTION</p>
                    <div className="grid grid-cols-4 gap-2">
                        {TOWNS.map((town) => {
                            const unlocked = isUnlocked(town.id);
                            return (
                                <button
                                    key={town.id}
                                    className={`aspect-square bg-gray-900 border-2 ${unlocked ? 'border-yellow-500 bg-yellow-900/20' : 'border-gray-700'} rounded-sm relative group cursor-pointer transition-all`}
                                    onClick={() => setSelectedTown(town)}
                                >
                                    <div className={`absolute inset-0 flex items-center justify-center ${unlocked ? 'opacity-100' : 'opacity-30 grayscale'} hover:opacity-100 hover:grayscale-0 transition-all`}>
                                        <Image
                                            src={`/assets/badges/${town.badgeImage}`}
                                            alt={town.name}
                                            width={40}
                                            height={40}
                                            className="object-contain pixelated"
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
