'use client';
import { FC, useCallback, useMemo, useState } from 'react';
import List, { ListSearch } from '@/components/List';
import Stock, { AnyStockItem, StockItem } from './Stock';
import StockContextMenu from './StockMenu';
import StockOverlay from './StockOverlay';
import Scrollable from '@/components/Scrollable';
import clsx from 'clsx';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useRefCallback } from '@/utils/hook';
import StockSkeleton from '@/components/Stocks/StockSkeleton';
import { useComposedEndpoint } from '@/utils/data-api/client';
import endpoints from '@/datasource/endpoints';
import stocksStore from '@/components/Stocks/stocks-store';

export interface StocksProps {
  className?: string;
  href?: string;
  userId?: number;
  searchPlaceholder?: string;
  loading?: number | false;
  stocks: AnyStockItem[];
  onStockInfoLoaded?: (stock: StockItem) => void;
  onStocksUpdate?: (mutate: (stocks: AnyStockItem[]) => AnyStockItem[]) => void;
  onStockAdd?: (symbol: AnyStockItem) => void;
}

const Stocks: FC<StocksProps> = ({ className, href, userId, stocks, searchPlaceholder, loading, onStockInfoLoaded, onStocksUpdate, onStockAdd }: StocksProps) => {
  const currentSymbol = useSelectedLayoutSegment();

  const [filterTriggered, setFilterTriggered] = useState(false);
  const [filter, setFilter] = useState('');

  const { hasOperations, onAdd, ...operations } = useStockOperations(userId, onStocksUpdate ?? (() => undefined), onStockAdd ?? (() => undefined));

  const { data: all = [], isLoading } = useComposedEndpoint((go) => go ? [endpoints.index.compositions.GET, { index_symbol: 'SP500' }] : undefined, filterTriggered && hasOperations);

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
              onStockInfoLoad={onStockInfoLoaded}
            />
          ))}
          {loading && Array(loading).fill(null).map((_, i) => (
            <StockSkeleton key={i} />
          ))}
          {isLoading && Array(3).fill(null).map((_, i) => (
            <StockSkeleton key={'l' + i} />
          ))}
        </List>
      </Scrollable>
    </div>
  );
};

Stocks.displayName = 'Stocks';

export default Stocks;

function useStockOperations (userId: number | undefined, setStocks: (mutate: (stocks: AnyStockItem[]) => AnyStockItem[]) => void, onAdd: (stock: AnyStockItem) => void) {
  const remove = useCallback((stockSymbol: string) => {
    const stocks = stocksStore.get();
    if (stocks.includes(stockSymbol)) {
      stocks.splice(stocks.indexOf(stockSymbol), 1);
    }
    stocksStore.set(stocks);
    setStocks((stocks) => stocks.filter(stock => stock.stock_symbol !== stockSymbol));
  }, []);

  const add = useCallback((stock: AnyStockItem) => {
    const stocks = stocksStore.get();
    if (!stocks.includes(stock.stock_symbol)) {
      stocks.unshift(stock.stock_symbol);
    }
    stocksStore.set(stocks);
    setStocks((stocks) => [stock, ...stocks]);
    onAdd(stock)
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
