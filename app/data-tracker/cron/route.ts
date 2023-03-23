import { NextRequest, NextResponse } from 'next/server';
import { updateOldestSymbol } from '../dao/symbol';
import { requestStockInfoAndSave } from '../[symbol]/sync-stock';

// this function will be called by cron job
// and the rate limit is 1 request per minute
export async function GET (request: NextRequest) {
    let oldestSymbol = await updateOldestSymbol();
    await requestStockInfoAndSave(oldestSymbol.symbol);
    return NextResponse.json(oldestSymbol);
}