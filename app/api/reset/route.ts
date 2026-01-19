import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { env } = process;
    const db = getDb(env);

    try {
        await db.prepare('DELETE FROM UserBadges WHERE userId = ?')
            .bind(session.userId)
            .run();

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to reset' }, { status: 500 });
    }
}
