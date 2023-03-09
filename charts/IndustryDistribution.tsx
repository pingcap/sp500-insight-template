'use client';
import { FC } from 'react';
import './common.css';
import useSWR from 'swr';
import ECharts, { useECharts } from '@/components/ECharts';

const IndustryDistribution: FC<{ index: string }> = ({ index }) => {
  const { data, isLoading } = useSWR([index, 'sidistribution'], fetchData);
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

type Record = {
  industry: string
  sector: string
  stock_symbol: string
  trend: 1 | 0 | -1
  weight: number
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

function transform (records: Record[]): TransformedRecord[] {
  const res: TransformedRecord[] = [];
  for (const { industry, sector, stock_symbol, weight, trend } of records) {
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

function getColor (val: number) {
  if (val > 0) {
    return 'red';
  } else if (val === 0) {
    return 'grey';
  } else {
    return 'green';
  }
}

async function fetchData ([index]: [string]): Promise<TransformedRecord[]> {
  const res = await fetch(`/api/indexes/${index}/sector_industry_distribution`);
  const { rows } = await res.json();
  return transform(rows);
}


