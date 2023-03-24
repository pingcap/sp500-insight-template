import IndexCompositions from '@/charts/IndexCompositions';
import IndexCompositionGeoDistribution from '@/charts/IndexCompositionGeoDistribution';
import IndexCompositionExchangeDistribution from '@/charts/IndexCompositionExchangeDistribution';

export default function Page ({ params: { index } }: { params: { index: string } }) {
  return (
    <section className="mt-8">
      <h2 className="my-4">
        Constituents
      </h2>
      <p className="mt-4">The following list shows the basic information of all constituent stocks in the S&P 500, including the latest price in the dataset, 
      the price change of the day, the percentage change, market capitalization, and revenue growth rate. You can filter the list by selecting different industry tags.</p>
      <IndexCompositions index={index} />
      <h3 id="geo" className="mt-4">Country & Region distribution</h3>
      <p className="mt-4">The following map shows the geographic distribution of constituent stocks based on country. Hovering your mouse over the highlighted areas allows you to see the number of companies in that region. 
      Although most of the S&P 500 constituent stocks are from the United States, this is a showcase of how to implement a geographic chart, which can serve as a reference.</p>
      <IndexCompositionGeoDistribution index={index} />
      <h3 id="exchanges" className="mt-4">Exchange distribution</h3>
      <p className="mt-4">In stock market trading, an exchange refers to a marketplace where stocks, bonds, options, futures, and other financial instruments are bought and sold. 
      The following pie chart illustrates the composition of S&P 500 constituent stocks across different exchanges. This is also an example showcasing how to implement a pie chart.</p>
      <IndexCompositionExchangeDistribution index={index} />
    </section>
  );
map