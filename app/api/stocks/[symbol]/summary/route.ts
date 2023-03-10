import { NextResponse } from 'next/server';
import { getStockSummary } from '@/datasource/stocks';

export async function GET (req: Request, { params }: any) {
  const { symbol } = params;
  const result = await getStockSummary(symbol as string);
  return NextResponse.json(result);
}
