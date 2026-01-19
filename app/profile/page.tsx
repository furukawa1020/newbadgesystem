"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PixelMap from "@/components/PixelMap";
import { TOWNS } from "@/lib/towns";
import Image from "next/image";
import { useAudio } from "@/lib/audio-context";
import TutorialModal from "@/components/TutorialModal";
import { User, HelpCircle } from "lucide-react";

// Dynamically import RealMap to avoid SSR issues with Leaflet
const RealMap = dynamic(() => import("@/components/RealMap"), { ssr: false });

export default function Profile() {
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pixel' | 'real'>('pixel');
    const [selectedTown, setSelectedTown] = useState<any>(null);
    const [userBadges, setUserBadges] = useState<string[]>([]);
    const [showTutorial, setShowTutorial] = useState(false);
    const [avatarId, setAvatarId] = useState(1); // 1: Boy, 2: Girl

    const { playSfx } = useAudio();

    useEffect(() => {
        const initProfile = async () => {
            const storedId = localStorage.getItem('hakusan_device_id');
            setDeviceId(storedId);

            // Load Local preferences or default
            const savedAvatar = localStorage.getItem('hakusan_avatar');
            if (savedAvatar) setAvatarId(parseInt(savedAvatar));

            // Check for tutorial seen
            const seenTutorial = localStorage.getItem('hakusan_tutorial_seen');
            if (!seenTutorial) {
                setShowTutorial(true);
                localStorage.setItem('hakusan_tutorial_seen', 'true');
            }

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

    const handleReset = async () => {
        if (!confirm("DATA DELETE: Are you sure? This cannot be undone.")) return;
        try {
            await fetch('/api/reset', { method: 'DELETE' });
            setUserBadges([]);
            alert("Data Reset Complete.");
        } catch (e) {
            alert("Reset Failed");
        }
    };

    const toggleAvatar = () => {
        const next = avatarId === 1 ? 2 : 1;
        setAvatarId(next);
        localStorage.setItem('hakusan_avatar', next.toString());
        playSfx("/assets/audio/sfx_click.wav");
    };

    const isUnlocked = (townId: string) => userBadges.includes(townId);

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white p-4 font-pixel pb-24">
            <div className="retro-container space-y-4 mb-4 relative">

                {/* Header with Help & Avatar */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={toggleAvatar}
                            className="relative w-16 h-16 bg-gray-800 rounded-full border-2 border-white overflow-hidden shadow-lg active:scale-95 transition-transform"
                        >
                            {/* Simple Placeholder Avatar */}
                            <div className={`absolute inset-0 ${avatarId === 1 ? 'bg-blue-500' : 'bg-pink-500'} flex items-center justify-center`}>
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute bottom-0 w-full text-[8px] bg-black/50 text-center">TAP</div>
                        </button>
                        <div>
                            <h1 className="text-xl text-[#e94560] pixel-text">TRAINER</h1>
                            <span className="text-xs text-gray-400 block">ID: {deviceId ? deviceId.slice(0, 6) : "..."}</span>
                            <span className="text-xs text-yellow-400">LV.{userBadges.length}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            playSfx("/assets/audio/sfx_click.wav");
                            setShowTutorial(true);
                        }}
                        className="bg-gray-700 p-2 rounded-full hover:bg-gray-600"
                    >
                        <HelpCircle className="w-6 h-6 text-white" />
                    </button>
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
                        onClick={() => {
                            playSfx("/assets/audio/sfx_click.wav");
                            setActiveTab('real');
                        }}
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
                                    onClick={() => handleTownClick(town.id)}
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

                {/* Footer Controls */}
                <div className="mt-8 pt-4 border-t border-gray-800 text-center">
                    <button
                        onClick={handleReset}
                        className="text-[10px] text-red-900 hover:text-red-500 transition-colors"
                    >
                        DEBUG: RESET PROGRESS
                    </button>
                </div>

            </div>

            {showTutorial && (
                <TutorialModal onClose={() => setShowTutorial(false)} />
            )}

            {showAvatarSelect && (
                <AvatarSelectionModal
                    currentAvatarId={avatarId}
                    onSelect={(id) => setAvatarId(id)}
                    onClose={() => setShowAvatarSelect(false)}
                />
            )}
        </div>
    );
}
