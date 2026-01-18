import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { claimBadge } from '@/lib/badge-logic';
import { getSession } from '@/lib/session';

export const runtime = 'edge';

// We need a proper route handler for the claim action, mostly likely a POST
// But the NFC tag will likely lead to a GET page /claim/[badgeId]
// So looking at the page is what triggers it or provides a button to trigger it.

// Let's make an API route for the actual claiming to keep it clean: /api/claim
export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { badgeId } = await req.json();
    if (!badgeId) {
        return NextResponse.json({ error: 'Missing badgeId' }, { status: 400 });
    }

    // Retrieve D1 from env (assumes Context or process.env wiring)
    const { DB } = process.env as any;

    try {
        const result = await claimBadge(DB, session.userId, badgeId);
        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Claim failed' }, { status: 500 });
    }
}
