import IndexCompositions from '@/charts/IndexCompositions';
import IndexCompositionGeoDistribution from '@/charts/IndexCompositionGeoDistribution';
import IndexCompositionExchangeDistribution from '@/charts/IndexCompositionExchangeDistribution';

export default function Page ({ params: { index } }: { params: { index: string } }) {
  return (
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
  );
}