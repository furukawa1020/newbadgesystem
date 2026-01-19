import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const getSecretKey = () => {
    const secret = (typeof process !== 'undefined' && process.env?.JWT_SECRET) || 'default-dev-secret-key-hakusan-quest';
    // Force git update
    return new TextEncoder().encode(secret);
};

export async function signSession(payload: { userId: string }) {
    const alg = 'HS256';
    return new SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('1y') // Long expiration for "perpetual" login
        .sign(getSecretKey());
}

export async function verifySession(token: string) {
    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        return payload as { userId: string };
    } catch (e) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    return await verifySession(token);
}

export async function setSessionCookie(response: NextResponse, token: string) {
    response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: typeof process !== 'undefined' && process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return response;
}
