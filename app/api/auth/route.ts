import { NextRequest, NextResponse } from 'next/server';
import { signSession, setSessionCookie } from '@/lib/session';

export const runtime = 'edge'; // Cloudflare Pages compatibility

export async function POST(req: NextRequest) {
    try {
        // 1. Generate new Device/User ID
        const userId = crypto.randomUUID();

        // 2. Create Session Token (JWT)
        const token = await signSession({ userId });

        const response = NextResponse.json({ success: true, userId });

        // 3. Set Long-Lived HttpOnly Cookie
        await setSessionCookie(response, token);

        return response;

    } catch (error) {
        console.error('Registration failed:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'Auth Endpoint Ready' });
}
