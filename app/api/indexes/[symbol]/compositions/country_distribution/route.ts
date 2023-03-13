import { NextResponse } from 'next/server';
import { executeEndpoint } from '@/datasource/data-api';
import CompositionCountryDistribution from '@/datasource/indexes/compositions/country_distribution';

const getCompositionCountryDistribution = async (symbol: string) => {
  return executeEndpoint(CompositionCountryDistribution, { index_symbol: symbol });
};

export async function GET (req: Request, { params }: any) {
  const { symbol } = params;
  const result = await getCompositionCountryDistribution(symbol as string);
  return NextResponse.json(result);
}
