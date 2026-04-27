import { getRequestContext } from '@cloudflare/next-on-pages';
import { User, Badge, UserBadge } from './types';

export interface Env {
    DB: D1Database;
}

// Helper to get DB from the context (Next.js Edge Runtime / Pages Functions)
export const getDb = (env: any): D1Database => {
    // 1. Try Cloudflare Context (Latest Next-on-Pages)
    try {
        const rc = getRequestContext();
        if (rc?.env?.DB) {
            return rc.env.DB;
        }
    } catch (e) {
        // Fallback for non-edge or build time
    }

    // 2. Fallback to passed env or process.env
    const targetEnv = env || (typeof process !== 'undefined' ? process.env : {});
    if (targetEnv.DB) {
        return targetEnv.DB;
    }

    const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
    if (isDev) {
        // Mock DB for local dev if cloudflare env not present
        return {
            prepare: (query: string) => {
                // ... (rest of mock remains same)
                return {
                    bind: (...args: any[]) => ({
                        first: async () => null,
                        all: async () => ({ results: [] }),
                        run: async () => ({ success: true }),
                    }),
                    first: async () => null,
                    all: async () => ({ results: [] }),
                    run: async () => ({ success: true }),
                } as any;
            },
            batch: async () => [],
            exec: async () => { },
            dump: async () => new ArrayBuffer(0),
        } as any;
    }
    
    // Final fallback (might return undefined, which then causes clear errors)
    return targetEnv.DB;
};

// User Operations
export const getUser = async (db: D1Database, id: string): Promise<User | null> => {
    return await db.prepare('SELECT * FROM Users WHERE userId = ?').bind(id).first<User>();
};

export const createUser = async (db: D1Database, user: User): Promise<boolean> => {
    const { success } = await db.prepare(
        'INSERT INTO Users (userId, avatarId, createdAt) VALUES (?, ?, ?)'
    ).bind(user.id, user.avatarId || 1, user.createdAt).run();
    return success;
};



export const addExp = async (db: D1Database, userId: string, amount: number): Promise<boolean> => {
    // Current EXP handling needs to be atomic ideally, but simple update works for MVP
    const { success } = await db.prepare(
        'UPDATE Users SET exp = COALESCE(exp, 0) + ? WHERE userId = ?'
    ).bind(amount, userId).run();
    return success;
};

export const updateUserChallenge = async (db: D1Database, userId: string, challenge: string): Promise<boolean> => {
    const { success } = await db.prepare(
        'UPDATE Users SET currentChallenge = ? WHERE userId = ?'
    ).bind(challenge, userId).run();
    return success;
};
