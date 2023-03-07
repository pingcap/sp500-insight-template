'use client';

import { FC, useMemo, useState } from 'react';
import useSWR from 'swr';
import ECharts, { useECharts } from '@/components/ECharts';
import { graphic } from 'echarts';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import './common.css';
import clsx from 'clsx';

const SP500Overview: FC = () => {
  const [duration, setDuration] = useState(DURATIONS[0]);
  const { data = [] } = useSWR('sp500overview', fetchData);
  const { ref, useOption } = useECharts();

  const today = useMemo(() => {
    const d = getMaxDate(data);
    return isFinite(d) ? d : undefined;
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(duration.filter);
  }, [data, duration]);

  const diff = useMemo(() => {
    return filteredData[0]?.['S&P500'] - filteredData[filteredData.length - 1]?.['S&P500'];
  }, [filteredData]);

  const diffPercent = useMemo(() => {
    return Math.abs(diff / filteredData[filteredData.length - 1]?.['S&P500'] * 100).toFixed(2);
  }, [diff, filteredData]);

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
        x: 'Date',
        y: 'S&P500',
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
      color: diff >= 0 ? '#DC2E2E' : '#3ed326',
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0.3,
            color: diff >= 0 ? '#8C181880' : '#28881780',
          },
          {
            offset: 1,
            color: 'rgba(0,0,0,0)',
          }]),
      },
    },
    dataset: {
      source: filteredData,
    },
  }), [filteredData]);

  return (
    <main className="pt-4">
      <div className="flex flex-col">
        <span className="text-secondary">
          {today ? dtf.format(today) : '--'}
        </span>
        <span>
          <span className="text-significant text-5xl">
            {data[0]?.['S&P500']}
          </span>
          <span className={clsx(diff > 0 ? 'text-red-600' : 'text-green-600', 'text-2xl px-2')}>
            <span className={clsx(diff > 0 ? 'bg-red-600' : 'bg-green-600', 'bg-opacity-20 rounded-xl px-2 py-1 tex')}>
              {diff > 0 ? '+' : '-'}{diffPercent}%
            </span>
            <span className='ml-2'>
              {diff > 0 ? '+' : '-'}{Math.abs(diff).toFixed(2)}
            </span>
          </span>
        </span>
      </div>
      <ToggleGroup.Root
        className="flex gap-4 mt-4 mb-2"
        type="single"
        defaultValue="center"
        value={duration.name}
        onValueChange={value => {
          setDuration(DURATIONS.find(d => d.name === value) ?? DURATIONS[0]);
        }}
        aria-label="Text alignment"
      >
        {DURATIONS.map(({ name }) => (
          <ToggleGroup.Item className="toggle-item" key={name} value={name} aria-label={name}>
            {name}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
      <ECharts ref={ref} className="mt-4 w-full aspect-[20/9]" />
    </main>
  );
};

export default SP500Overview;

const fetchData = async () => {
  return import('./SP500Overview.json').then(d => d.default);
};

interface Duration {
  name: string;
  filter: (item: any, index: number, list: any[]) => boolean;
}

function getMaxDate (list: any): number {
  if (!list._maxDate) {
    list._maxDate = Math.max(...list.map((d: any) => new Date(d.Date)));
  }
  return list._maxDate;
}

function sub (date: number, days: number) {
  return date - 24 * 60 * 60 * 1000 * days;
}

function time (any: any): number {
  return (new Date(any)).getTime();
}

const recent = (days: number) => {
  return (item: any, index: number, list: any[]) => {
    return time(item.Date) >= sub(getMaxDate(list), days);
  };
};

const DURATIONS: Duration[] = [{
  name: '1D',
  filter: recent(1),
}, {
  name: '5D',
  filter: recent(5),
}, {
  name: '1M',
  filter: recent(30),
}, {
  name: '6M',
  filter: recent(180),
}, {
  name: 'YTD',
  filter: item => {
    return (new Date(item.Date)).getUTCFullYear() === (new Date()).getUTCFullYear();
  },
}, {
  name: '1Y',
  filter: recent(365),
}, {
  name: '5Y',
  filter: recent(365 * 5),
}, {
  name: 'MAX',
  filter: () => true,
}];

const dtf = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeStyle: 'long' });
