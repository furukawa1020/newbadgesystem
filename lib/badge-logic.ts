import { User, Badge, UserBadge } from './types';
import { getDb, createUser } from './db';

// Badge Claiming Logic
export const claimBadge = async (db: D1Database, userId: string, badgeId: string): Promise<{ success: boolean; isNew: boolean; badge?: Badge }> => {
    // 1. Check if user already has badge
    const existing = await db.prepare(
        'SELECT * FROM UserBadges WHERE userId = ? AND badgeId = ?'
    ).bind(userId, badgeId).first();

    if (existing) {
        return { success: true, isNew: false };
    }

    // 2. Award Badge
    const { success } = await db.prepare(
        'INSERT INTO UserBadges (userId, badgeId, acquiredAt) VALUES (?, ?, ?)'
    ).bind(userId, badgeId, Date.now()).run();

    if (!success) return { success: false, isNew: false };

    // 3. Fetch Badge Details for display
    const badge = await db.prepare('SELECT * FROM Badges WHERE id = ?').bind(badgeId).first<Badge>();

    return { success: true, isNew: true, badge };
};

export const getUserBadges = async (db: D1Database, userId: string): Promise<string[]> => {
    const results = await db.prepare(
        'SELECT badgeId FROM UserBadges WHERE userId = ?'
    ).bind(userId).all<{ badgeId: string }>();

    return results.results.map(r => r.badgeId);
};
