'use client';
import { FC, useEffect, useState } from 'react';
import ECharts, { useECharts } from '@/components/ECharts';
import useSWR from 'swr';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import './common.css';

const IndustryDistribution: FC = () => {
  const { ref, useOption } = useECharts();
  const { data = [] } = useSWR('companies', loadData);
  const [sector, setSector] = useState<Tree>();

  useEffect(() => {
    setSector(data[0]);
  }, [data]);

  useOption(() => ({
    grid: {
      left: 8,
      top: 8,
      bottom: 8,
      right: 8,
    },
    tooltip: {},
    series: {
      type: 'sunburst',
      color: '#DC2E2E40',
      itemStyle: {
        borderColor: '#222',
      },
      radius: ['30%', '100%'],
      label: {
        textBorderWidth: 0,
        textShadowBlur: 0,
        color: '#aaa',
      },
      startAngle: 0,
      tooltip: {
        formatter: params => {
          return `
          ${(params.data as any).fullName}
          <br/>
          Weight: <b>${(params.value as number * 100).toFixed(2)}%</b>`
        },
        backgroundColor: '#222',
        borderColor: '#111',
        textStyle: {
          color: '#aaa'
        }
      }
    },
  }));

  useOption(() => ({
    series: {
      data: sector ? sector.children : [],
    },
  }), [sector]);

  return (
    <>
      <ToggleGroup.Root
        className="flex flex-wrap gap-4 mt-4 mb-2"
        type="single"
        defaultValue="center"
        value={sector?.name}
        onValueChange={value => {
          setSector(data.find(d => d.name === value) ?? data[0]);
        }}
        aria-label="Duration"
      >
        {data.map(({ name }) => (
          <ToggleGroup.Item className="toggle-item" key={name} value={name} aria-label={name}>
            {name}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
      <ECharts className="w-full aspect-square" ref={ref} />
    </>
  );
};
export default IndustryDistribution;

type Tree = {
  name: string
  fullName: string
  children?: Tree[]
  value?: number
}

async function loadData () {
  const data = await import('@/app/stocks/mock-companies.json').then(m => m.default);
  const sectors: Tree[] = [];

  for (const company of data) {
    let sector = sectors.find(s => s.name === company.Sector);
    if (!sector) {
      sector = {
        name: company.Sector,
        fullName: company.Sector,
        children: [],
      };
      sectors.push(sector);
    }

    let industry = sector.children!.find(i => i.name === company.Industry);
    if (!industry) {
      industry = {
        name: company.Industry,
        fullName: company.Industry,
        children: [],
      };
      sector.children!.push(industry);
    }

    industry.children!.push({
      name: company.Symbol,
      fullName: company.Longname,
      value: company.Weight,
    });
  }

  return sectors;
}

