"use strict";
import { Share2, Link as LinkIcon, Twitter, Facebook } from 'lucide-react';
import { useState } from 'react';

// Simple Icons doesn't have a Lucide react component for LINE/X, so we use custom or generic.
// Using generic buttons with text labels for clarity.

interface SocialShareProps {
    text: string;
    url: string;
    hashtags?: string[];
}

export default function SocialShare({ text, url, hashtags = ["HakusanBadgeQuest", "HakusanGeopark"] }: SocialShareProps) {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);
    const encodedTags = encodeURIComponent(hashtags.join(','));
    const [copied, setCopied] = useState(false);

    const shareLinks = {
        x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${encodedTags}`,
        line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`, // LINE shares URL primarily
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${text} ${url}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <p className="text-white text-sm pixel-text mb-2">SHARE YOUR DISCOVERY</p>
            <div className="flex flex-wrap justify-center gap-3">
                {/* X (Twitter) */}
                <a
                    href={shareLinks.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-black text-white hover:bg-gray-800 rounded-full border border-gray-600 transition-transform hover:scale-110 flex items-center justify-center w-12 h-12"
                    aria-label="Share on X"
                >
                    <span className="font-bold text-lg">𝕏</span>
                </a>

                {/* LINE */}
                <a
                    href={shareLinks.line}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#06C755] text-white hover:bg-[#05b34c] rounded-full border border-transparent transition-transform hover:scale-110 flex items-center justify-center w-12 h-12"
                    aria-label="Share on LINE"
                >
                    <span className="font-bold text-sm">LINE</span>
                </a>

                {/* Facebook */}
                <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#1877F2] text-white hover:bg-[#166fe5] rounded-full border border-transparent transition-transform hover:scale-110 flex items-center justify-center w-12 h-12"
                    aria-label="Share on Facebook"
                >
                    <span className="font-bold text-lg">f</span>
                </a>

                {/* Copy Link */}
                <button
                    onClick={handleCopy}
                    className="p-3 bg-gray-700 text-white hover:bg-gray-600 rounded-full border border-gray-500 transition-transform hover:scale-110 flex items-center justify-center w-12 h-12 relative"
                    aria-label="Copy to Clipboard"
                >
                    <LinkIcon className="w-5 h-5" />
                    {copied && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-white text-black px-2 py-1 rounded pixel-text whitespace-nowrap">
                            COPIED!
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
