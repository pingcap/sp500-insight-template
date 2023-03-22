'use client';

import { useEndpoint } from '@/utils/data-api/client';
import endpoints from '@/datasource/endpoints';
import Table from '@/components/Table';
import { useMemo } from 'react';

const SectorsRanking = ({ index }: { index: string }) => {
  const { data = [], isLoading } = useEndpoint(endpoints.index.sector_ranking.GET, { index_symbol: index });

  return (
    <Table
      rows={data}
      columns={useMemo(() => [{
        key: 'sector',
        title: 'Sector',
      }, {
        key: 'companies',
        title: 'Companies',
      }, {
        key: 'companies_ranking',
        title: 'Companies #',
      }, {
        key: 'total_market_cap',
        title: 'Total market cap',
      }, {
        key: 'total_market_cap_ranking',
        title: 'Total market cap #',
      }, {
        key: 'avg_revenue_growth',
        title: 'Avg revenue growth',
        formatter: ((v: number) => (v * 100).toFixed(2)) as any,
      }, {
        key: 'avg_revenue_growth_ranking',
        title: 'Avg revenue growth #',
      }], [])}
      keyField="sector"
    />
  );
};

export default SectorsRanking;
