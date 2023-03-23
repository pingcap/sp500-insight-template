import { NextRequest, NextResponse } from 'next/server';
import { getStocks } from '../dao/stock';
import { addSymbol, deleteSymbol } from '../dao/symbol';
import { requestStockInfoAndSave } from './sync-stock';

interface DataTrackerRouteParams {
    symbol: string;
}

export async function POST (request: NextRequest, { params }: { params: DataTrackerRouteParams }) {
    await addSymbol(params.symbol);
    let stocks = await requestStockInfoAndSave(params.symbol);
    return NextResponse.json(stocks);
}

export async function GET (request: NextRequest, { params }: { params: DataTrackerRouteParams }) {
    let stocks = await getStocks(params.symbol);
    return NextResponse.json(stocks);
}

export async function DELETE (request: NextRequest, { params }: { params: DataTrackerRouteParams }) {
    await deleteSymbol(params.symbol);
    return NextResponse.json("Delete symbol successfully");
}