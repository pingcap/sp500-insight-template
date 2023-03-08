'use client';
import { FC, useMemo, useState } from 'react';
import useSWR from 'swr';
import clsx from 'clsx';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import Scrollable from '@/components/Scrollable';
import List, { ListItem, ListSearch } from '@/components/List';

const IndexCompositions: FC<{ index: string }> = ({ index }) => {
  const [search, setSearch] = useState('');
  const { data = [] } = useSWR([index, 'compositions'], compositions);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.stock_symbol.toLowerCase().indexOf(search) !== -1
      || item.short_name.toLowerCase().indexOf(search) !== -1,
    );
  }, [search, data]);

  return (
    <>
      <ListSearch value={search} onChange={setSearch} className='my-2' />
      <Scrollable className="h-[400px]">
        <List>
          {filteredData.map(item => (
            <ListItem
              key={item.stock_symbol} className="mt-4 first-of-type:mt-0" href={`/stocks/${item.stock_symbol}`}
              text={(
                <>
                  {item.stock_symbol}
                  <span className="text-secondary ml-2 text-sm">
                  {item.exchange_symbol}
                </span>
                </>
              )}
              description={item.short_name}
              detail={(
                <span className="flex flex-col text-right">
                <span className="text-significant text-2xl">
                  {item.last_close_price.toFixed(2)}
                </span>
                <span>
                  <PercentTag value={item.last_change_percentage} />
                </span>
              </span>
              )}
            />
          ))}
        </List>
      </Scrollable>
    </>
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
