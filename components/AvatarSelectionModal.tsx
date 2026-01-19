"use client";

import { useAudio } from "@/lib/audio-context";
import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";

interface AvatarSelectionModalProps {
    currentAvatarId: number;
    onSelect: (id: number) => void;
    onClose: () => void;
}

export default function AvatarSelectionModal({ currentAvatarId, onSelect, onClose }: AvatarSelectionModalProps) {
    const { playSfx } = useAudio();
    const [selected, setSelected] = useState(currentAvatarId);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

    const avatars = [1, 2, 3, 4];

    const handleSave = async () => {
        playSfx("/assets/audio/sfx_click.wav");
        setStatus('saving');

        try {
            const res = await fetch('/api/avatar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avatarId: selected }),
            });

            if (res.ok) {
                setStatus('success');
                onSelect(selected);
                setTimeout(onClose, 800);
            } else {
                alert("Failed to save avatar");
                setStatus('idle');
            }
        } catch (e) {
            console.error(e);
            setStatus('idle');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 animate-fade-in p-4">
            <div className="retro-container bg-[#1a1a2e] border-white max-w-sm w-full relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-white">
                    <X />
                </button>

                <h2 className="text-xl text-center text-[#e94560] pixel-text mb-6">SELECT AVATAR</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {avatars.map((id) => {
                        // CSS Sprite Logic (2x2 Grid)
                        const x = (id - 1) % 2 === 0 ? '0%' : '100%';
                        const y = id <= 2 ? '0%' : '100%';

                        return (
                            <button
                                key={id}
                                onClick={() => {
                                    playSfx("/assets/audio/sfx_click.wav");
                                    setSelected(id);
                                }}
                                className={`relative aspect-square border-4 rounded-lg overflow-hidden transition-all bg-white group ${selected === id ? 'border-yellow-400 scale-105 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-gray-700 hover:border-gray-500'}`}
                            >
                                <div
                                    className="w-full h-full pixelated"
                                    style={{
                                        backgroundImage: 'url(/assets/avatars_sheet.png)',
                                        backgroundSize: '200% 200%',
                                        backgroundPosition: `${x} ${y}`,
                                        imageRendering: 'pixelated'
                                    }}
                                />
                                {selected === id && (
                                    <div className="absolute top-1 right-1 bg-yellow-400 text-black rounded-full p-0.5 z-10">
                                        <Check className="w-3 h-3" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={handleSave}
                    disabled={status !== 'idle'}
                    className={`w-full py-3 pixel-text text-lg border-2 border-white/50 rounded transition-all ${status === 'success' ? 'bg-green-500 text-white' : 'bg-[#e94560] text-white hover:bg-[#c23b50]'}`}
                >
                    {status === 'saving' ? 'SAVING...' : status === 'success' ? 'SAVED!' : 'CONFIRM'}
                </button>
            </div>
        </div>
    );
}
