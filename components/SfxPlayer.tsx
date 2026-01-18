"use client";

import { useAudio } from "@/lib/audio-context";
import { useEffect } from "react";

export default function SfxPlayer({ sound }: { sound: "get" | "click" }) {
    const { playSfx } = useAudio();

    useEffect(() => {
        if (sound === "get") {
            playSfx("/assets/audio/sfx_badge_get.mp3");
        } else if (sound === "click") {
            playSfx("/assets/audio/sfx_click.mp3");
        }
    }, [sound, playSfx]);

    return null;
}
