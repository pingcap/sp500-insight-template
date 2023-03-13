import { NextResponse } from 'next/server';
import { executeEndpoint, withUpstreamErrorHandled } from '@/datasource/data-api';
import CompositionsEndpoint from '@/datasource/indexes/compositions';

const getCompositionList = async (symbol: string) => {
  return executeEndpoint(CompositionsEndpoint, { index_symbol: symbol });
};

export async function GET (req: Request, { params }: any) {
  const { symbol } = params;
  return withUpstreamErrorHandled(async () => {
    const result = await getCompositionList(symbol as string);
    return NextResponse.json(result);
  })
}
