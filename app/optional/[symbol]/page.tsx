import StockOverview from '@/charts/StockOverview';

const Page = ({ params }: { params: { symbol: string } }) => {

  return <StockOverview index={params.symbol} />;

};

export default Page;
