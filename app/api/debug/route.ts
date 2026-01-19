import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
    const processType = typeof process;
    const envStatus = typeof process !== 'undefined' && process.env ? 'defined' : 'undefined';
    const secretStatus = typeof process !== 'undefined' && process.env?.JWT_SECRET ? 'present' : 'missing';
    const cryptoType = typeof crypto;

    return NextResponse.json({
        process: processType,
        env: envStatus,
        secret: secretStatus,
        crypto: cryptoType,
        timestamp: Date.now()
    });
}
