import { cache, use } from 'react';
import { getStock } from '@/app/stocks/api';
import './page.css';
import { notFound } from 'next/navigation';
import StockOverview from '@/charts/StockOverview';

const Page = function ({ params }: { params: { id: string } }) {
  const company = use(cache(getStock)(params.id));

  if (!company) {
    notFound();
  }

  return (
    <main className="company container">
      <h1 className="name">{company.longname}</h1>
      <StockOverview index={params.id} />
      <p className="description">{company.longbusinesssummary}</p>
    </main>
  );
};

export default Page;
