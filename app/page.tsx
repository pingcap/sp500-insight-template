import SP500Overview from '@/charts/SP500Overview';
import IndustryDistribution from '@/charts/IndustryDistribution';

export default function Home () {

  return (
    <main className="max-w-[960px] mx-auto">
      <h1>S&P 500 Insight</h1>
      <section className="mt-8">
        <h2 className="my-4">
          Overview
        </h2>
        <SP500Overview />
      </section>
      <section className="mt-8">
        <h2 className="my-4">
          Sectors
        </h2>
        <IndustryDistribution />
      </section>
    </main>
  );
}
