'use client';
import { cloneElement, FC, useMemo } from 'react';
import { ListItem, ListItemProps } from '@/components/List';
import clsx from 'clsx';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import { useSelectedLayoutSegment } from 'next/navigation';
import { SkeletonInline } from '@/components/Skeleton';
import { useAuto } from '@/utils/hook';
import { PendingPercentTag } from './StockSkeleton';
import { clientEndpointFetcher } from '@/utils/data-api/client';
import endpoints from '@/datasource/endpoints';

export interface UnresolvedStockItem {
  stock_symbol: string;
  short_name?: string;
  exchange_symbol?: string;
  last_close_price?: number;
  last_change_percentage?: number;
  market_cap?: number
  revenue_growth?: number
}

export interface StockItem extends UnresolvedStockItem {
  short_name: string;
  exchange_symbol: string;
  last_close_price: number;
  last_change: number;
  last_change_percentage: number;

  market_cap: number
  revenue_growth?: number
}

export type AnyStockItem = StockItem | UnresolvedStockItem;

interface StockProps extends Omit<ListItemProps, 'text' | 'description' | 'detail' | 'href'> {
  stock: AnyStockItem;
  href?: string;
  onStockInfoLoad?: (stockItem: StockItem) => void;
}

const Stock: FC<StockProps> = ({ stock, href, className, overlay, onStockInfoLoad, ...props }) => {
  stock = useAuto(stock, isResolved, fetchStockSummary, onStockInfoLoad);
  const symbol = useSelectedLayoutSegment();

  href = useMemo(() => {
    return href ? href.replaceAll('<symbol>', stock.stock_symbol) : `/stocks/${stock.stock_symbol}`;
  }, [href, stock.stock_symbol]);

  return (
    <ListItem
      className={clsx(stock.stock_symbol, { 'bg-secondary': symbol === stock.stock_symbol }, className)}
      href={href}
      text={(
        <>
          {stock.stock_symbol}
          <span className="text-secondary ml-2 text-sm">
            <SkeletonInline estimateCharacters={3}>
              {stock.exchange_symbol}
            </SkeletonInline>
          </span>
        </>
      )}
      description={(
        <SkeletonInline estimateCharacters={8}>
          {stock.short_name}
        </SkeletonInline>
      )}
      detail={(
        <span className="flex flex-col text-right">
          <span className="text-significant text-2xl">
            <SkeletonInline estimateCharacters={3}>
              {stock.last_close_price?.toFixed(2)}
            </SkeletonInline>
          </span>
          <span>
            {stock.last_change_percentage ? <PercentTag value={stock.last_change_percentage} /> : <PendingPercentTag />}
          </span>
        </span>
      )}
      overlay={overlay && cloneElement(overlay, { stock })}
      {...props}
    />
  );
};

Stock.displayName = 'Stock';

export default Stock;

export const fetchStockSummary = async (stock: UnresolvedStockItem) => {
  return await clientEndpointFetcher([endpoints.stock.summary.GET, { stock_symbol: stock.stock_symbol }]);
};

const PercentTag = ({ value }: { value: number }) => {
  return (
    <span className={clsx('inline-flex items-center justify-end text-significant rounded px-1 min-w-[80px]', value > 0 ? 'bg-red-600' : value < 0 ? 'bg-green-600' : ' bg-[#888]')}>
      {value > 0 ? <ArrowUpIcon className="inline-block h-4" /> : value < 0 ? <ArrowDownIcon className="inline-block h-4" /> : undefined}
      {Math.abs(value * 100).toFixed(2)}%
    </span>
  );
};

export function isResolved (stock: AnyStockItem): stock is StockItem {
  return !!stock.short_name;
}

export function isStockFieldResolved<K extends keyof StockItem> (stock: AnyStockItem, field: K): stock is AnyStockItem & { [P in K]: Exclude<StockItem[P], undefined> } {
  return field in stock;
}
