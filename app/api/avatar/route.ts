import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    console.log("AVATAR_API_DEBUG: Request received " + new Date().toISOString());
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: any = await req.json();
    const { avatarId } = body;
    if (!avatarId || typeof avatarId !== 'number') {
        return NextResponse.json({ error: 'Invalid Avatar ID' }, { status: 400 });
    }

    const env = typeof process !== 'undefined' ? process.env : {};
    const db = getDb(env);

    if (!db) {
        console.error("Database connection failed: db is undefined");
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    try {
        await db.prepare(`
            INSERT INTO Users (id, avatarId, created_at) 
            VALUES (?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET avatarId = excluded.avatarId
        `)
            .bind(session.userId, avatarId, Date.now())
            .run();

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Avatar save error:", e);
        return NextResponse.json({
            error: e.message || 'Failed to update avatar',
            stack: e.stack
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ avatarId: 1 });

    const env = typeof process !== 'undefined' ? process.env : {};
    const db = getDb(env);

    try {
        const user: any = await db.prepare('SELECT avatarId FROM Users WHERE id = ?')
            .bind(session.userId)
            .first();

        return NextResponse.json({ avatarId: user?.avatarId || 1 });
    } catch (e) {
        return NextResponse.json({ avatarId: 1 });
    }
}
