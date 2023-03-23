'use client';
import { FC, useState } from 'react';
import { useComposedEndpoint } from '@/utils/data-api/client';
import endpoints from '@/datasource/endpoints';
import StocksTable from '@/components/StocksTable';

const IndexCompositions: FC<{ index: string }> = ({ index }) => {
  const [sector, setSector] = useState<string>();
  const { data = [], isLoading } = useComposedEndpoint((sector) => {
    if (typeof sector === 'string') {
      return [endpoints.index.compositions.by_sector.GET, { index_symbol: index, sector }];
    } else {
      return [endpoints.index.compositions.GET, { index_symbol: index }];
    }
  }, sector);
  return (
    <StocksTable className="h-[480px]" stocks={data} />
  );
};

export default IndexCompositions;
