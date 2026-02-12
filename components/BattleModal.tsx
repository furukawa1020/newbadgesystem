"use client";

import { useState, useEffect, useRef } from "react";
import { X, Sword, Shield, Skull, Flame, Zap, Heart, Footprints } from "lucide-react";
import { useAudio } from "@/lib/audio-context";
import Image from "next/image";
import SocialShare from "@/components/SocialShare";

interface BattleStats {
    name: string;
    hp: number;
    maxHp: number; // Added maxHp for healing cap
    atk: number;
    def: number;
    className: string;
    level: number;
    mp: number;    // Added MP
    maxMp: number; // Added Max MP
}

interface BattleModalProps {
    playerStats: BattleStats;
    onClose: () => void;
}

export default function BattleModal({ playerStats, onClose }: BattleModalProps) {
    const { playSfx } = useAudio();
    const logEndRef = useRef<HTMLDivElement>(null);

    // Dynamic Battle State
    const [battleLog, setBattleLog] = useState<string[]>(["Battle Start!"]);
    const [enemyStats, setEnemyStats] = useState<BattleStats | null>(null);

    // Convert props to local state for modification during battle
    const [myHp, setMyHp] = useState(playerStats.hp);
    const [myMp, setMyMp] = useState(playerStats.mp);
    const [enemyHp, setEnemyHp] = useState(0); // Set after generation

    const [turn, setTurn] = useState(0);
    const [status, setStatus] = useState<'intro' | 'player_turn' | 'enemy_turn' | 'won' | 'lost'>('intro');
    const [shake, setShake] = useState(false);
    const [flash, setFlash] = useState(false); // Magic flash effect

    // Auto-Scroll Log
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [battleLog]);

    // Initial Enemy Generation
    useEffect(() => {
        const difficulty = Math.random() > 0.5 ? 1.0 : 1.2;
        const enemyLevel = Math.max(1, Math.floor(playerStats.level * difficulty));

        // EXPANDED ENEMY ROSTER
        const monsters = [
            { name: "Slime", baseHp: 30, baseAtk: 8, baseDef: 2, exp: 10 },
            { name: "Goblin", baseHp: 50, baseAtk: 12, baseDef: 5, exp: 20 },
            { name: "Wolf", baseHp: 40, baseAtk: 15, baseDef: 3, exp: 15 },
            { name: "Orc", baseHp: 80, baseAtk: 18, baseDef: 10, exp: 35 },
            { name: "Golem", baseHp: 120, baseAtk: 25, baseDef: 20, exp: 50 },
            { name: "Chimera", baseHp: 100, baseAtk: 22, baseDef: 12, exp: 45 },
            { name: "Dragon", baseHp: 200, baseAtk: 35, baseDef: 25, exp: 100 },
            { name: "Dark Knight", baseHp: 150, baseAtk: 30, baseDef: 22, exp: 80 },
        ];

        // Improved Selection Logic based on Level Ranges
        let possible = monsters.filter(m => {
            if (enemyLevel < 3) return m.name === "Slime" || m.name === "Goblin";
            if (enemyLevel < 6) return m.name === "Wolf" || m.name === "Orc";
            if (enemyLevel < 9) return m.name === "Golem" || m.name === "Chimera";
            return true; // High level can match anything but usually top tier
        });

        // Fallback
        if (possible.length === 0) possible = [monsters[monsters.length - 1]];

        const monster = possible[Math.floor(Math.random() * possible.length)];

        const eStats: BattleStats = {
            name: `${monster.name} Lv.${enemyLevel}`,
            hp: monster.baseHp + (enemyLevel * 8),
            maxHp: monster.baseHp + (enemyLevel * 8),
            atk: monster.baseAtk + (enemyLevel * 1.5),
            def: monster.baseDef + (enemyLevel * 1),
            className: "Monster",
            level: enemyLevel,
            mp: 0,
            maxMp: 0
        };

        setEnemyStats(eStats);
        setEnemyHp(eStats.hp);

        setTimeout(() => {
            setBattleLog(prev => [...prev, `Wild ${eStats.name} appeared!`]);
            setStatus('player_turn');
        }, 1000);
    }, []); // Run once

    // --- Battle Actions ---

    // 1. Physical Attack
    const handleAttack = () => {
        if (status !== 'player_turn' || !enemyStats) return;
        playSfx("/assets/audio/sfx_click.wav");

        // Crit Chance
        const isCrit = Math.random() < 0.1;
        let dmg = Math.floor((playerStats.atk * (isCrit ? 1.5 : 1.0) * (1 + Math.random() * 0.2)) - (enemyStats.def * 0.4));
        dmg = Math.max(1, dmg);

        setEnemyHp(prev => Math.max(0, prev - dmg));
        setBattleLog(prev => [...prev, `You attacked! ${isCrit ? "Critical Hit! " : ""}${dmg} damage!`]);
        setShake(true);
        setTimeout(() => setShake(false), 300);

        checkWinCondition(enemyHp - dmg);
    };

    // 2. Magic Skill (Class Based)
    const handleMagic = () => {
        if (status !== 'player_turn' || !enemyStats) return;

        let cost = 5;
        let skillName = "Magic";
        let dmg = 0;

        // Class Logic
        if (playerStats.className === "Mage" || playerStats.className === "Legend") {
            cost = 8;
            skillName = "Fireball";
            dmg = Math.floor(playerStats.atk * 1.8); // High dmg ignore def
        } else if (playerStats.className === "Healer") {
            setBattleLog(prev => [...prev, "You have no offensive magic!"]);
            return;
        } else {
            skillName = "Power Strike"; // Warrior skill
            cost = 4;
            dmg = Math.floor(playerStats.atk * 1.3);
        }

        if (myMp < cost) {
            setBattleLog(prev => [...prev, "Not enough MP!"]);
            return;
        }

        playSfx("/assets/audio/sfx_click.wav");
        setMyMp(prev => prev - cost);
        setEnemyHp(prev => Math.max(0, prev - dmg));
        setBattleLog(prev => [...prev, `You used ${skillName}! ${dmg} damage!`]);
        setFlash(true);
        setTimeout(() => setFlash(false), 300);

        checkWinCondition(enemyHp - dmg);
    };

    // 3. Heal
    const handleHeal = () => {
        if (status !== 'player_turn') return;
        const cost = 5;
        if (myMp < cost) {
            setBattleLog(prev => [...prev, "Not enough MP!"]);
            return;
        }

        playSfx("/assets/audio/sfx_click.wav");
        const healAmount = Math.floor(playerStats.maxHp * 0.3);
        setMyHp(prev => Math.min(playerStats.maxHp, prev + healAmount));
        setMyMp(prev => prev - cost);
        setBattleLog(prev => [...prev, `You cast Heal! Recovered ${healAmount} HP.`]);

        endPlayerTurn();
    };

    // 4. Run
    const handleRun = () => {
        if (Math.random() > 0.4) {
            playSfx("/assets/audio/sfx_click.wav");
            setBattleLog(prev => [...prev, "You ran away safely!"]);
            setStatus('won'); // Treat as 'end' but maybe no reward?
            setTimeout(onClose, 1000);
        } else {
            setBattleLog(prev => [...prev, "Failed to run away!"]);
            endPlayerTurn();
        }
    };

    const checkWinCondition = async (currentEnemyHp: number) => {
        if (currentEnemyHp <= 0) {
            playSfx("/assets/audio/sfx_badge_get.wav");
            setStatus('won');

            // EXP Calculation
            const monsters = [
                { name: "Slime", baseHp: 30, baseAtk: 8, baseDef: 2, exp: 10 },
                { name: "Goblin", baseHp: 50, baseAtk: 12, baseDef: 5, exp: 20 },
                { name: "Wolf", baseHp: 40, baseAtk: 15, baseDef: 3, exp: 15 },
                { name: "Orc", baseHp: 80, baseAtk: 18, baseDef: 10, exp: 35 },
                { name: "Golem", baseHp: 120, baseAtk: 25, baseDef: 20, exp: 50 },
                { name: "Chimera", baseHp: 100, baseAtk: 22, baseDef: 12, exp: 45 },
                { name: "Dragon", baseHp: 200, baseAtk: 35, baseDef: 25, exp: 100 },
                { name: "Dark Knight", baseHp: 150, baseAtk: 30, baseDef: 22, exp: 80 },
            ];
            const baseExp = monsters.find(m => enemyStats?.name.includes(m.name))?.exp || 20;
            const gainedExp = Math.floor(baseExp * (enemyStats ? enemyStats.level / 2 : 1));

            setBattleLog(prev => [...prev, "VICTORY!", `Gained ${gainedExp} EXP!`]);

            // Call API to save EXP
            try {
                await fetch('/api/battle', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ exp: gainedExp })
                });
            } catch (e) {
                console.error("Failed to save EXP", e);
            }

        } else {
            endPlayerTurn();
        }
    };

    const endPlayerTurn = () => {
        setStatus('enemy_turn');
        setTimeout(enemyAction, 1000);
    };

    const enemyAction = () => {
        if (!enemyStats || status === 'won') return;

        // Enhanced AI Visuals
        const action = Math.random();
        let dmg = 0;
        let msg = "";

        if (action < 0.7) {
            // Attack
            dmg = Math.max(1, Math.floor((enemyStats.atk * 1.1) - (playerStats.def * 0.5)));
            msg = `${enemyStats.name} attacks! ${dmg} damage to you!`;
            // Visuals
            setFlash(true); // Red flash on player
        } else {
            // Strong Attack or Wait
            dmg = Math.max(1, Math.floor((enemyStats.atk * 1.5) - (playerStats.def * 0.5)));
            msg = `${enemyStats.name} uses Smash! ${dmg} damage!`;
            setFlash(true);
            setShake(true); // Big shake
        }

        playSfx("/assets/audio/sfx_click.wav"); // Hit sound (placeholder)

        setTimeout(() => { setFlash(false); setShake(false); }, 300);

        setMyHp(prev => {
            const newHp = prev - dmg;
            if (newHp <= 0) {
                setStatus('lost');
                setBattleLog(prev => [...prev, msg, "You have been defeated..."]);
            } else {
                setBattleLog(prev => [...prev, msg]);
                setStatus('player_turn'); // Back to player
            }
            return Math.max(0, newHp);
        });
    };


    // --- Render Helpers ---

    // Pixel Sprite Logic (Reusing same asset but shifting bg)
    const getEnemyStyle = () => {
        // Monster ID mapping for sprite sheet
        // 1=Slime, 2=Goblin, 3=Wolf? 4=Dragon
        let mId = 0;
        if (enemyStats?.name.includes("Slime")) mId = 0; // Top-Left?
        if (enemyStats?.name.includes("Goblin")) mId = 1;
        if (enemyStats?.name.includes("Dark")) mId = 2;
        if (enemyStats?.name.includes("Dragon")) mId = 3;

        // 2x2 Grid assumption on `enemy_sprites.png`
        const x = (mId % 2) * 100;
        const y = Math.floor(mId / 2) * 100;

        return {
            backgroundImage: 'url(/assets/enemy_sprites.png)',
            backgroundSize: '200% 200%',
            backgroundPosition: `${x}% ${y}%`,
            imageRendering: 'pixelated' as const,
        };
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black/90 flex flex-col items-center justify-center p-2 font-pixel">

            {/* Battle Container */}
            <div className={`relative w-full max-w-md aspect-[3/4] bg-[#16213e] border-4 border-white rounded-lg overflow-hidden flex flex-col ${flash ? 'animate-pulse bg-red-900' : ''}`}>

                {/* 1. Header (Enemy Name) */}
                <div className="bg-black/50 p-2 flex justify-between items-center border-b-2 border-white/20">
                    <span className="text-red-400 text-lg">{enemyStats?.name || "???"}</span>
                    <button onClick={onClose}><X className="text-gray-500 hover:text-white" /></button>
                </div>

                {/* 2. Visual Area (Enemy) */}
                <div className="flex-1 relative flex items-center justify-center bg-[url('/assets/battle-bg.png')] bg-cover bg-center">
                    {/* Enemy Sprite */}
                    {status !== 'intro' && (
                        <div
                            className={`w-32 h-32 transition-transform duration-100 ${shake ? 'translate-x-2' : ''} ${status === 'won' ? 'opacity-0 scale-50 transition-all duration-1000' : ''}`}
                            style={getEnemyStyle()}
                        />
                    )}

                    {/* Enemy HP Bar */}
                    {enemyStats && (
                        <div className="absolute top-4 right-4 w-32 bg-black border-2 border-white p-1">
                            <div className="h-2 bg-gray-700 w-full relative">
                                <div
                                    className="h-full bg-red-500 transition-all duration-300"
                                    style={{ width: `${(enemyHp / enemyStats.maxHp) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Player Status Area */}
                <div className="bg-[#0f3460] p-4 border-t-4 border-white grid grid-cols-2 gap-4">
                    <div className="border-r-2 border-white/20 pr-2">
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-yellow-400 text-sm">{playerStats.name}</span>
                            <span className="text-xs text-gray-400">Lv.{playerStats.level}</span>
                        </div>
                        {/* HP */}
                        <div className="flex items-center gap-1 text-xs mb-1">
                            <span className="w-6 font-bold">HP</span>
                            <div className="flex-1 bg-black h-3 border border-gray-500">
                                <div
                                    className="h-full bg-green-500 transition-all"
                                    style={{ width: `${(myHp / playerStats.maxHp) * 100}%` }}
                                />
                            </div>
                            <span className="w-8 text-right">{myHp}</span>
                        </div>
                        {/* MP */}
                        <div className="flex items-center gap-1 text-xs">
                            <span className="w-6 font-bold">MP</span>
                            <div className="flex-1 bg-black h-3 border border-gray-500">
                                <div
                                    className="h-full bg-blue-500 transition-all"
                                    style={{ width: `${(myMp / playerStats.maxMp) * 100}%` }}
                                />
                            </div>
                            <span className="w-8 text-right">{myMp}</span>
                        </div>
                    </div>

                    {/* Command Menu */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <button
                            disabled={status !== 'player_turn'}
                            onClick={handleAttack}
                            className="bg-gray-800 hover:bg-gray-700 border border-white/50 rounded flex flex-col items-center justify-center disabled:opacity-50"
                        >
                            <Sword className="w-4 h-4 mb-1 text-red-400" />
                            ATTACK
                        </button>
                        <button
                            disabled={status !== 'player_turn'}
                            onClick={handleMagic}
                            className="bg-gray-800 hover:bg-gray-700 border border-white/50 rounded flex flex-col items-center justify-center disabled:opacity-50"
                        >
                            <Flame className="w-4 h-4 mb-1 text-blue-400" />
                            MAGIC
                        </button>
                        <button
                            disabled={status !== 'player_turn'}
                            onClick={handleHeal}
                            className="bg-gray-800 hover:bg-gray-700 border border-white/50 rounded flex flex-col items-center justify-center disabled:opacity-50"
                        >
                            <Heart className="w-4 h-4 mb-1 text-green-400" />
                            HEAL
                        </button>
                        <button
                            disabled={status !== 'player_turn'}
                            onClick={handleRun}
                            className="bg-gray-800 hover:bg-gray-700 border border-white/50 rounded flex flex-col items-center justify-center disabled:opacity-50"
                        >
                            <Footprints className="w-4 h-4 mb-1 text-yellow-400" />
                            RUN
                        </button>
                    </div>
                </div>

                {/* 4. Log Window */}
                <div className="h-32 bg-black text-white p-4 font-mono text-xs overflow-y-auto border-t-2 border-white/20">
                    {battleLog.map((log, i) => (
                        <p key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0 animate-fade-in-up">
                            {log}
                        </p>
                    ))}
                    <div ref={logEndRef} />
                </div>
            </div>

            {/* Victory / Defeat Overlay */}
            {(status === 'won' || status === 'lost') && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className={`bg-white text-black p-6 rounded-lg text-center border-4 ${status === 'won' ? 'border-yellow-400' : 'border-gray-500'} max-w-xs w-full shadow-2xl`}>
                        <h2 className="text-3xl font-black mb-4 pixel-text tracking-widest">
                            {status === 'won' ? 'YOU WIN!' : 'GAME OVER'}
                        </h2>

                        {status === 'won' && enemyStats && (
                            <SocialShare
                                text={`【白山バッジクエスト】${playerStats.name} (Lv.${playerStats.level}) defeated ${enemyStats.name}! #HakusanBadgeQuest`}
                                url="https://hakusan-badge-quest.dev"
                                hashtags={["RPG", "Hakusan", "Geopark"]}
                            />
                        )}

                        <button
                            onClick={onClose}
                            className="mt-6 w-full py-3 bg-gray-900 text-white font-bold rounded hover:scale-105 transition-transform"
                        >
                            CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
