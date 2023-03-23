import { NextRequest, NextResponse } from 'next/server';
import { getStocks } from '../dao';
import { requestStockInfoAndSave } from './sync-stock';

interface DataTrackerRouteParams {
    symbol: string;
}

export async function POST (request: NextRequest, { params }: { params: DataTrackerRouteParams }) {
    let stocks = await requestStockInfoAndSave(params.symbol);
    return NextResponse.json(stocks);
}

export async function GET (request: NextRequest, { params }: { params: DataTrackerRouteParams }) {
    let stocks = await getStocks(params.symbol);
    return NextResponse.json(stocks);
}