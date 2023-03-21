import IndexOverview from '@/charts/IndexOverview';
import IndustryDistribution from '@/charts/IndustryDistribution';
import IndexCompositions from '@/charts/IndexCompositions';
import IndexCompositionCountryDistribution from '@/charts/IndexCompositionCountryDistribution';
import IndexCompositionExchangeDistribution from '@/charts/IndexCompositionExchangeDistribution';

export default function Home ({ params: { index } }: { params: { index: string } }) {

  return (
    <main className="max-w-[960px] mx-auto">
      <h1>S&P 500 Insight</h1>
      <h2 className="mt-4">Overview</h2>
      <p className="text-lg text-primary mt-4">
        This is a sample stock analysis application. We have selected S&P 500 Index data and detailed stock price changes for constituent stocks from 2013.1 to 2023.1 for this sample program. Based on this sample program, you can learn how to build a stock analysis program on TiDB Serverless and Data API. We will provide you with the sample code and dataset of this application for reference.
        Here, you can get:
      </p>
      <ul className="text-lg text-primary list-disc list-inside mt-2">
        <li>S&P 500 Index</li>
        <li>Customized list of stocks, monitoring the stock price changes of selected constituent stocks</li>
        <li>Ranking based on industry total market capitalization</li>
        <li>Rankings of constituent stocks based on market capitalization in the industry</li>
        <li>Distribution of constituent stocks by country (geography)</li>
        <li>Proportional distribution of exchanges</li>
        <li>Detailed information and Candle-stick chart of individual constituent stocks</li>
      </ul>
      <section className="mt-8">
        <h2 className="my-4">
          Overview
        </h2>
        <IndexOverview index={index} />
      </section>
      <section className="mt-8">
        <h2 className="my-4">
          Compositions
        </h2>
        <IndexCompositions index={index} />
        <h3 className='mt-4'>Country distribution</h3>
        <IndexCompositionCountryDistribution index={index} />
        <h3 className='mt-4'>Exchange distribution</h3>
        <IndexCompositionExchangeDistribution index={index} />
      </section>
      <section className="mt-8">
        <h2 className="my-4">
          Sectors
        </h2>
        <IndustryDistribution index={index} />
      </section>
    </main>
  );
}
