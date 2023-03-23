import { NextRequest, NextResponse } from 'next/server';
import { getSymbols } from './dao';

export async function GET (request: NextRequest) {
    let symbols = await getSymbols();
    return NextResponse.json(symbols);
}