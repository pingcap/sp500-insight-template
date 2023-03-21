'use client';
import { FC } from 'react';
import { useEndpoint } from '@/utils/data-api/client';
import endpoints from '@/datasource/endpoints';
import StocksTable from '@/components/StocksTable';
import Scrollable from '@/components/Scrollable';

const IndexCompositions: FC<{ index: string }> = ({ index }) => {
  const { data = [], isLoading } = useEndpoint(endpoints.index.compositions.GET, { index_symbol: index });

  return (
    <Scrollable className='h-[480px]'>
      <StocksTable stocks={data} />
    </Scrollable>
  );
};

export default IndexCompositions;

type IndexCompositionRecord = {
  exchange_symbol: string
  last_2nd_close_price: number
  last_change_day: string
  last_change_percentage: number
  last_close_price: number
  short_name: string
  stock_symbol: string
  weight: number
}
