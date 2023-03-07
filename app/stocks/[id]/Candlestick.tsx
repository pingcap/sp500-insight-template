'use client';
import ECharts, { EChartsProps, useECharts } from '@/components/ECharts';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import { graphic } from 'echarts';

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
      axisPointer: {
        type: 'cross',
      },
      formatter: (([line]: CallbackDataParams[]) => {
        const k = line;
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
      splitLine: {
        show: false,
      }
    },
    series: {
      type: 'candlestick',
      large: true,
      encode: {
        x: 'Date',
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
        color: '#DC2E2E80'
      },
      dataBackground: {
        lineStyle: {
          color: '#888',
        },
        areaStyle: {
          color: '#33333380'
        }
      },
      selectedDataBackground: {
        lineStyle: {
          color: '#DC2E2E',
        },
        areaStyle: {
          color: '#DC2E2E80',
        }
      },
      emphasis: {
        moveHandleStyle: {
          color: '#DC2E2E80'
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

  useLoading(loading);

  return (
    <ECharts ref={ref} {...props} />
  );
};

export default CandleStick;
