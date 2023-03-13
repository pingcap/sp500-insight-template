import { NextResponse } from 'next/server';
import { executeEndpoint, withUpstreamErrorHandled } from '@/datasource/data-api';
import CompositionExchangeDistribution from '@/datasource/indexes/compositions/exchange_distribution';

const getCompositionExchangeDistribution = async (symbol: string) => {
  return executeEndpoint(CompositionExchangeDistribution, { index_symbol: symbol });
};

export async function GET (req: Request, { params }: any) {
  const { symbol } = params;
  return withUpstreamErrorHandled(async () => {
    const result = await getCompositionExchangeDistribution(symbol as string);
    return NextResponse.json(result);
  })
}
