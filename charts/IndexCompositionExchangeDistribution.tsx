import { FC } from 'react';
import ECharts, { useECharts } from '@/components/ECharts';
import useSWR from 'swr';

const IndexCompositionExchangeDistribution: FC<{ index: string }> = ({ index }) => {
  const { ref, useOption } = useECharts();
  const { data = [] } = useSWR([index, 'exchangeDistribution'], fetchData);

  useOption(() => ({
    grid: {
      top: 8,
      left: 8,
      right: 8,
      bottom: 8,
    },
    tooltip: {},
    legend: {
      left: 8,
      top: 'center',
      orient: 'vertical',
      textStyle: {
        color: '#777'
      }
    },
    series: {
      type: 'pie',
      name: 'Exchange Distribution',
      color: [
        '#dd6b66',
        '#759aa0',
        '#e69d87',
        '#8dc1a9',
        '#ea7e53',
        '#eedd78',
        '#73a373',
        '#73b9bc',
        '#7289ab',
        '#91ca8c',
        '#f49f42',
      ],
      radius: ['60%', '80%'],
      minAngle: 5,
      label: {
        textBorderWidth: 0,
        color: '#777'
      },
    },
  }));

  useOption(() => ({
    series: {
      data: data.map(({ exchange_symbol, companies }) => ({
        name: exchange_symbol,
        value: companies,
      })),
    },
  }), [data]);

  return <ECharts ref={ref} className="h-[400px]" />;
};

export default IndexCompositionExchangeDistribution;

type DistributionRecord = {
  exchange_symbol: string
  companies: number
}

const fetchData = async ([index]: [string]): Promise<DistributionRecord[]> => {
  const res = await fetch(`/api/indexes/${index}/compositions/exchange_distribution`);
  const { rows } = await res.json();

  return rows;
};
