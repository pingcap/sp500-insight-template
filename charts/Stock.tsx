'use client';
import { FC } from 'react';
import { ListItem } from '@/components/List';
import clsx from 'clsx';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import { unstable_cache } from '@/utils/cache';
import { useSelectedLayoutSegment } from 'next/navigation';

export interface UnresolvedStockItem {
  stock_symbol: string;
  short_name?: string;
  exchange_symbol?: string;
  last_close_price?: number;
  last_change_percentage?: number;
}

export interface StockItem extends UnresolvedStockItem {
  short_name: string;
  exchange_symbol: string;
  last_close_price: number;
  last_change_percentage: number;
}

interface StockProps {
  stock: StockItem | UnresolvedStockItem;
  href?: string;
}

const Stock: FC<StockProps> = ({ stock: propStock, href }) => {
  // const [stock, setStock] = useState(propStock as StockItem);
  //
  // console.log(stock, isUnresolved(stock));
  //
  // if (isUnresolved(stock)) {
  //   setStock(use(fetchStockSummary(stock.stock_symbol)));
  // }

  const stock = propStock as StockItem;
  const symbol = useSelectedLayoutSegment();

  href = href ? href.replaceAll('<symbol>', stock.stock_symbol) : `/stocks/${stock.stock_symbol}`;

  return (

    <ListItem
      className={clsx(stock.stock_symbol, { 'bg-secondary': symbol === stock.stock_symbol })}
      href={href}
      text={(
        <>
          {stock.stock_symbol}
          <span className="text-secondary ml-2 text-sm">
            {stock.exchange_symbol}
          </span>
        </>
      )}
      description={stock.short_name}
      detail={(
        <span className="flex flex-col text-right">
          <span className="text-significant text-2xl">
            {stock.last_close_price.toFixed(2)}
          </span>
          <span>
            <PercentTag value={stock.last_change_percentage} />
          </span>
        </span>
      )}
    />
  );
};

Stock.displayName = 'Stock';

export default Stock;

const fetchStockSummary = unstable_cache(async (id: string): Promise<StockItem> => {
  const res = await fetch(`/api/stocks/${id}/summary`);
  const { rows } = await res.json();
  return rows[0];
});

const PercentTag = ({ value }: { value: number }) => {
  return (
    <span className={clsx('inline-flex items-center justify-end text-significant rounded px-1 min-w-[80px]', value > 0 ? 'bg-red-600' : value < 0 ? 'bg-green-600' : 'bg-gray-600')}>
      {value > 0 ? <ArrowUpIcon className="inline-block h-4" /> : value < 0 ? <ArrowDownIcon className="inline-block h-4" /> : undefined}
      {Math.abs(value * 100).toFixed(2)}%
    </span>
  );
};

function isUnresolved (stock: any): stock is UnresolvedStockItem {
  return !(stock.short_name || stock.last_close_price || stock.exchange_symbol || stock.last_change_percentage);
}
