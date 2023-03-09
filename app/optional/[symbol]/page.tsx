import StockOverview from '@/charts/StockOverview';
import { unique } from '@/datasource/query';
import { use } from 'react';
import { getStockInfo } from '@/datasource/stocks';

const Page = ({ params }: { params: { symbol: string } }) => {
  const company = unique(use(getStockInfo(params.symbol)));

  return <StockOverview index={params.symbol} company={company} />;

};

export default Page;
