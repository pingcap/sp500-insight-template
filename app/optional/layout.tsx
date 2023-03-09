import { PropsWithChildren, use } from 'react';
import Stocks from '@/charts/Stocks';
import { fetchUserSelectedStocks } from '@/app/optional/data';

const Layout = ({ children }: PropsWithChildren) => {
  const stocks = use(fetchUserSelectedStocks(1));

  return (
    <div className="container mx-auto px-4 md:grid md:grid-cols-12 gap-8">
      <aside className="md:col-span-4">
        <Stocks
          stocks={stocks}
          href="/optional/<symbol>"
          userId={1}
          searchPlaceholder='Search all...'
        />
      </aside>
      <main className="md:col-span-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

