import SectorsRanking from '@/charts/SectorsRanking';

export default function Page ({ params: { index } }: { params: { index: string } }) {
  return (
    <section className="mt-8">
      <h2 id="industry-ranking">Ranking</h2>
      <p className="mt-4">
        Based on Industry total capitalization
      </p>
      <SectorsRanking index={index} />
    </section>
  );
}
