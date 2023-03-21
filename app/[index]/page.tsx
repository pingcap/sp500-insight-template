import IndexOverview from '@/charts/IndexOverview';
import IndustryDistribution from '@/charts/IndustryDistribution';
import CompositionTabs from './CompositionTabs';

export default function Home ({ params: { index } }: { params: { index: string } }) {

  return (
    <main className="max-w-[960px] mx-auto">
      <h1>S&P 500 Insight</h1>
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
        <CompositionTabs index={index} />
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
