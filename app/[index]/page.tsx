import IndexOverview from '@/charts/IndexOverview';
import IndexCompositions from '@/charts/IndexCompositions';
import IndexCompositionGeoDistribution from '@/charts/IndexCompositionGeoDistribution';
import IndexCompositionExchangeDistribution from '@/charts/IndexCompositionExchangeDistribution';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SectorsRanking from '@/charts/SectorsRanking';

export default function Home ({ params: { index } }: { params: { index: string } }) {
  if (index !== 'SP500') {
    notFound();
  }

  return (
    <main className="max-w-[960px] mx-auto">
      <h1>S&P 500 Insight</h1>
      <h2 className="mt-4">Overview</h2>
      <p className="mt-4">
        This is a sample stock analysis application. We have selected S&P 500 Index data and detailed stock price changes for constituent stocks from 2013.1 to 2023.1 for this sample program. Based on this sample program, you can learn how to build a stock analysis program on TiDB Serverless and Data API. We will provide you with the sample code and dataset of this application for reference.
        Here, you can get:
      </p>
      <ul className="basic-links text-lg text-primary list-disc list-inside mt-2">
        <li><a href="#index">S&P 500 Index</a></li>
        <li><Link href="/optional">Customized list of stocks, monitoring the stock price changes of selected constituent stocks</Link></li>
        <li><a href="#industry-ranking">Ranking based on industry total market capitalization</a></li>
        <li><a href="#compositions">Rankings of constituent stocks based on market capitalization in the industry</a></li>
        <li><a href="#geo">Distribution of constituent stocks by country (geography)</a></li>
        <li><a href="#exchanges">Proportional distribution of exchanges</a></li>
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
      <section className="mt-8">
        <h2 id="industry-ranking">Ranking</h2>
        <p className="mt-4">
          Based on Industry total capitalization
        </p>
        <SectorsRanking index={index} />
      </section>
      <section className="mt-8">
        <h2 id="compositions" className="my-4">
          Compositions
        </h2>
        <p className="mt-4">Composition in stocks index is the set of stocks included in a particular stock index. A stock index is a statistical measure of the value of a section of the stock market, and composition refers to the individual companies that make up that index. The composition of a stock index can be affected by changes in the market, such as mergers, acquisitions, and bankruptcies. Knowing the composition of a stock index can help investors determine which stocks are performing
          well, and which ones are not.</p>
        <IndexCompositions index={index} />
        <h3 id="geo" className="mt-4">Country & Region distribution</h3>
        <IndexCompositionGeoDistribution index={index} />
        <h3 id="exchanges" className="mt-4">Exchange distribution</h3>
        <p className="mt-4">In stock market trading, an exchange is a marketplace where stocks, bonds, options, futures, and other financial instruments are bought and sold. Exchanges provide a platform for buyers and sellers to meet and negotiate prices. They also provide a mechanism for pricing and clearing trades, as well as collecting and distributing market data.</p>
        <IndexCompositionExchangeDistribution index={index} />
      </section>
    </main>
  );
}
