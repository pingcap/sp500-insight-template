'use client';

import { useEndpoint } from '@/utils/data-api/client';
import endpoints from '@/datasource/endpoints';
import React, { useMemo } from 'react';
import ECharts, { useECharts } from '@/components/ECharts';
import Table from '@/components/Table';

const SectorsRanking = ({ index }: { index: string }) => {
  const { ref, useOption } = useECharts();
  const { data = [], isLoading } = useEndpoint(endpoints.index.sector_ranking.GET, { index_symbol: index });

  useOption(() => ({
    grid: {
      left: 160,
    },
    legend: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    yAxis: {
      type: 'category',
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      inverse: true,
    },
    xAxis: [
      {
        type: 'value',
        name: 'Capitalization',
        splitLine: {
          show: false,
        },
        position: 'top',
      },
      {
        type: 'value',
        name: 'Companies',
        splitLine: {
          show: false,
        },
        position: 'bottom',
      },
      {
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: 'Total market cap',
        type: 'bar',
        encode: {
          y: 'sector',
          x: 'total_market_cap',
        },
        xAxisIndex: 0,
        datasetId: 0,
        color: '#dd6b66',
      },
      {
        name: 'Companies',
        type: 'bar',
        encode: {
          y: 'sector',
          x: 'companies',
        },
        xAxisIndex: 1,
        datasetId: 0,
        color: '#759aa0',
      },
      {
        name: 'Avg revenue growth',
        type: 'bar',
        encode: {
          y: 'sector',
          x: 'avg_revenue_growth',
        },
        xAxisIndex: 2,
        datasetId: 0,
        color: '#e69d87',
        tooltip: {
          valueFormatter: v => ((v as number * 100).toFixed(2)) + '%',
        },
      },
    ],
    dataset: {
      id: 0,
      source: [],
    },
  }));

  useOption(() => ({
    dataset: {
      id: 0,
      source: data,
    },
  }), [data]);

  return (
    <>
      <ECharts ref={ref} className="aspect-video" />
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
          title: '#',
        }, {
          key: 'total_market_cap',
          title: 'Total market cap',
        }, {
          key: 'total_market_cap_ranking',
          title: '#',
        }, {
          key: 'avg_revenue_growth',
          title: 'Avg revenue growth',
          formatter: ((v: number) => (v * 100).toFixed(2) + '%') as any,
        }, {
          key: 'avg_revenue_growth_ranking',
          title: '#',
        }], [])}
        keyField="sector"
      />
    </>
  );
};

export default SectorsRanking;
