import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getUserBadges } from '@/lib/badge-logic'; // We need to export this wrapper or use raw DB

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Safe Env Access
    const env = typeof process !== 'undefined' ? process.env : {};
    const { DB } = env as any;

    try {
        // Retrieve unlocked badges
        const badges = await getUserBadges(DB, session.userId);

        return NextResponse.json({
            userId: session.userId,
            badges: badges
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Profile Load Failed' }, { status: 500 });
    }
}
