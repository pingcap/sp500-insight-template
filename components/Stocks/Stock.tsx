'use client';
import { cloneElement, FC, use, useState } from 'react';
import { ListItem, ListItemProps } from '@/components/List';
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

export type AnyStockItem = StockItem | UnresolvedStockItem;

interface StockProps extends Omit<ListItemProps, 'text' | 'description' | 'detail' | 'href'> {
  stock: AnyStockItem;
  href?: string;
}

const Stock: FC<StockProps> = ({ stock: propStock, href, className, overlay, ...props }) => {
  const [stock, setStock] = useState(propStock);

  if (!isResolved(stock)) {
    setStock(use(fetchStockSummary(stock.stock_symbol)));
  }

  const symbol = useSelectedLayoutSegment();

  href = href ? href.replaceAll('<symbol>', stock.stock_symbol) : `/stocks/${stock.stock_symbol}`;

  if (!isResolved(stock)) {
    return (
      <ListItem
        href={href}
        text={stock.stock_symbol}
      />
    )
  } else {
    return (
      <ListItem
        className={clsx(stock.stock_symbol, { 'bg-secondary': symbol === stock.stock_symbol }, className)}
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
        overlay={overlay && cloneElement(overlay, { stock })}
        {...props}
      />
    );
  }

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

function isResolved (stock: AnyStockItem): stock is StockItem {
  return !!stock.short_name;
}
