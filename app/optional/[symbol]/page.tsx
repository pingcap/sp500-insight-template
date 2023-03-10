import StockOverview from '@/charts/StockOverview';

const Page = ({ params }: { params: { symbol: string } }) => {
  return (
    <StockOverview symbol={params.symbol} />
  );
};

export default Page;
