import IndexOverview from '@/charts/IndexOverview';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default function Home ({ params: { index } }: { params: { index: string } }) {
  if (index !== 'SP500') {
    notFound();
  }

  return (
    <>
      <h1>S&P 500 Insight</h1>
      <h2 className="mt-4">Overview</h2>
      <p className="mt-4">
        This is a stock analysis demo that uses [TiDB Serverless](https://tidbcloud.com/) and [TiDB Cloud Data Service](https://docs.pingcap.com/tidbcloud/data-service-overview). 
        We analyzed the data of the S&P 500 from 2013 to 2023 and used it as a dataset to build this application. You can get the dataset and code for this demo[Todo: please add link here], then you can rebuild the same application on your own TiDB Serverless Cluster for free.
        In this demo, you can see the following features:
      </p>
      <ul className="basic-links text-lg text-primary list-disc list-inside mt-2">
        <li><a href="#index">S&P 500 Index</a></li>
        <li><Link href="/optional">List of selected stocks</Link></li>
        <li><Link href="/SP500/sector-ranking">Rankings of constituent stocks</Link></li>
        <li><Link href="/SP500/constituents">Analysis of constituent stocks based on different industries</Link></li>
        <li><Link href="/SP500/constituents#geo">Distribution of constituent stocks by country (geography)</Link></li>
        <li><Link href="/SP500/constituents#exchanges">Proportional distribution of exchanges</Link></li>
        <li>Detailed information of stocks, including candle-stick chart over the past decade</li>
      </ul>
      <section className="mt-8">
        <h2 id="index" className="my-4">
          S&P 500 Index
        </h2>
        <p className="mt-2 basic-links">
          The <b>Standard and Poor&apos;s 500</b>, or simply the <b>S&P 500</b>, is a
          {' '}
          <a href="https://en.wikipedia.org/wiki/Stock_market_index" target="_blank">stock market index</a>
          {' '}
          tracking the stock performance of 500 large companies listed on
          {' '}
          <a href="https://en.wikipedia.org/wiki/Stock_exchange" target="_blank">stock exchanges</a>
          {' '}
          in the United States. It is one of the most commonly followed equity indices. You can view the
          changes in the following S&P 500 Index by selecting a time frame ranging from 7 days (7D) to MAX.
        </p>
        <IndexOverview index={index} />
      </section>
    </>
  );
}
