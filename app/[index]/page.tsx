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
        This is a sample stock analysis application. We have selected S&P 500 Index data and detailed stock price changes for constituent stocks from 2013.1 to 2023.1 for this sample program. Based on this sample program, you can learn how to build a stock analysis program on TiDB Serverless and Data API. We will provide you with the sample code and dataset of this application for reference.
        Here, you can get:
      </p>
      <ul className="basic-links text-lg text-primary list-disc list-inside mt-2">
        <li><a href="#index">S&P 500 Index</a></li>
        <li><Link href="/optional">Customized list of stocks, monitoring the stock price changes of selected constituent stocks</Link></li>
        <li><Link href="/SP500/sector-ranking">Ranking based on industry total market capitalization</Link></li>
        <li><Link href="/SP500/constituents">Rankings of constituent stocks based on market capitalization in the industry</Link></li>
        <li><Link href="/SP500/constituents#geo">Distribution of constituent stocks by country (geography)</Link></li>
        <li><Link href="/SP500/constituents#exchanges">Proportional distribution of exchanges</Link></li>
        <li>Detailed information and Candle-stick chart of individual constituent stocks</li>
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
          changes in the S&P 500 Index by selecting a time frame ranging from 7 days (7D) to MAX.
        </p>
        <IndexOverview index={index} />
      </section>
    </>
  );
}
