import { NextRequest, NextResponse } from 'next/server';
import { signSession, setSessionCookie } from '@/lib/session';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const userId = crypto.randomUUID();
        const token = await signSession({ userId });

        // Register the new user in D1 DB
        try {
            const db = getDb(process.env);
            await db.prepare(
                'INSERT INTO Users (userId, avatarId, exp, createdAt) VALUES (?, 1, 0, ?) ON CONFLICT(userId) DO NOTHING'
            ).bind(userId, Date.now()).run();
        } catch (dbErr: any) {
            // Non-fatal: log but don't block auth
            console.error('Failed to create user in DB:', dbErr.message);
        }

        const response = NextResponse.json({ success: true, userId, accessToken: token });
        await setSessionCookie(response, token);

        return response;

    } catch (error: any) {
        console.error('Registration failed:', error);
        return NextResponse.json({
            error: error.message || 'Internal Error',
            stack: error.stack,
            type: typeof error
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'Auth Endpoint Ready' });
}
