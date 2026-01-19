"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { TOWNS } from '@/lib/towns';
import { useAudio } from '@/lib/audio-context';
import SfxPlayer from "@/components/SfxPlayer";
import SocialShare from '@/components/SocialShare';

export const runtime = 'edge';

export default function ClaimPage() {
    const params = useParams();
    const router = useRouter();
    const { badgeId } = params as { badgeId: string };

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [badgeData, setBadgeData] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!badgeId) return;

        const verifyAndClaim = async () => {
            try {
                // 1. Find badge data locally first for UI
                const town = TOWNS.find(t => t.id === badgeId);
                if (town) {
                    setBadgeData(town);
                }

                // 2. Call API to claim
                const res = await fetch('/api/claim', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ badgeId }),
                });

                if (!res.ok) {
                    const data: any = await res.json();
                    throw new Error(data.error || 'Claim failed');
                }

                // Success
                setStatus('success');
            } catch (err: any) {
                console.error(err);
                setErrorMsg(err.message);
                setStatus('error');
            }
        };

        // Simulate a small delay for dramatic effect if needed, or just run
        setTimeout(verifyAndClaim, 1500);

    }, [badgeId]);

    const handleReturn = () => {
        router.push('/profile');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#1a1a2e]">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/assets/map-bg.png')] opacity-10 blur-sm bg-cover bg-center"></div>

            <div className="z-10 w-full max-w-sm">

                {status === 'verifying' && (
                    <div className="retro-container text-center space-y-8 animate-pulse">
                        <h2 className="text-xl text-white pixel-text">VERIFYING LOCATION...</h2>
                        <div className="w-16 h-16 mx-auto border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-sm">Do not move away from the spot.</p>
                    </div>
                )}

                {status === 'success' && badgeData && (
                    <div className="retro-container text-center space-y-6 animate-fade-in-up border-[#e94560]">
                        <SfxPlayer sound="get" />
                        <div className="relative">
                            <h1 className="text-3xl font-bold text-[#e94560] pixel-text animate-bounce">BADGE GET!</h1>
                            <div className="absolute -top-4 -right-4 text-yellow-400 animate-ping">★</div>
                        </div>

                        <div className="relative w-48 h-48 mx-auto my-6">
                            <div className="absolute inset-0 bg-yellow-500/30 rounded-full animate-ping opacity-50"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-full"></div>
                            {/* Circular Mask Processing for consistency */}
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#e94560] bg-black/40 shadow-[0_0_20px_#e94560]">
                                <Image
                                    src={`/assets/badges/${badgeData.badgeImage}`}
                                    alt={badgeData.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 bg-black/40 p-4 rounded text-left border border-white/20">
                            <p className="text-xl text-white font-bold">{badgeData.name}</p>
                            <p className="text-sm text-[#e94560] font-bold">{badgeData.realSpotName}</p>
                            <p className="text-sm text-gray-300">{badgeData.description}</p>
                        </div>

                        {/* Social Share */}
                        <SocialShare
                            text={`I found the ${badgeData.realSpotName} badge in Hakusan Geopark!`}
                            url={`https://hakusan-quest.pages.dev/claim/${badgeData.id}`}
                        />

                        <button
                            onClick={handleReturn}
                            className="w-full py-4 text-lg bg-[#e94560] text-white border-2 border-white hover:bg-[#c23b50] active:scale-95 transition-transform pixel-text shadow-[4px_4px_0px_0px_#000]"
                        >
                            SAVE & RETURN
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="retro-container text-center space-y-6 border-red-500">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <h2 className="text-xl text-red-400 pixel-text">CLAIM FAILED</h2>
                        <p className="text-sm text-gray-300">{errorMsg || "Could not verify location."}</p>
                        <Link
                            href="/profile"
                            className="block w-full py-3 bg-gray-700 text-white border-2 border-gray-500 hover:bg-gray-600 pixel-text"
                        >
                            RETURN
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
