'use client';
import { FC } from 'react';
import ECharts, { useECharts } from '@/components/ECharts';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import DurationToggleGroup from '@/components/DurationToggleGroup';
import { useSearchParam } from '@/utils/hook';
import { useSelectedLayoutSegment } from 'next/navigation';
import { EndpointArgs, useComposedEndpoint, useEndpoint } from '@/utils/data-api/client';
import endpoints from '@/datasource/endpoints';
import { DateTime } from 'luxon';
import { getDurationParams } from '@/utils/duration-utils';

interface StockOverviewProps {
  symbol?: string,
}

const StockOverview: FC<StockOverviewProps> = ({ symbol: propSymbol }) => {
  const symbol = useSelectedLayoutSegment() ?? propSymbol;
  const { ref, useOption } = useECharts();
  const [duration, setDuration] = useSearchParam('duration');
  const { data: summary } = useEndpoint(endpoints.stock.summary.GET, symbol ? { stock_symbol: symbol } : undefined);
  const { data = [], isLoading } = useComposedEndpoint(historyPriceEndpoint, {
    date_now: summary?.last_change_day,
    symbol,
    duration,
  }, {
    keepPreviousData: true,
    revalidateIfStale: false,
  });

  useOption(() => ({
    grid: {
      left: 48,
      top: 8,
      right: 8,
      bottom: 24,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      formatter: (([line]: CallbackDataParams[]) => {
        const k = line;
        const kv = k.value as StockPriceData;

        const { record_date, close, open, high, low } = kv;
        const num = close?.toFixed(2);
        const pos = close > open;
        const diff = Math.abs((close - open) / open * 100).toFixed(2);
        return `
          ${record_date}
          <br/>
          <span style="font-size: 24px; color: ${pos ? 'red' : 'green'}"><b>${num}</b> <sub>${pos ? '+' : '-'}${diff}%</sub></span>
          <br/>
          Change: <b style="color: ${pos ? 'red' : 'green'}">${(close - open).toFixed(2)}</b>
          <br/>
          Open: <b>${open.toFixed(2)}</b>
          <br/>
          High: <b>${high.toFixed(2)}</b>
          <br/>
          Low: <b>${low.toFixed(2)}</b>
        `;
      }) as never,
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
      min: 'dataMin',
      max: 'dataMax',
      axisLabel: {
        showMinLabel: false,
        showMaxLabel: false,
      },
      splitLine: {
        show: false,
      },
    },
    series: {
      type: 'candlestick',
      large: true,
      encode: {
        x: 'record_date',
        y: ['open', 'close', 'low', 'high'],
      },
      datasetId: 'data',
    },
    // dataZoom: {
    //   borderColor: 'transparent',
    //   backgroundColor: 'transparent',
    //   fillerColor: 'transparent',
    //   handleStyle: {
    //     color: '#8C181820',
    //     borderWidth: 0,
    //   },
    //   moveHandleStyle: {
    //     color: '#8C181820',
    //   },
    //   brushStyle: {
    //     color: '#DC2E2E80',
    //   },
    //   dataBackground: {
    //     lineStyle: {
    //       color: '#888',
    //     },
    //     areaStyle: {
    //       color: '#33333380',
    //     },
    //   },
    //   selectedDataBackground: {
    //     lineStyle: {
    //       color: '#DC2E2E',
    //     },
    //     areaStyle: {
    //       color: '#DC2E2E80',
    //     },
    //   },
    //   emphasis: {
    //     moveHandleStyle: {
    //       color: '#DC2E2E80',
    //     },
    //     handleStyle: {
    //       color: '#DC2E2E80',
    //     },
    //   },
    // },
  }));

  useOption(() => ({
    dataset: {
      id: 'data',
      source: data,
    },
  }), [data]);

  return (
    <>

      <table>
        <tbody>
        <tr></tr>
        </tbody>
      </table>
      <DurationToggleGroup value={duration} onChange={setDuration} />
      <ECharts ref={ref} className="aspect-[20/5]" loading={isLoading} />
    </>
  );
};

export default StockOverview;

type StockPriceData = {
  low: number
  high: number
  open: number
  close: number
  record_date: string
  adj_close: number
}

async function fetchData ([index, duration]: [string, string]): Promise<StockPriceData[]> {
  const res = await fetch(`/api/stocks/${index}/price_history?duration=${duration}`);
  const { rows } = await res.json();
  return rows.map(({ low, high, open, close, adj_close, record_date }: any) => ({
    low: parseFloat(low),
    high: parseFloat(high),
    open: parseFloat(open),
    close: parseFloat(close),
    adj_close: parseFloat(adj_close),
    record_date: fmtDate(record_date),
  }));
}

const sdf = Intl.DateTimeFormat('en', { dateStyle: 'short' });

function fmtDate (date: string) {
  return sdf.format(new Date(date));
}

const historyPriceEndpoint = ({ date_now, symbol, duration }: { date_now: string | undefined, symbol: string | undefined, duration?: string | null }) => {
  const fmt = 'yyyy-MM-dd';
  if (!date_now || !symbol) {
    return undefined;
  }

  const now = DateTime.fromFormat(date_now, fmt);
  const { n, unit } = getDurationParams(duration ?? '6M');

  let start: DateTime;
  let end = now;
  let endpoint: typeof endpoints.stock.history_price.weekly.GET;

  if (n === 'CURRENT') {
    endpoint = endpoints.stock.history_price.daily.GET;
    start = now.startOf('year');
  } else if (unit === 'YEAR' && n > 1) {
    endpoint = endpoints.stock.history_price.weekly.GET;
    start = now.minus({ year: n });
  } else {
    endpoint = endpoints.stock.history_price.daily.GET;
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
    stock_symbol: symbol,
  }] as EndpointArgs<typeof endpoints.stock.history_price.weekly.GET>;
};
