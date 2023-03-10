import { FC, PropsWithChildren, ReactNode, Suspense, use } from 'react';
import { unique } from '@/datasource/query';
import { getStockInfo } from '@/datasource/stocks';
import CompanyOverview from '@/components/CompanyOverview';

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
  const company = unique(use(getStockInfo(symbol)));
  return (
    <CompanyOverview company={company}>
      {children}
    </CompanyOverview>
  );
};

export default Layout;