import { NextRequest, NextResponse } from 'next/server';
import { getSymbols } from '../dao/symbol';
import { Symbol } from '../dao/base';

export async function GET (request: NextRequest) {
    let symbols: Symbol[] = await getSymbols();
    return NextResponse.json(symbols);
}