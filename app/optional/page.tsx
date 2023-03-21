'use client';

import StocksTable from '@/components/StocksTable';
import { useCallback, useEffect, useState } from 'react';
import { AnyStockItem, StockItem } from '@/components/Stocks';
import stocksStore from '@/components/Stocks/stocks-store';

const Page = () => {
  const [stocks, setStocks] = useState<AnyStockItem[]>([]);

  useEffect(() => {
    setStocks(stocksStore.get().map(stock_symbol => ({ stock_symbol })));
  }, []);

  const handleInfoLoad = useCallback((stock: StockItem) => {
    setStocks(stocks => stocks.map(s => s.stock_symbol === stock.stock_symbol ? stock : s));
  }, []);

  return (
    <>
      <StocksTable stocks={stocks} onInfoLoad={handleInfoLoad} onChange={setStocks} />
    </>
  );
};

export default Page;
