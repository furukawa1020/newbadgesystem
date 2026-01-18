"use client";

import { useAudio } from "@/lib/audio-context";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioControl() {
    const { isMuted, toggleMute } = useAudio();

    return (
        <button
            onClick={toggleMute}
            className="fixed top-4 right-4 z-50 p-2 bg-black/50 backdrop-blur rounded-full border border-white/30 text-white hover:bg-black/70 transition-all"
        >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
    );
}
