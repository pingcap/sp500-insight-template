import { FC, Suspense, use } from 'react';
import Stocks from '@/components/Stocks';
import { fetchUserSelectedStocks } from '@/app/optional/data';

const SideResolved: FC = () => {
  const stocks = use(fetchUserSelectedStocks(1));

  return (
    <Stocks
      className="md:sticky md:top-[42px] md:h-[calc(100vh-42px)]"
      stocks={stocks}
      href="/optional/<symbol>"
      userId={1}
      searchPlaceholder="Search all..."
    />
  );
};

export const SideLoading: FC = () => {
  return (
    <Stocks
      className="md:sticky md:top-[42px] md:h-[calc(100vh-42px)]"
      stocks={[]}
      loading={3}
      href="/optional/<symbol>"
      userId={1}
      searchPlaceholder="Search all..."
    />
  );
};

const Side: FC = () => {
  return (
    <Suspense fallback={<SideLoading />}>
      <SideResolved />
    </Suspense>
  );
};

export default Side;
