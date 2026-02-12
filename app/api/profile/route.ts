import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getUserBadges } from '@/lib/badge-logic';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Safe Env Access for Edge
    const env = typeof process !== 'undefined' ? process.env : {};
    const db = getDb(env);

    try {
        // Retrieve D1 DB from helper (handles safe access)
        const { DB } = env as any;
        // Note: getDb handles the mock/real logic, but getUserBadges takes DB directly.
        // We should really pass the 'db' object returned by getDb, but getUserBadges expects D1Database.
        // In Cloudflare, db IS D1Database. In local mock, it's the mock object.
        // Let's rely on getDb's return value.

        const badges = await getUserBadges(db, session.userId);
        // NEW: Fetch User details for EXP
        const user = await db.prepare('SELECT * FROM Users WHERE userId = ?').bind(session.userId).first<any>();

        return NextResponse.json({
            userId: session.userId,
            badges: badges,
            exp: user?.exp || 0
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Profile Load Failed' }, { status: 500 });
    }
}
