'use client';
import { FC } from 'react';
import ECharts, { useECharts } from '@/components/ECharts';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import { CandleStickData } from '@/app/stocks/[id]/Candlestick';
import useSWR from 'swr';

const StockOverview: FC<{ index: string }> = ({ index }) => {
  const { ref, useLoading, useOption } = useECharts();

  const { data = [], isValidating } = useSWR([index, 'stock'], fetchData);

  useOption(() => ({
    grid: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      formatter: (([line]: CallbackDataParams[]) => {
        const k = line;
        const lv = line.value as CandleStickData;
        const kv = k.value as CandleStickData;

        const num = lv.adj_close?.toFixed(2);
        const pos = kv.close > kv.open;
        const diff = Math.abs((kv.close - kv.open) / kv.open * 100).toFixed(2);
        return `${lv.record_date}<br/><span style="color: ${pos ? 'red' : 'green'}"><b>${num}</b> ${pos ? '+' : '-'}${diff}%</span>`;
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
    dataZoom: {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      fillerColor: 'transparent',
      handleStyle: {
        color: '#8C181820',
        borderWidth: 0,
      },
      moveHandleStyle: {
        color: '#8C181820',
      },
      brushStyle: {
        color: '#DC2E2E80',
      },
      dataBackground: {
        lineStyle: {
          color: '#888',
        },
        areaStyle: {
          color: '#33333380',
        },
      },
      selectedDataBackground: {
        lineStyle: {
          color: '#DC2E2E',
        },
        areaStyle: {
          color: '#DC2E2E80',
        },
      },
      emphasis: {
        moveHandleStyle: {
          color: '#DC2E2E80',
        },
        handleStyle: {
          color: '#DC2E2E80',
        },
      },
    },
  }));

  useOption(() => ({
    dataset: {
      id: 'data',
      source: data,
    },
  }), [data]);

  useLoading(isValidating);

  return (
    <ECharts ref={ref} className="aspect-[20/5]" />
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

async function fetchData ([index]: [string]): Promise<StockPriceData[]> {
  const res = await fetch(`/api/stocks/${index}/price_history`);
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
