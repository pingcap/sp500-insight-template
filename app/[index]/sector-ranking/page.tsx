import SectorsRanking from '@/charts/SectorsRanking';

export default function Page ({ params: { index } }: { params: { index: string } }) {
  return (
    <section className="mt-8">
      <h2 id="industry-ranking">Ranking</h2>
      <p className="mt-4">
        The following chart shows the industry ranking of S&P 500 constituent stocks based on market capitalization.
        In addition to market capitalization, we also display the number of companies and average revenue growth rate for each industry in the chart.
        <br />
        we also provide a table format at the bottom, which is useful for a more intuitive view of the various industry metrics.
      </p>
      <SectorsRanking index={index} />
    </section>
  );
}
