export interface User {
    id: string;
    username?: string;
    avatarId?: number; // Added to match DB schema
    exp?: number;
    currentChallenge?: string;
    public_key_credentials?: string; // JSON string of AuthenticatorTransportFuture[]
    createdAt: number;
}

export interface Badge {
    id: string;
    name: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    description: string;
    imageUrl: string;
    location: {
        lat: number;
        lng: number;
    };
}

export interface UserBadge {
    userId: string;
    badgeId: string;
    acquiredAt: number;
}
