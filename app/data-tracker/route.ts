import { NextRequest, NextResponse } from 'next/server';
import { getSymbols } from './dao/symbol';

export async function GET (request: NextRequest) {
    let symbols = await getSymbols();
    console.log(symbols);
    return NextResponse.json(symbols);
}