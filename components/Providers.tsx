"use client";

import { AudioProvider, useAudio } from "@/lib/audio-context";
import { useEffect } from "react";
import AudioControl from "@/components/AudioControl";

function AudioInitializer() {
    const { playBgm } = useAudio();
    useEffect(() => {
        // Start Main BGM
        playBgm("/assets/audio/bgm_main.m4a");
    }, [playBgm]);
    return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AudioProvider>
            <AudioInitializer />
            {children}
            <AudioControl />
        </AudioProvider>
    );
}
