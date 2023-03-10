'use client';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import List, { ListSearch } from '@/components/List';
import Stock, { AnyStockItem } from './Stock';
import StockContextMenu from './StockMenu';
import StockOverlay from './StockOverlay';
import useSWR from 'swr';
import { compositions } from '@/charts/IndexCompositions';
import Scrollable from '@/components/Scrollable';
import clsx from 'clsx';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useRefCallback } from '@/utils/hook';
import StockSkeleton from '@/components/Stocks/StockSkeleton';

export interface StocksProps {
  className?: string;
  stocks: AnyStockItem[];
  href?: string;
  userId?: number;
  searchPlaceholder?: string;
  loading?: number | false;
}

const Stocks: FC<StocksProps> = ({ className, stocks: propStocks, href, userId, searchPlaceholder, loading }: StocksProps) => {
  const currentSymbol = useSelectedLayoutSegment();

  const [filterTriggered, setFilterTriggered] = useState(false);
  const [filter, setFilter] = useState('');
  const [stocks, setStocks] = useState(propStocks);
  const { hasOperations, onAdd, ...operations } = useStockOperations(userId, setStocks);

  const { data: all = [] } = useSWR(filterTriggered && hasOperations ? ['SP500', 'compositions'] : undefined, compositions);

  useEffect(() => {
    if (propStocks !== stocks) {
      setStocks(propStocks);
    }
  }, [propStocks]);

  const handleFilterChange = useRefCallback((value: string) => {
    setFilter(value);
    setFilterTriggered(true);
  });

  const filtered = useMemo(() => {
    if (filter) {
      return (hasOperations ? all : stocks).filter(item =>
        item.stock_symbol.toLowerCase().indexOf(filter.toLowerCase()) !== -1
        || item.short_name?.toLowerCase().indexOf(filter.toLowerCase()) !== -1,
      );
    } else {
      return stocks;
    }
  }, [filter, all, stocks, hasOperations]);

  const hasStock = useCallback((symbol: string) => {
    return !!stocks.find(s => s.stock_symbol === symbol);
  }, [stocks]);

  return (
    <div className={clsx('py-4', className)}>
      <ListSearch value={filter} onChange={handleFilterChange} placeholder={searchPlaceholder} />
      <Scrollable className="mt-4 h-[400px] md:h-[calc(100%-52.5px)]">
        <List>
          {/* TODO: simplify this */}
          {currentSymbol && filtered.findIndex(s => s.stock_symbol === currentSymbol) === -1 && (
            <Stock
              key={currentSymbol}
              stock={{ stock_symbol: currentSymbol }}
              overlay={<StockOverlay onAdd={onAdd} />}
            />
          )}
          {filtered.map((stock) => (
            <Stock
              key={stock.stock_symbol}
              stock={stock}
              href={href}
              menu={hasOperations ? <StockContextMenu stock={stock} {...operations} /> : undefined}
              overlay={!hasStock(stock.stock_symbol) ? <StockOverlay onAdd={onAdd} /> : undefined}
            />
          ))}
          {loading && Array(loading).fill(null).map((_, i) => (
            <StockSkeleton key={i} />
          ))}
        </List>
      </Scrollable>
    </div>
  );
};

Stocks.displayName = 'Stocks';

export default Stocks;

function useStockOperations (userId: number | undefined, setStocks: (mutate: (stocks: AnyStockItem[]) => AnyStockItem[]) => void) {
  const remove = useCallback((stockSymbol: string) => {
    void fetch(`/api/user/selected_stocks`, {
      method: 'DELETE',
      body: JSON.stringify({
        stockSymbol,
      }),
    });
    setStocks((stocks) => stocks.filter(stock => stock.stock_symbol !== stockSymbol));
  }, []);

  const add = useCallback((stock: AnyStockItem) => {
    void fetch(`/api/user/selected_stocks`, {
      method: 'POST',
      body: JSON.stringify({
        stockSymbol: stock.stock_symbol,
      }),
    });
    setStocks((stocks) => [stock, ...stocks]);
  }, []);

  if (typeof userId === 'number' && isFinite(userId)) {
    return {
      hasOperations: true,
      onRemove: remove,
      onAdd: add,
    };
  } else {
    return {
      hasOperations: false,
      onRemove: undefined,
      onAdd: undefined,
    };
  }
}
