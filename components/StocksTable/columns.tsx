import { AnyStockItem, isResolved, StockItem } from '@/components/Stocks';
import { ReactElement } from 'react';
import { ClassValue } from 'clsx';
import { SkeletonInline } from '@/components/Skeleton';
import { isStockFieldResolved } from '@/components/Stocks/Stock';
import Link from 'next/link';

export type Column = {
  field?: string
  title: string
  renderCell: (stock: AnyStockItem, index: number, list: AnyStockItem[]) => ReactElement | string | number
  cellClassName?: (stock: AnyStockItem, index: number, list: AnyStockItem[]) => ClassValue
  ordered?: boolean
}

const textColor = (field: keyof StockItem) => {
  return (stock: AnyStockItem) =>
    isStockFieldResolved(stock, field)
      ? stock[field] > 0
        ? 'text-ups'
        : stock[field] < 0
          ? 'text-downs'
          : undefined
      : undefined;
};

const columns: Column[] = [
  {
    title: 'No',
    renderCell: (stock, index) => index + 1,
    cellClassName: () => 'text-secondary',
  },
  {
    title: 'Symbol',
    renderCell: stock => (
      <Link href={`/stocks/${stock.stock_symbol}`}>
        {stock.stock_symbol}
      </Link>
    ),
  },
  {
    title: 'Name',
    renderCell: stock => (
      <Link href={`/stocks/${stock.stock_symbol}`}>
        {isResolved(stock) ? stock.short_name : <SkeletonInline estimateCharacters={7} />}
      </Link>
    ),
  },
  {
    field: 'last_close_price',
    title: 'Price',
    renderCell: stock => isStockFieldResolved(stock, 'last_close_price') ? base(stock.last_close_price) : <SkeletonInline estimateCharacters={3} />,
    cellClassName: textColor('last_change'),
    ordered: true
  },
  {
    field: 'last_change',
    title: 'Chg',
    renderCell: stock => isStockFieldResolved(stock, 'last_change') ? base(stock.last_change) : <SkeletonInline estimateCharacters={2} />,
    cellClassName: textColor('last_change'),
    ordered: true,
  },
  {
    field: 'last_change_percentage',
    title: '% Chg',
    renderCell: stock => isStockFieldResolved(stock, 'last_change_percentage') ? percent(stock.last_change_percentage) : <SkeletonInline estimateCharacters={2} />,
    cellClassName: textColor('last_change'),
    ordered: true,
  },
  {
    field: 'market_cap',
    title: 'Market cap',
    renderCell: stock => isStockFieldResolved(stock, 'market_cap') ? usd(stock.market_cap) : <SkeletonInline estimateCharacters={2} />,
    ordered: true,
  },
  {
    field: 'revenue_growth',
    title: 'Revenue Growth',
    renderCell: stock => isStockFieldResolved(stock, 'revenue_growth') ? percent(stock.revenue_growth) : <SkeletonInline estimateCharacters={2} />,
    cellClassName: textColor('revenue_growth'),
    ordered: true,
  },
];

export default columns;

function base (value: number | undefined | null) {
  if (value == null) {
    return '--';
  }
  return value.toFixed(2);
}

function percent (value: number | undefined | null) {
  if (value == null) {
    return '--';
  }
  return (value * 100).toFixed(2) + '%';
}

function usd (value: number | undefined | null) {
  if (value == null) {
    return '--';
  }
  return usdFormatter.format(value);
}

const usdFormatter = new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});
