'use client';
import { FC } from 'react';
import useSWR from 'swr';
import clsx from 'clsx';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Scrollable from '@/components/Scrollable';

const IndexCompositions: FC<{ index: string }> = ({ index }) => {
  const { data = [] } = useSWR([index, 'compositions'], compositions);

  return (
    <Scrollable className="h-[400px]">
      <ol>
        {data.map(item => (
          <li key={item.stock_symbol} className="mt-4 first-of-type:mt-0">
            <Link className="flex items-center py-2 px-4 rounded-lg transition-colors hover:bg-secondary outline-none focus:bg-secondary" href={`/stocks/${item.stock_symbol}`}>
                <span className="flex flex-col">
                  <span className="text-significant">
                    {item.stock_symbol}
                    <span className="text-secondary ml-2 text-sm">{item.exchange_symbol}</span>
                  </span>
                  <span className="text-primary">{item.short_name}</span>
                </span>

              <span className="flex-1">
                </span>
              <span className="flex flex-col text-right">
                  <span className="text-significant text-2xl">{item.last_close_price.toFixed(2)}</span>
                  <span>
                    <PercentTag value={item.last_change_percentage} />
                  </span>
                </span>
            </Link>
          </li>
        ))}
      </ol>
    </Scrollable>
  );
};

export default IndexCompositions;

const PercentTag = ({ value }: { value: number }) => {
  return (
    <span className={clsx('inline-flex items-center justify-end text-significant rounded px-1 min-w-[80px]', value > 0 ? 'bg-red-600' : value < 0 ? 'bg-green-600' : 'bg-gray-600')}>
      {value > 0 ? <ArrowUpIcon className="inline-block h-4" /> : value < 0 ? <ArrowDownIcon className="inline-block h-4" /> : undefined}
      {Math.abs(value * 100).toFixed(2)}%
    </span>
  );
};

type IndexCompositionRecord = {
  exchange_symbol: string
  last_2nd_close_price: number
  last_change_day: string
  last_change_percentage: number
  last_close_price: number
  short_name: string
  stock_symbol: string
  weight: number
}

const compositions = async ([index]: [string]): Promise<IndexCompositionRecord[]> => {
  const res = await fetch(`/api/indexes/${index}/compositions`);
  const { rows } = await res.json();
  return rows.map(({ last_2nd_close_price, last_change_percentage, last_close_price, ...rest }: any) => ({
    ...rest,
    last_2nd_close_price: parseFloat(last_2nd_close_price),
    last_change_percentage: parseFloat(last_change_percentage),
    last_close_price: parseFloat(last_close_price),
  }));
};
