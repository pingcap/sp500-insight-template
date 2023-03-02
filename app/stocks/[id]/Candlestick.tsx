'use client';
import ECharts, { EChartsProps, useECharts } from '@/components/ECharts';
import { CallbackDataParams } from 'echarts/types/dist/shared';

export interface CandleStickData {
  [key: string]: any;

  date: string;
  low: number;
  high: number;
  open: number;
  close: number;
  adjClose: number;
}

interface CandleStickProps extends EChartsProps {
  data: CandleStickData[];
  loading?: boolean;
}

const CandleStick = ({ loading = false, data, ...props }: CandleStickProps) => {
  const { ref, useLoading, useOption } = useECharts();

  useOption(() => ({
    grid: {},
    tooltip: {
      trigger: 'axis',
      formatter: (([k, line]: CallbackDataParams[]) => {
        const lv = line.value as CandleStickData;
        const kv = k.value as CandleStickData;

        const num = lv.adjClose?.toFixed(2);
        const pos = kv.close > kv.open;
        const diff = Math.abs((kv.close - kv.open) / kv.open * 100).toFixed(2);
        return `${lv.date}<br/><span style="color: ${pos ? 'red' : 'green'}"><b>${num}</b> ${pos ? '+' : '-'}${diff}%</span>`;
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
    },
    series: [{
      type: 'candlestick',
      encode: {
        x: 'Date',
        y: ['open', 'close', 'low', 'high'],
      },
      datasetId: 'data',
    }, {
      type: 'line',
      encode: {
        x: 'date',
        y: 'adjClose',
      },
      symbolSize: 0,
      lineStyle: {
        width: 1,
      },
    }],
    dataZoom: {},
  }));

  useOption(() => ({
    dataset: {
      id: 'data',
      source: data,
    },
  }), [data]);

  useLoading(loading);

  return (
    <ECharts ref={ref} {...props} />
  );
};

export default CandleStick;
