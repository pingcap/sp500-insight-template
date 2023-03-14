import { FC, PropsWithChildren, ReactNode, Suspense, use } from 'react';
import CompanyOverview from '@/components/CompanyOverview';
import { dataOf, executeEndpoint, withUpstreamErrorLogged } from '@/utils/data-api/server';
import endpoints from '@/datasource/endpoints';

const Layout: FC<PropsWithChildren<{ params: { symbol: string } }>> = ({ children, params: { symbol } }) => {
  return (
    <Suspense
      fallback={<CompanyOverview>{children}</CompanyOverview>}
    >
      <CompanyOverviewInternal symbol={symbol}>
        {children}
      </CompanyOverviewInternal>
    </Suspense>
  );
};

const CompanyOverviewInternal: FC<{ symbol: string, children: ReactNode }> = ({ symbol, children }) => {
  const company = dataOf(use(withUpstreamErrorLogged(() => executeEndpoint(endpoints.stock.info.GET, { stock_symbol: symbol }))));
  return (
    <CompanyOverview company={company}>
      {children}
    </CompanyOverview>
  );
};

export default Layout;