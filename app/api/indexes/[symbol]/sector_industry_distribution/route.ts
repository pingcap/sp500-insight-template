import { NextResponse } from 'next/server';
import { executeEndpoint, withUpstreamErrorHandled } from '@/datasource/data-api';
import SectorIndustryDistributionEndpoint from '@/datasource/indexes/sectory_industry_distribution';

const getSectorIndustryList = async (symbol: string) => {
  return executeEndpoint(SectorIndustryDistributionEndpoint, {
    index_symbol: symbol,
  });
};

export async function GET (req: Request, { params }: any) {
  const { symbol } = params;
  return withUpstreamErrorHandled(async () => {
    const result = await getSectorIndustryList(symbol as string);
    return NextResponse.json(result);
  })
}
