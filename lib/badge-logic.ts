import { User, Badge, UserBadge } from './types';
import { getDb, createUser } from './db';

// Badge Claiming Logic
import { TOWNS } from './towns';
// ... imports

export const claimBadge = async (db: D1Database, userId: string, badgeId: string): Promise<{ success: boolean; isNew: boolean; badge?: any }> => {
    // 1. Check if user already has badge (In mock, always returns null -> allows claim)
    try {
        const stmt = db.prepare('SELECT * FROM UserBadges WHERE userId = ? AND badgeId = ?');
        const existing = await stmt.bind(userId, badgeId).first();
        if (existing) {
            return { success: true, isNew: false };
        }
    } catch (e) {
        console.warn("DB Read Error (likely local mock):", e);
    }

    // 2. Award Badge
    try {
        await db.prepare('INSERT INTO UserBadges (userId, badgeId, acquiredAt) VALUES (?, ?, ?)').bind(userId, badgeId, Date.now()).run();
    } catch (e) {
        console.warn("DB Write Error (likely local mock):", e);
    }

    // 3. Fetch Badge Details for display
    // Fallback to static TOWNS data if DB is empty or fails
    const staticBadge = TOWNS.find(t => t.id === badgeId);
    return { success: true, isNew: true, badge: staticBadge };
};

export const getUserBadges = async (db: D1Database, userId: string): Promise<string[]> => {
    const results = await db.prepare(
        'SELECT badgeId FROM UserBadges WHERE userId = ?'
    ).bind(userId).all<{ badgeId: string }>();

    return results.results.map(r => r.badgeId);
};
