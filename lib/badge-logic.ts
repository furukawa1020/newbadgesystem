import { User, Badge, UserBadge } from './types';
import { getDb, createUser } from './db';

// Badge Claiming Logic
import { TOWNS } from './towns';
// ... imports

export const claimBadge = async (db: D1Database, userId: string, badgeId: string): Promise<{ success: boolean; isNew: boolean; badge?: any; totalCount?: number }> => {
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
    // DB write errors should NOT be swallowed, so we remove the silent try-catch or rethrow.
    // Fixed column name from 'acquiredAt' to 'claimedAt' to match schema.sql
    try {
        await db.prepare('INSERT INTO UserBadges (userId, badgeId, claimedAt) VALUES (?, ?, ?)').bind(userId, badgeId, Date.now()).run();
    } catch (e: any) {
        console.error("DB Write Error:", e);
        // If it's a conflict (already has badge), we can ignore, but other errors should probably fail the request?
        // Actually, if we want the user to know it failed, we should throw.
        // But if it's just a constraint error, maybe they effectively "have" it.
        // Let's assume re-throw for now to debug the "not acquiring" issue.
        throw e;
    }

    // 3. Fetch Badge Details & Total Count
    // Fallback to static TOWNS data if DB is empty or fails
    const staticBadge = TOWNS.find(t => t.id === badgeId);

    // Get new total count
    let totalCount = 1;
    try {
        const countRes = await db.prepare('SELECT COUNT(*) as count FROM UserBadges WHERE userId = ?').bind(userId).first<{ count: number }>();
        totalCount = countRes?.count || 1;
    } catch (e) { }

    return { success: true, isNew: true, badge: staticBadge, totalCount };
};

export const getUserBadges = async (db: D1Database, userId: string): Promise<string[]> => {
    const results = await db.prepare(
        'SELECT badgeId FROM UserBadges WHERE userId = ?'
    ).bind(userId).all<{ badgeId: string }>();

    return results.results.map(r => r.badgeId);
};
