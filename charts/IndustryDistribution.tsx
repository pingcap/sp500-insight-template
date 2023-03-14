'use client';
import { FC } from 'react';
import './common.css';
import ECharts, { useECharts } from '@/components/ECharts';
import { useEndpoint } from '@/utils/data-api/client';
import endpoints from '@/datasource/endpoints';
import { EndpointData } from '@/utils/data-api/endpoint';
import { useTransform } from '@/utils/hook';

const IndustryDistribution: FC<{ index: string }> = ({ index }) => {
  const { data: raw, isLoading } = useEndpoint(endpoints.index.sector_industry_distribution.GET, { index_symbol: index });
  const data = useTransform(raw, transform);

  const { ref, useOption } = useECharts();
  useOption(() => ({
    grid: {
      left: 8,
      top: 8,
      right: 8,
      bottom: 8,
    },
    tooltip: {},
    series: {
      type: 'treemap',
      roam: false,
      leafDepth: 2,
      drillDownIcon: '',
      label: {
        color: '#dddddd',
      },
      levels: [
        {
          colorSaturation: [0.4, 0.5],
          itemStyle: {
            borderColor: '#1d1d1d',
            borderWidth: 0,
            gapWidth: 1,
          },
          upperLabel: {
            show: false,
          },
        },
        {
          colorSaturation: [0.3, 0.4],
          itemStyle: {
            borderColor: '#282627',
            borderWidth: 5,
            gapWidth: 1,
          },
          emphasis: {
            itemStyle: {
              borderColor: '#404042',
            },
          },
        },
        {
          colorSaturation: [0.1, 0.3],
          itemStyle: {
            borderWidth: 5,
            gapWidth: 1,
            borderColorSaturation: 0.6,
          },
        },
      ],
      upperLabel: {
        show: true,
        height: 30,
        color: '#dddddd',
      },
    },
  }));

  useOption(() => ({
    series: {
      data,
    },
  }), [data]);

  return (
    <ECharts ref={ref} className="aspect-video" loading={isLoading} />
  );
};
export default IndustryDistribution;

type Tree = {
  name: string
  fullName: string
  children?: Tree[]
  value?: number
}

type TransformedRecord = {
  name: string
  children: {
    name: string
    children: {
      [key: string]: any
      name: string
      value: number
    }[]
  }[]
}

function transform (records?: EndpointData<typeof endpoints.index.sector_industry_distribution.GET>): TransformedRecord[] {
  const res: TransformedRecord[] = [];
  for (const { industry, sector, stock_symbol, weight, trend } of records ?? []) {
    let s = res.find(s => s.name === sector);
    if (!s) {
      res.push(s = { name: sector, children: [] });
    }

    let i = s.children.find(i => i.name === industry);
    if (!i) {
      s.children.push(i = { name: industry, children: [] });
    }

    i.children.push({
      name: stock_symbol,
      value: weight,
      // itemStyle: {
      //   color: getColor(trend),
      // }
    });
  }

  return res;
}
