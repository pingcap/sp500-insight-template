'use client';

import { FC, useMemo } from 'react';
import ECharts, { useECharts } from '@/components/ECharts';
import { graphic } from 'echarts';
import './common.css';
import clsx from 'clsx';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import { useSearchParam } from '@/utils/hook';
import DurationToggleGroup from '@/components/DurationToggleGroup';
import { EndpointArgs, useComposedEndpoint, useEndpoint } from '@/utils/data-api/client';
import endpoints from '@/datasource/endpoints';
import { DateTime } from 'luxon';
import { getDurationParams } from '@/utils/duration-utils';
import { EndpointData } from '@/utils/data-api/endpoint';

const IndexOverview: FC<{ index: string }> = ({ index }) => {
  const [duration, setDuration] = useSearchParam('duration');
  const { ref, useOption } = useECharts();

  const { data: latestPriceRecord } = useEndpoint(endpoints.index.latest_price.GET, { index_symbol: index });
  const { data: priceHistoryRecords = [], isLoading: priceHistoryLoading } = useComposedEndpoint(historyPriceEndpoint, {
    date_now: latestPriceRecord?.last_updated_at,
    duration,
    symbol: index,
  }, {
    keepPreviousData: true,
  });

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
    yAxis: {
      min: getMinPrice(priceHistoryRecords),
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
            {priceHistoryRecords[0]?.['price'] ?? latestPriceRecord?.last_1st_price}
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
      <DurationToggleGroup value={duration ?? '6M'} onChange={setDuration} />
      <ECharts ref={ref} className="mt-4 w-full aspect-[20/9]" loading={priceHistoryLoading} />
    </main>
  );
};

export default IndexOverview;

function getMinPrice (records: EndpointData<typeof endpoints.index.history_price.weekly.GET>): number {
  const n = records.reduce((min, record) => Math.min(min, record.price), Infinity);
  if (isFinite(n)) {
    let i = 10;
    while (Math.floor(n / i) > 0) {
      i *= 10;
    }
    i /= 10;
    let m = Math.floor(n / i) * i;
    if (n - m > i / 2) {
      if (n - m > i * 3 / 4) {
        return m + i * 3 / 4;
      } else {
        return m + i / 2;
      }
    } else {
      if (n - m > i / 4) {
        return m + i / 4;
      } else {
        return m;
      }
    }
  } else {
    return 0;
  }
}

const dtf = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeStyle: 'long' });

const historyPriceEndpoint = ({ date_now, symbol, duration }: { date_now: string | undefined, symbol: string, duration?: string | null }) => {
  const fmt = 'yyyy-MM-dd';
  if (!date_now) {
    return undefined;
  }

  const now = DateTime.fromFormat(date_now, fmt);
  const { n, unit } = getDurationParams(duration ?? '6M');

  let start: DateTime;
  let end = now;
  let endpoint: typeof endpoints.index.history_price.weekly.GET;

  if (n === 'CURRENT') {
    endpoint = endpoints.index.history_price.daily.GET;
    start = now.startOf('year');
  } else if (unit === 'YEAR' && n > 1) {
    endpoint = endpoints.index.history_price.weekly.GET;
    start = now.minus({ year: n });
  } else {
    endpoint = endpoints.index.history_price.daily.GET;
    switch (unit) {
      case 'YEAR':
        start = now.minus({ year: n });
        break;
      case 'MONTH':
        start = now.minus({ month: n });
        break;
      case 'DAY':
        start = now.minus({ day: n });
        break;
      default:
        throw new Error('Unknown unit');
    }
  }

  return [endpoint, {
    start_date: start.toFormat(fmt),
    end_date: end.toFormat(fmt),
    index_symbol: symbol,
  }] as EndpointArgs<typeof endpoints.index.history_price.weekly.GET>;
};
