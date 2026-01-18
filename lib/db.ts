import { User, Badge, UserBadge } from './types';

export interface Env {
    DB: D1Database;
}

// Helper to get DB from the context (Next.js Edge Runtime / Pages Functions)
export const getDb = (env: Env) => {
    return env.DB;
};

// User Operations
export const getUser = async (db: D1Database, id: string): Promise<User | null> => {
    return await db.prepare('SELECT * FROM Users WHERE id = ?').bind(id).first<User>();
};

export const createUser = async (db: D1Database, user: User): Promise<boolean> => {
    const { success } = await db.prepare(
        'INSERT INTO Users (id, username, created_at) VALUES (?, ?, ?)'
    ).bind(user.id, user.username || null, user.createdAt).run();
    return success;
};

export const updateUserChallenge = async (db: D1Database, userId: string, challenge: string): Promise<boolean> => {
    const { success } = await db.prepare(
        'UPDATE Users SET currentChallenge = ? WHERE id = ?'
    ).bind(challenge, userId).run();
    return success;
};
