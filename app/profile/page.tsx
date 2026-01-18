"use client";

import { useEffect, useState } from "react";

export default function Profile() {
    const [deviceId, setDeviceId] = useState<string | null>(null);

    useEffect(() => {
        // In a real app, we'd fetch the full profile from API using the Cookie.
        // Here we just check the localStorage flag for visual confirmation.
        setDeviceId(localStorage.getItem('hakusan_device_id'));
    }, []);

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white p-6 font-pixel">
            <div className="retro-container space-y-4">
                <h1 className="text-2xl text-[#e94560] pixel-text text-center">TRAINER CARD</h1>

                <div className="space-y-2 text-sm pixel-text text-gray-300">
                    <p>NAME: GUEST TRAINER</p>
                    <p>ID: {deviceId ? deviceId.slice(0, 8) + "..." : "LOADING..."}</p>
                    <p>RANK: ROOKIE</p>
                </div>

                <div className="border-t-2 border-white/20 py-4">
                    <p className="text-center text-xs text-gray-500 mb-2">BADGES</p>
                    <div className="grid grid-cols-4 gap-2">
                        {/* Empty Slots */}
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-900 border-2 border-gray-700 rounded-sm"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
