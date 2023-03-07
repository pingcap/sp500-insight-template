import DATA from './mock.json';
import Candlestick, { CandleStickData } from './Candlestick';
import { cache, Suspense, use } from 'react';
import { getStock } from '@/app/stocks/api';
import { NotFound } from 'next/dist/client/components/error';
import './page.css'

const sdf = Intl.DateTimeFormat('en', { dateStyle: 'short' });

const Page = function ({ params }: { params: { id: string } }) {
  const company = use(cache(getStock)(params.id));
  const data = use(cache(getData)());

  if (!company) {
    return <NotFound />;
  }

  return (
    <main className="company container">
      <h1 className="name">{company.longname}</h1>
      <Suspense
        fallback={
          <Candlestick
            key="chart"
            className="w-full m-auto aspect-[20/5]"
            loading
            data={[]}
          />
        }
      >
        <Candlestick
          key="chart"
          className="w-full m-auto aspect-[20/5]"
          loading={false}
          data={data}
        />
      </Suspense>
      <p className="description">{company.longbusinesssummary}</p>
    </main>
  );
};

async function getData (): Promise<CandleStickData[]> {
  return transform(DATA);
}

function fmtDate (date: string) {
  return sdf.format(new Date(date));
}

function comp (a: typeof DATA[number], b: typeof DATA[number]) {
  return (new Date(a.Date)).getTime() - (new Date(b.Date)).getTime();
}

function transform (data: typeof DATA): CandleStickData[] {
  return data.sort(comp).map(item => ({
    date: fmtDate(item.Date),
    low: item.Low,
    high: item.High,
    open: item.Open,
    close: item.Close,
    adjClose: item['Adj Close'],
  }));
}

export default Page;
