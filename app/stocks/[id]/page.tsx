import StockOverview from '@/charts/StockOverview';
import { use } from 'react';
import { getStockInfo } from '@/app/api/stocks/[symbol]/route';
import './page.css';
import { notFound } from 'next/navigation';

const Page = function ({ params }: { params: { id: string } }) {
  const company = use(fetchStockInfo(params.id));

  return (
    <main className="company container">
      <h1 className="name">
        {company.long_name}
      </h1>
      <p className="description">
        {company.long_business_summary}
      </p>
      <StockOverview index={params.id} />
    </main>
  );
};

export default Page;

const fetchStockInfo = async (index: string) => {
  const { rows } = await getStockInfo(index);

  if (rows.length === 0) {
    notFound();
  }

  return rows[0];
};
