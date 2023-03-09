'use client';

import { FC, useMemo } from 'react';
import useSWR from 'swr';
import ECharts, { useECharts } from '@/components/ECharts';
import { graphic } from 'echarts';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import './common.css';
import clsx from 'clsx';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import { useSearchParam } from '@/utils/hook';

const IndexOverview: FC<{ index: string }> = ({ index }) => {
  const [duration = '6M', setDuration] = useSearchParam('duration');
  const { ref, useOption } = useECharts();
  const { data: priceHistoryRecords = [], isLoading: priceHistoryLoading } = useSWR([index, duration, 'priceHistory'], { fetcher: priceHistory, keepPreviousData: true });
  const { data: latestPriceRecord } = useSWR([index, 'latestPrice'], latestPrice);

  const today = latestPriceRecord?.last_updated_at ? new Date(latestPriceRecord.last_updated_at) : '--';

  const { diff, diffPercent, increased } = useMemo(() => {
    const first = priceHistoryRecords[priceHistoryRecords.length - 1];
    const last = priceHistoryRecords[0];
    if (first && last) {
      return {
        diff: Math.abs(last.price - first.price).toFixed(2),
        diffPercent: (Math.abs(last.price - first.price) / last.price * 100).toFixed(2),
        increased: last.price >= first.price,
      };
    } else {
      return {
        diff: '--',
        diffPercent: '--',
        increased: true,
      };
    }
  }, [priceHistoryRecords]);

  useOption(() => ({
    grid: {
      left: 8,
      right: 8,
      top: 8,
      bottom: 8,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#333',
          color: '#777',
        },
        lineStyle: {
          color: '#ffffff40',
        },
        crossStyle: {
          color: '#ffffff40',
        },
      },
      backgroundColor: '#222',
      borderColor: '#111',
    },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#333',
        },
      },
    },
    series: {
      type: 'line',
      encode: {
        x: 'record_date',
        y: 'price',
      },
      smooth: true,
      sampling: 'lttb',
      symbolSize: 0,
      datasetIndex: 0,
      lineStyle: {
        width: 1,
      },

    },
    dataset: {
      source: [],
    },
    useUTC: true,
  }));

  useOption(() => ({
    series: {
      color: increased ? '#DC2E2E' : '#3ed326',
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0.3,
            color: increased ? '#8C181880' : '#28881780',
          },
          {
            offset: 1,
            color: 'rgba(0,0,0,0)',
          }]),
      },
    },
    dataset: {
      source: priceHistoryRecords,
    },
  }), [priceHistoryRecords]);

  return (
    <main className="pt-4">
      <div className="flex flex-col mb-4">
        <span>
          <span className="text-significant text-5xl">
            {priceHistoryRecords[0]?.['price']}
          </span>
          <span className={clsx(increased ? 'text-red-600' : 'text-green-600', 'text-2xl px-2')}>
            <span className={clsx(increased ? 'bg-red-600' : 'bg-green-600', 'bg-opacity-20 rounded-xl px-2 py-1 tex')}>
              {increased ? <ArrowUpIcon className="inline-block h-6 align-text-bottom" /> : <ArrowDownIcon className="inline-block h-6 align-text-bottom" />}{diffPercent}%
            </span>
            <span className="ml-2">
              {increased ? '+' : '-'}{diff}
            </span>
          </span>
        </span>
        <span className="text-secondary mt-4">
          {today !== '--' ? dtf.format(today) : '--'}
        </span>
      </div>
      <ToggleGroup.Root
        className="flex gap-4 mt-4 mb-2"
        type="single"
        defaultValue="center"
        value={String(duration)}
        onValueChange={setDuration}
        aria-label="Duration"
      >
        {DURATIONS.map(({ name }) => (
          <ToggleGroup.Item className="toggle-item" key={name} value={name} aria-label={name}>
            {name}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
      <ECharts ref={ref} className="mt-4 w-full aspect-[20/9]" loading={priceHistoryLoading} />
    </main>
  );
};

export default IndexOverview;

type IndexHistoryPriceRecord = {
  record_date: string
  price: number
}
type IndexLatestPrice = {
  last_updated_at: string
  last_1st_price: number
  last_2nd_price: number
  last_changes: number
}

const priceHistory = async ([index, duration]: [string, string]): Promise<IndexHistoryPriceRecord[]> => {
  const resp = await fetch(`/api/indexes/${index}/price_history?duration=${duration}`);
  const { rows } = await resp.json();
  return rows.map(({ record_date, price }: any) => ({
    record_date,
    price: parseFloat(price),
  }));
};

const latestPrice = async ([index]: [string]): Promise<IndexLatestPrice> => {
  const resp = await fetch(`/api/indexes/${index}/latest_price`);
  const {
    rows: [{
      last_updated_at,
      last_1st_price,
      last_2nd_price,
      last_changes,
    }],
  } = await resp.json();
  return {
    last_updated_at,
    last_1st_price: parseFloat(last_1st_price),
    last_2nd_price: parseFloat(last_2nd_price),
    last_changes: parseFloat(last_changes),
  };
};

interface Duration {
  name: string;
}

const DURATIONS: Duration[] = [
  {
    name: '6M',
  },
  {
    name: 'YTD',
  },
  {
    name: '1Y',
  },
  {
    name: '5Y',
  },
  {
    name: 'MAX',
  }];

const dtf = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeStyle: 'long' });
