import DATA from './mock.json';
import Candlestick, { CandleStickData } from './Candlestick';
import { cache, Suspense, use } from 'react';

const sdf = Intl.DateTimeFormat('en', { dateStyle: 'short' });

const Page = function ({ params }: { params: { id: string } }) {
  const data = use(cache(getData)());

  return (
    <>
      <h1>hi</h1>
      <Suspense
        fallback={
          <Candlestick
            key='chart'
            className="w-full max-w-2xl m-auto aspect-video"
            loading
            data={[]}
          />
        }
      >
        <Candlestick
          key='chart'
          className="w-full max-w-2xl m-auto aspect-video"
          loading={false}
          data={data}
        />
      </Suspense>
    </>
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
