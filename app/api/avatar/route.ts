import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: any = await req.json();
    const { avatarId } = body;
    if (!avatarId || typeof avatarId !== 'number') {
        return NextResponse.json({ error: 'Invalid Avatar ID' }, { status: 400 });
    }

    const { env } = process;
    const db = getDb(env);

    try {
        // Upsert User
        await db.prepare(`
            INSERT INTO Users (userId, avatarId, createdAt) 
            VALUES (?, ?, ?)
            ON CONFLICT(userId) DO UPDATE SET avatarId = excluded.avatarId
        `)
            .bind(session.userId, avatarId, Date.now())
            .run();

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ avatarId: 1 }); // Default

    const { env } = process;
    const db = getDb(env);

    try {
        const user = await db.prepare('SELECT avatarId FROM Users WHERE userId = ?')
            .bind(session.userId)
            .first();

        return NextResponse.json({ avatarId: user?.avatarId || 1 });
    } catch (e) {
        return NextResponse.json({ avatarId: 1 });
    }
}
