import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { claimBadge } from '@/lib/badge-logic';
import { getSession } from '@/lib/session';
import { TOWNS } from '@/lib/towns';

export const runtime = 'edge';

// Helper to add detailed debug info
const dbg = (msg: string) => console.log(`[CLAIM_DEBUG] ${msg}`);

// We need a proper route handler for the claim action, mostly likely a POST
// But the NFC tag will likely lead to a GET page /claim/[badgeId]
// So looking at the page is what triggers it or provides a button to trigger it.

// Let's make an API route for the actual claiming to keep it clean: /api/claim
export async function POST(req: NextRequest) {
    dbg('Start');

    const session = await getSession();
    dbg(`Session: ${session ? session.userId : 'null'}`);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: any = await req.json();
    const { badgeId } = body;
    dbg(`BadgeId: ${badgeId}`);

    if (!badgeId || typeof badgeId !== 'string') {
        return NextResponse.json({ error: 'Invalid Badge ID' }, { status: 400 });
    }

    const validBadge = TOWNS.find(t => t.id === badgeId);
    if (!validBadge) {
        return NextResponse.json({ error: 'Unknown Badge ID' }, { status: 400 });
    }

    let db: any;
    try {
        db = getDb(process.env);
        dbg(`DB obtained: ${db ? 'yes' : 'NO - DB IS UNDEFINED'}`);
    } catch (dbErr: any) {
        dbg(`DB init error: ${dbErr.message}`);
        return NextResponse.json({ error: 'DB init failed', detail: dbErr.message }, { status: 500 });
    }

    if (!db) {
        return NextResponse.json({ error: 'Database binding not found. Check Cloudflare D1 binding named DB.' }, { status: 500 });
    }

    try {
        const result = await claimBadge(db, session.userId, badgeId);
        dbg(`Claim result: success=${result.success}, isNew=${result.isNew}`);

        if (result.success && result.isNew) {
            try {
                await db.prepare(
                    'UPDATE Users SET exp = COALESCE(exp, 0) + 500 WHERE userId = ?'
                ).bind(session.userId).run();
                dbg('EXP awarded');
            } catch (expErr: any) {
                dbg(`EXP award failed (non-fatal): ${expErr.message}`);
            }
        }

        return NextResponse.json(result);
    } catch (e: any) {
        dbg(`Claim error: ${e.message} | stack: ${e.stack}`);
        console.error(e);
        return NextResponse.json({ 
            error: 'Claim failed', 
            detail: e.message,
            stack: e.stack?.split('\n').slice(0, 5).join(' | ')
        }, { status: 500 });
    }
}
