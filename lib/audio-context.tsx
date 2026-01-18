"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type AudioContextType = {
    playBgm: (src: string) => void;
    playSfx: (src: string) => void;
    stopBgm: () => void;
    toggleMute: () => void;
    isMuted: boolean;
    isPlaying: boolean;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(true); // Default mute for auto-play policy
    const [currentBgm, setCurrentBgm] = useState<string | null>(null);
    const bgmRef = useRef<HTMLAudioElement | null>(null);
    const sfxRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Initialize Audio Elements
        bgmRef.current = new Audio();
        bgmRef.current.loop = true;
        sfxRef.current = new Audio();

        return () => {
            if (bgmRef.current) {
                bgmRef.current.pause();
                bgmRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (bgmRef.current) {
            bgmRef.current.muted = isMuted;
        }
        if (sfxRef.current) {
            sfxRef.current.muted = isMuted;
        }
    }, [isMuted]);

    const playBgm = (src: string) => {
        if (!bgmRef.current) return;
        if (currentBgm === src && isPlaying) return;

        bgmRef.current.src = src;
        bgmRef.current.volume = 0.3; // Lower volume for BGM

        // Auto-play might fail if no interaction
        bgmRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => console.warn("Audio play failed (policy):", e));

        setCurrentBgm(src);
    };

    const stopBgm = () => {
        if (bgmRef.current) {
            bgmRef.current.pause();
            setIsPlaying(false);
        }
    };

    const playSfx = (src: string) => {
        // Create new instance for overlapping SFX
        const sfx = new Audio(src);
        sfx.volume = 0.6;
        sfx.muted = isMuted;
        sfx.play().catch(e => console.warn("SFX play failed:", e));
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
        // If unmuting and we have a current BGM that should be playing, try playing it
        if (isMuted && currentBgm && bgmRef.current) {
            bgmRef.current.play().catch(e => console.warn("Resume failed", e));
            setIsPlaying(true);
        }
    };

    return (
        <AudioContext.Provider value={{ playBgm, playSfx, stopBgm, toggleMute, isMuted, isPlaying }}>
            {children}
        </AudioContext.Provider>
    );
}

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
