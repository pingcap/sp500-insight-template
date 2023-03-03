import { getCollection, getCollectionMember } from '@/app/collections/api';
import { cache, use } from 'react';
import { NotFound } from 'next/dist/client/components/error';
import Stocks from '@/app/stocks/Stocks';
import StocksToolbar from './StocksToolbar';

type PageProps = {
  params: {
    id: string
  }
}

const Page = ({ params }: PageProps) => {
  const collection = use(cache(getCollection)(params.id));
  const member = use(cache(getCollectionMember)(params.id));

  if (!collection || !member) {
    return <NotFound />;
  }
  return (
    <>
      <StocksToolbar />
      <Stocks data={member} />
    </>
  );
};

export default Page;
