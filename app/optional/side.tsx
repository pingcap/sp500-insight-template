'use client';
import { FC } from 'react';
import Stocks from '@/components/Stocks';

const Side: FC = () => {
  return (
    <Stocks
      className="md:sticky md:top-[42px] md:h-[calc(100vh-42px)]"
      href="/optional/<symbol>"
      userId={1}
      searchPlaceholder="Search all..."
    />
  );
};

export default Side;
