'use client'
import { FC } from 'react';
import ECharts, { useECharts } from '@/components/ECharts';
import { byIso } from 'country-code-lookup';
import { worldMapSeries } from '@/components/ECharts/map';
import { useEndpoint } from '@/utils/data-api/client';
import endpoints from '@/datasource/endpoints';
import { EndpointData } from '@/utils/data-api/endpoint';
import { useTransform } from '@/utils/hook';

interface GeoDistributionProps {
  index: string;
}

const IndexCompositionCountryDistribution: FC<GeoDistributionProps> = ({ index }) => {
  const { ref, useOption } = useECharts();
  const { data: raw = [], isLoading } = useEndpoint(endpoints.index.compositions.country_distribution.GET, { index_symbol: index });
  const data = useTransform(raw, transform);

  useOption(() => ({
    legend: {},
    tooltip: {},
    // visualMap: {
    //   left: 'right',
    //   min: 0,
    //   max: 500,
    //   calculable: true,
    //   borderWidth: 0,
    // },
    series: {
      ...worldMapSeries(),
    },
  }));

  useOption(() => ({
    series: {
      data: data.map(({ country_code, companies }) => ({
        name: country_code,
        value: companies,
        itemStyle: {
          shadowBlur: 0,
          shadowColor: '#222',
          gapWidth: 2,
          areaColor: mixColor([200, 200, 200], [120, 120, 120], companies / 500),
          borderColor: mixColor([200, 200, 200], [120, 120, 120], companies / 500),
        },
      })),
      tooltip: {
        formatter: '{c} companies from {b}',
      },
    },
  }), [data]);

  return (
    <ECharts className="aspect-[4/3]" ref={ref} loading={isLoading} />
  );
};

export default IndexCompositionCountryDistribution;

type GeoData = EndpointData<typeof endpoints.index.compositions.country_distribution.GET>[number]

function transform (rows: GeoData[]) {
  return rows.map(({ country_code, ...rest }) => ({
    country_code: byIso(country_code)?.iso3,
    ...rest,
  }))
    .filter((item): item is GeoData => !!item.country_code);
}

function mixColor (a: [number, number, number], b: [number, number, number], f: number): string {
  const g = 1 - f;
  return `rgb(${a[0] * f + b[0] * g},${a[1] * f + b[1] * g},${a[2] * f + b[2] * g})`;
}
