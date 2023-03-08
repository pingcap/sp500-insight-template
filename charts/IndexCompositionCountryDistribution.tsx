import { FC } from 'react';
import ECharts, { useECharts } from '@/components/ECharts';
import useSWR from 'swr';
import { byIso } from 'country-code-lookup';
import { worldMapSeries } from '@/components/ECharts/map';

interface GeoDistributionProps {
  index: string;
}

const IndexCompositionCountryDistribution: FC<GeoDistributionProps> = ({ index }) => {
  const { ref, useOption } = useECharts();
  const { data = [] } = useSWR([index, 'countryDistribution'], fetchData);

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
        formatter: '{c} companies from {b}'
      }
    },
  }), [data]);

  return (
    <ECharts className="aspect-[4/3]" ref={ref} />
  );
};

export default IndexCompositionCountryDistribution;

type GeoData = {
  country_code: string
  companies: number
}

const fetchData = async ([index]: [string]): Promise<GeoData[]> => {
  const res = await fetch(`/api/indexes/${index}/compositions/country_distribution`);
  const { rows } = await res.json();
  return rows.map(({ country_code, ...rest }: any) => ({
    country_code: byIso(country_code)?.iso3,
    ...rest,
  }))
    .filter((item: any) => item.country_code);
};

function mixColor (a: [number, number, number], b: [number, number, number], f: number): string {
  const g = 1 - f;
  return `rgb(${a[0] * f + b[0] * g},${a[1] * f + b[1] * g},${a[2] * f + b[2] * g})`;
}
