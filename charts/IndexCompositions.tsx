'use client';
import { FC } from 'react';
import { useEndpoint } from '@/utils/data-api/client';
import endpoints from '@/datasource/endpoints';
import StocksTable from '@/components/StocksTable';
import Scrollable from '@/components/Scrollable';

const IndexCompositions: FC<{ index: string }> = ({ index }) => {
  const { data = [], isLoading } = useEndpoint(endpoints.index.compositions.GET, { index_symbol: index });

  return (
    <Scrollable className="h-[480px]">
      <StocksTable stocks={data} />
    </Scrollable>
  );
};

export default IndexCompositions;
