import { NextRequest, NextResponse } from 'next/server';
import { getDb, addExp } from '@/lib/db';
import { getSession } from '@/lib/session';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { exp } = body;

        if (!exp || typeof exp !== 'number') {
            return NextResponse.json({ error: 'Invalid EXP amount' }, { status: 400 });
        }

        // TODO: Validate EXP amount to prevent cheating (e.g., max 100 per battle)
        const safeExp = Math.min(exp, 500);

        const db = getDb(process.env);
        const success = await addExp(db, session.userId, safeExp);

        if (!success) {
            return NextResponse.json({ error: 'Failed to update EXP' }, { status: 500 });
        }

        return NextResponse.json({ success: true, gainedExp: safeExp });

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
