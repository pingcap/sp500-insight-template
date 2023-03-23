'use client';
import { FC, useState } from 'react';
import { useComposedEndpoint, useEndpoint } from '@/utils/data-api/client';
import endpoints from '@/datasource/endpoints';
import StocksTable from '@/components/StocksTable';
import { useTransform } from '@/utils/hook';
import CommonToggleGroup from '@/components/ToggleGroup';

const IndexCompositions: FC<{ index: string }> = ({ index }) => {
  const [sector, setSector] = useState<string>();
  const { data = [], isLoading } = useComposedEndpoint((sector) => {
    if (sector) {
      return [endpoints.index.compositions_by_sector.GET, { index_symbol: index, sector }];
    } else {
      return [endpoints.index.compositions.GET, { index_symbol: index }];
    }
  }, sector);
  const { data: rawSectors } = useEndpoint(endpoints.sectors.GET, {});
  const sectors = useTransform(rawSectors, sectors => sectors?.map(s => ({ name: s.sector })) ?? []);
  return (
    <>
      <CommonToggleGroup
        options={sectors}
        label="Sector"
        value={sector}
        onChange={setSector}
      />
      <StocksTable className="h-[480px]" stocks={data} />
    </>
  );
};

export default IndexCompositions;
