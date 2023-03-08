import { fetchUserSelectedStocks } from '@/app/optional/data';
import { use } from 'react';
import { redirect } from 'next/navigation';

const Page = () => {
  const stocks = use(fetchUserSelectedStocks(1));

  if (stocks.length > 0) {
    redirect(`/optional/${stocks[0].stock_symbol}`);
  }

  return (<>No selected stocks yet.</>);
};

export default Page;
