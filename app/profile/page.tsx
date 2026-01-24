"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PixelMap from "@/components/PixelMap";
import { TOWNS } from "@/lib/towns";
import Image from "next/image";
import { useAudio } from "@/lib/audio-context";
import TutorialModal from "@/components/TutorialModal";
import AvatarSelectionModal from "@/components/AvatarSelectionModal";
import BattleModal from "@/components/BattleModal";
import EndingModal from "@/components/EndingModal";
import { User, HelpCircle, Swords, Trophy, Star, Crown } from "lucide-react";

// Dynamically import RealMap to avoid SSR issues with Leaflet
const RealMap = dynamic(() => import("@/components/RealMap"), { ssr: false });

export default function Profile() {
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pixel' | 'real'>('pixel');
    const [selectedTown, setSelectedTown] = useState<any>(null);
    const [userBadges, setUserBadges] = useState<string[]>([]);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showAvatarSelect, setShowAvatarSelect] = useState(false);
    const [showBattle, setShowBattle] = useState(false);
    const [showEnding, setShowEnding] = useState(false);
    const [endingType, setEndingType] = useState<'bronze' | 'silver' | 'gold'>('bronze');
    const [avatarId, setAvatarId] = useState(1);

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
                    // Fetch Badges
                    const res = await fetch('/api/profile');
                    if (res.ok) {
                        const data: any = await res.json();
                        setUserBadges(data.badges || []);
                    }
                    // Fetch Avatar
                    const avatarRes = await fetch('/api/avatar');
                    if (avatarRes.ok) {
                        const avatarData: any = await avatarRes.json();
                        setAvatarId(avatarData.avatarId);
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

    const isUnlocked = (townId: string) => userBadges.includes(townId);

    // Milestones
    const badgeCount = userBadges.length;
    const isBronze = badgeCount >= 3;
    const isSilver = badgeCount >= 4; // Half of 8
    const isGold = badgeCount === TOWNS.length; // Complete

    // Sprite Position Helper
    const getAvatarStyle = (id: number) => {
        const x = (id - 1) % 2 === 0 ? '0%' : '100%';
        const y = id <= 2 ? '0%' : '100%';
        return {
            backgroundImage: 'url(/assets/avatars_sheet.png)',
            backgroundSize: '200% 200%',
            backgroundPosition: `${x} ${y}`,
            imageRendering: 'pixelated' as const
        };
    };

    // RPG Stats Logic
    const getStats = () => {
        const level = badgeCount + 1;
        let baseAtk = 10;
        let baseDef = 10;
        let baseHp = 50;

        // Completion Bonus
        const bonus = isGold ? 50 : (isSilver ? 20 : (isBronze ? 10 : 0));

        // Class Modifiers
        if (avatarId === 1) { // Hero: Balanced
            baseAtk = 12; baseDef = 12; baseHp = 60;
        } else if (avatarId === 2) { // Mage: High Atk, Low Def
            baseAtk = 18; baseDef = 6; baseHp = 40;
        } else if (avatarId === 3) { // Warrior: High Def, High HP
            baseAtk = 10; baseDef = 16; baseHp = 80;
        } else if (avatarId === 4) { // Jester: Random/Luck (High variance)
            baseAtk = 14; baseDef = 8; baseHp = 55;
        }

        return {
            name: isGold ? "LEGEND" : (avatarId === 1 ? "HERO" : avatarId === 2 ? "MAGE" : avatarId === 3 ? "WARRIOR" : "JESTER"),
            className: isGold ? "Legend" : (avatarId === 1 ? "Hero" : avatarId === 2 ? "Mage" : avatarId === 3 ? "Warrior" : "Jester"),
            level,
            atk: Math.floor(baseAtk + (level * 2.5)) + bonus,
            def: Math.floor(baseDef + (level * 2)) + bonus,
            hp: Math.floor(baseHp + (level * 10)) + bonus,
        };
    };

    const stats = getStats();

    const openEnding = (type: 'bronze' | 'silver' | 'gold') => {
        setEndingType(type);
        setShowEnding(true);
        playSfx("/assets/audio/sfx_badge_get.wav");
    };

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white p-4 font-pixel pb-24">
            <div className="retro-container space-y-4 mb-4 relative">

                {/* Header with Help & Avatar */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => {
                                playSfx("/assets/audio/sfx_click.wav");
                                setShowAvatarSelect(true);
                            }}
                            className={`relative w-20 h-20 bg-white rounded-lg border-4 overflow-hidden shadow-lg active:scale-95 transition-transform group ${isGold ? 'border-yellow-400 shadow-[0_0_20px_#facc15]' : 'border-white'}`}
                        >
                            <div className="w-full h-full" style={getAvatarStyle(avatarId)} />
                            <div className="absolute bottom-0 w-full text-[8px] bg-black/70 text-center text-white opacity-0 group-hover:opacity-100 transition-opacity">CHANGE</div>
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className={`text-xl pixel-text ${isGold ? 'text-yellow-400 animate-pulse' : 'text-[#e94560]'}`}>
                                    {stats.name}
                                </h1>
                                <span className="bg-yellow-500 text-black text-[10px] px-2 rounded pixel-text font-bold">
                                    LV. {stats.level}
                                </span>
                            </div>

                            <div className="text-xs text-gray-300 space-y-1 font-mono">
                                <p>ID: {deviceId ? deviceId.slice(0, 8) : "..."}</p>
                                <div className="flex gap-3 text-[10px] text-gray-400">
                                    <span>HP: {stats.hp}</span>
                                    <span className="text-red-400">ATK: {stats.atk}</span>
                                    <span className="text-blue-400">DEF: {stats.def}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => {
                                playSfx("/assets/audio/sfx_click.wav");
                                setShowTutorial(true);
                            }}
                            className="bg-gray-700 p-2 rounded-full hover:bg-gray-600"
                        >
                            <HelpCircle className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={() => {
                                playSfx("/assets/audio/sfx_click.wav");
                                setShowBattle(true);
                            }}
                            className="bg-red-600 p-2 rounded-full hover:bg-red-500 animate-pulse border-2 border-white"
                            title="Battle Practice"
                        >
                            <Swords className="w-5 h-5 text-white" />
                        </button>

                        {/* Milestone Buttons */}
                        {isGold && (
                            <button
                                onClick={() => openEnding('gold')}
                                className="bg-yellow-500 p-2 rounded-full hover:bg-yellow-400 animate-bounce border-2 border-white shadow-lg"
                                title="Completion Award"
                            >
                                <Crown className="w-5 h-5 text-black" />
                            </button>
                        )}
                        {!isGold && isSilver && (
                            <button
                                onClick={() => openEnding('silver')}
                                className="bg-gray-300 p-2 rounded-full hover:bg-white border-2 border-gray-500"
                                title="Midpoint Award"
                            >
                                <Trophy className="w-5 h-5 text-gray-800" />
                            </button>
                        )}
                        {!isGold && !isSilver && isBronze && (
                            <button
                                onClick={() => openEnding('bronze')}
                                className="bg-orange-700 p-2 rounded-full hover:bg-orange-600 border-2 border-orange-900"
                                title="Beginner Award"
                            >
                                <Star className="w-5 h-5 text-orange-200" />
                            </button>
                        )}
                    </div>
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

            {showBattle && (
                <BattleModal
                    playerStats={stats}
                    onClose={() => {
                        playSfx("/assets/audio/sfx_click.wav");
                        setShowBattle(false);
                    }}
                />
            )}

            {showEnding && (
                <EndingModal
                    milestone={endingType}
                    onClose={() => setShowEnding(false)}
                />
            )}
        </div>
    );
}
