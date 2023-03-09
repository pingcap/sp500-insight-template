'use client';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import List, { ListSearch } from '@/components/List';
import Stock, { StockItem, UnresolvedStockItem } from './Stock';
import StockContextMenu from '@/charts/StockMenu';
import clsx from 'clsx';
import StockOverlay from '@/charts/StockOverlay';
import useSWR from 'swr';
import { compositions } from '@/charts/IndexCompositions';
import Scrollable from '@/components/Scrollable';

type AnyStockItem = StockItem | UnresolvedStockItem;

export interface StocksProps {
  stocks: AnyStockItem[];
  href?: string;
  userId?: number;
  addable?: boolean;
}

const Stocks: FC<StocksProps> = ({ stocks: propStocks, href, userId, addable }: StocksProps) => {
  const [filter, setFilter] = useState('');
  const [stocks, setStocks] = useState(propStocks);
  const { hasOperations, onAdd, ...operations } = useStockOperations(userId, setStocks);

  const { data: all = [] } = useSWR(hasOperations ? ['SP500', 'compositions'] : undefined, compositions);
  const filtered = useMemo(() => {
    if (filter) {
      return (hasOperations ? all : stocks).filter(item =>
        item.stock_symbol.toLowerCase().indexOf(filter) !== -1
        || item.short_name?.toLowerCase().indexOf(filter) !== -1,
      );
    } else {
      return stocks;
    }
  }, [filter, all, stocks, hasOperations]);

  useEffect(() => {
    if (propStocks !== stocks) {
      setStocks(propStocks);
    }
  }, [propStocks]);

  const hasStock = useCallback((symbol: string) => {
    return !!stocks.find(s => s.stock_symbol === symbol);
  }, [stocks]);

  return (
    <>
      <ListSearch value={filter} onChange={setFilter} />
      <Scrollable className="mt-4 h-[600px]">
        <List>
          {filtered.map((stock) => (
            <Stock
              key={stock.stock_symbol}
              className={clsx({ 'opacity-30': addable && userId })}
              stock={stock}
              href={href}
              menu={hasOperations ? <StockContextMenu stock={stock} {...operations} /> : undefined}
              overlay={hasOperations && !hasStock(stock.stock_symbol) ? <StockOverlay stock={stock} onAdd={onAdd} /> : undefined}
            />
          ))}
        </List>
      </Scrollable>
    </>
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
    setStocks((stocks) => stocks.concat(stock));
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
