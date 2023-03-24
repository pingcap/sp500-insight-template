import { NextRequest, NextResponse } from 'next/server';
import { getSymbols } from '../dao/symbol';

export const dynamic = 'force-dynamic';
export async function GET (request: NextRequest) {
    try {
        const symbols = await getSymbols();
        return NextResponse.json(symbols);
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify(err), {status: 500});
    }
}