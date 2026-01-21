"use client";

import { useAudio } from "@/lib/audio-context";
import { useEffect } from "react";

export default function SfxPlayer({ sound }: { sound: "get" | "click" }) {
    const { playSfx } = useAudio();

    useEffect(() => {
        if (sound === "get") {
            playSfx("/assets/audio/sfx_badge_get.wav");
        } else if (sound === "click") {
            playSfx("/assets/audio/sfx_click.wav");
        }
    }, [sound, playSfx]);

    return null;
}
