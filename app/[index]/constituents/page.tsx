import IndexCompositions from '@/charts/IndexCompositions';
import IndexCompositionGeoDistribution from '@/charts/IndexCompositionGeoDistribution';
import IndexCompositionExchangeDistribution from '@/charts/IndexCompositionExchangeDistribution';

export default function Page ({ params: { index } }: { params: { index: string } }) {
  return (
    <section className="mt-8">
      <h2 className="my-4">
        Constituents
      </h2>
      <p className="mt-4">A constituent is a company whose shares are part of an index such as the S&P 500 or Dow Jones Industrial Average (DJIA). It is a component or a member of an index. The weighted aggregation of the share prices of all its constituents is used to calculate the value of an index.</p>
      <IndexCompositions index={index} />
      <h3 id="geo" className="mt-4">Country & Region distribution</h3>
      <IndexCompositionGeoDistribution index={index} />
      <h3 id="exchanges" className="mt-4">Exchange distribution</h3>
      <p className="mt-4">In stock market trading, an exchange is a marketplace where stocks, bonds, options, futures, and other financial instruments are bought and sold. Exchanges provide a platform for buyers and sellers to meet and negotiate prices. They also provide a mechanism for pricing and clearing trades, as well as collecting and distributing market data.</p>
      <IndexCompositionExchangeDistribution index={index} />
    </section>
  );
}