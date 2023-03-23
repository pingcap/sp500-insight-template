import { NextRequest, NextResponse } from 'next/server';
import { getSymbols } from './dao';

export async function GET (request: NextRequest) {
    let symbols = getSymbols()
        .then(symbols => symbols)
        .catch(err => {
            console.error(err);
            return NextResponse.error();
        });
    return NextResponse.json(symbols);
}