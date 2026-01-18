import { User, Badge, UserBadge } from './types';

export interface Env {
    DB: D1Database;
}

// Helper to get DB from the context (Next.js Edge Runtime / Pages Functions)
export const getDb = (env: any): D1Database => {
    if (process.env.NODE_ENV === 'development' && !env.DB) {
        // Mock DB for local dev if cloudflare env not present
        return {
            prepare: (query: string) => {
                // Return a mock statement
                return {
                    bind: (...args: any[]) => ({
                        first: async () => null, // Simulate "not found" for checks
                        all: async () => ({ results: [] }),
                        run: async () => ({ success: true }), // Simulate success
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
