"use client";

import { useState, useEffect } from "react";
import { X, Sword, Shield, Skull } from "lucide-react";
import { useAudio } from "@/lib/audio-context";
import Image from "next/image";
import SocialShare from "@/components/SocialShare";

interface BattleStats {
    name: string;
    hp: number;
    atk: number;
    def: number;
    className: string;
    level: number;
}

interface BattleModalProps {
    playerStats: BattleStats;
    onClose: () => void;
}

export default function BattleModal({ playerStats, onClose }: BattleModalProps) {
    const { playSfx } = useAudio();
    const [battleLog, setBattleLog] = useState<string[]>(["Battle Start!"]);
    const [enemyStats, setEnemyStats] = useState<BattleStats | null>(null);
    const [playerHp, setPlayerHp] = useState(playerStats.hp);
    const [enemyHp, setEnemyHp] = useState(0);
    const [turn, setTurn] = useState(0);
    const [status, setStatus] = useState<'intro' | 'fighting' | 'won' | 'lost'>('intro');
    const [shake, setShake] = useState(false);

    // Initial Enemy Generation
    useEffect(() => {
        const difficulty = Math.random() > 0.5 ? 1.0 : 1.2; // 50% chance of strong enemy
        const enemyLevel = Math.max(1, Math.floor(playerStats.level * difficulty));

        const monsters = [
            { name: "Slime", baseHp: 30, baseAtk: 10, baseDef: 5 },
            { name: "Goblin", baseHp: 50, baseAtk: 15, baseDef: 8 },
            { name: "Dragon", baseHp: 100, baseAtk: 30, baseDef: 20 },
            { name: "Dark Knight", baseHp: 80, baseAtk: 25, baseDef: 25 },
        ];

        // Pick monster based on level (roughly)
        let monster = monsters[0];
        if (enemyLevel > 3) monster = monsters[1];
        if (enemyLevel > 6) monster = monsters[3];
        if (enemyLevel > 8) monster = monsters[2];

        const eStats = {
            name: `${monster.name} Lv.${enemyLevel}`,
            hp: monster.baseHp + (enemyLevel * 10),
            atk: monster.baseAtk + (enemyLevel * 2),
            def: monster.baseDef + (enemyLevel * 1),
            className: "Monster",
            level: enemyLevel
        };

        setEnemyStats(eStats);
        setEnemyHp(eStats.hp);

        setTimeout(() => {
            setBattleLog(prev => [...prev, `Wild ${eStats.name} appeared!`]);
            setStatus('fighting');
        }, 1000);
    }, [playerStats]);

    // Battle Loop (Effects only)
    useEffect(() => {
        if (status !== 'fighting' || !enemyStats) return;

        const timer = setTimeout(() => {
            // Player Turn
            if (turn % 2 === 0) {
                const dmg = Math.max(1, Math.floor((playerStats.atk * (1 + Math.random() * 0.2)) - (enemyStats.def * 0.5)));
                setEnemyHp(prev => Math.max(0, prev - dmg));
                setBattleLog(prev => [...prev, `You hit ${enemyStats.name} for ${dmg} dmg!`]);
                setShake(true); // Enemy shake effect (visual only)
                playSfx("/assets/audio/sfx_click.wav"); // Reuse click as hit sound for now

                if (enemyHp - dmg <= 0) {
                    setStatus('won');
                    setBattleLog(prev => [...prev, "VICTORY!"]);
                    playSfx("/assets/audio/sfx_badge_get.wav");
                }
            }
            // Enemy Turn
            else {
                const dmg = Math.max(1, Math.floor((enemyStats.atk * (1 + Math.random() * 0.2)) - (playerStats.def * 0.5)));
                setPlayerHp(prev => Math.max(0, prev - dmg));
                setBattleLog(prev => [...prev, `${enemyStats.name} hits you for ${dmg} dmg!`]);

                if (playerHp - dmg <= 0) {
                    setStatus('lost');
                    setBattleLog(prev => [...prev, "DEFEATED..."]);
                }
            }
            setTurn(prev => prev + 1);
            setTimeout(() => setShake(false), 200);

        }, 1500); // Turn speed

        return () => clearTimeout(timer);
    }, [turn, status, enemyStats, playerStats, playerHp, enemyHp, playSfx]);

    // Scroll log
    useEffect(() => {
        const log = document.getElementById('battle-log');
        if (log) log.scrollTop = log.scrollHeight;
    }, [battleLog]);

    if (!enemyStats) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 animate-fade-in p-4 font-pixel">
            <div className="w-full max-w-sm space-y-4">

                {/* Header */}
                <div className="flex justify-between items-center text-white">
                    <h2 className="text-xl text-[#e94560] animate-pulse">BATTLE</h2>
                    <button onClick={onClose} className="p-2 hover:text-gray-400"><X /></button>
                </div>

                {/* Battle Arena */}
                <div className="bg-gray-800 rounded-lg p-6 border-4 border-gray-600 relative overflow-hidden min-h-[300px] flex flex-col justify-between">

                    {/* Enemy */}
                    <div className={`text-center space-y-2 transition-transform ${shake && turn % 2 !== 0 ? 'translate-x-2' : ''}`}>
                        <div className="w-24 h-24 mx-auto bg-gray-900 rounded-full flex items-center justify-center relative border-2 border-red-500 overflow-hidden">
                            {/* Pixel Art Sprite */}
                            <div
                                className="w-full h-full pixelated"
                                style={{
                                    backgroundImage: 'url(/assets/enemy_sprites.png)',
                                    backgroundSize: '200% 200%',
                                    backgroundPosition:
                                        enemyStats.name.includes("Slime") ? '0% 0%' :
                                            enemyStats.name.includes("Goblin") ? '100% 0%' :
                                                enemyStats.name.includes("Dark Knight") ? '0% 100%' :
                                                    '100% 100%', // Dragon
                                    imageRendering: 'pixelated'
                                }}
                            />
                            {status === 'won' && <div className="absolute text-yellow-400 font-bold text-2xl -top-4 right-0 animate-bounce">WIN!</div>}
                        </div>
                        <div>
                            <p className="text-red-400 font-bold">{enemyStats.name}</p>
                            <div className="w-full bg-gray-700 h-2 mt-1 rounded-full overflow-hidden">
                                <div
                                    className="bg-red-500 h-full transition-all duration-500"
                                    style={{ width: `${(enemyHp / enemyStats.hp) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* VS */}
                    <div className="text-center text-gray-500 text-xs my-4">- VS -</div>

                    {/* Player */}
                    <div className={`text-center space-y-2 transition-transform ${shake && turn % 2 === 0 ? 'translate-x-[-5px]' : ''}`}>
                        <div>
                            <p className="text-blue-400 font-bold">{playerStats.name} <span className="text-xs text-white">({playerStats.className})</span></p>
                            <div className="w-full bg-gray-700 h-2 mt-1 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full transition-all duration-500"
                                    style={{ width: `${(playerHp / playerStats.hp) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-center gap-4 text-xs mt-1 text-gray-300">
                                <span>HP {playerHp}/{playerStats.hp}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Log */}
                <div
                    id="battle-log"
                    className="bg-black border-2 border-white/20 p-2 h-32 overflow-y-auto font-mono text-xs text-green-400 space-y-1 rounded shadow-inner"
                >
                    {battleLog.map((log, i) => (
                        <p key={i} className="animate-fade-in">&gt; {log}</p>
                    ))}
                    {(status === 'won' || status === 'lost') && (
                        <div className="space-y-4 mt-2">
                            {status === 'won' && enemyStats && (
                                <SocialShare
                                    text={`【白山NFCクエスト】Lv.${enemyStats.level}の${enemyStats.name.split(' ')[0]}を倒した！ (プレイヤー: Lv.${playerStats.level} ${playerStats.className})`}
                                    url="https://hakusan-badge-quest.dev/"
                                    hashtags={["白山NFCクエスト", "白山手取川ジオパーク"]}
                                />
                            )}
                            <div className="text-center">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-white text-black hover:bg-gray-200 animate-bounce"
                                >
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
