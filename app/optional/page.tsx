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
      <h2>Selected stocks</h2>
      <p className='my-4'>
        On this page, you can add the stocks you want to follow by clicking the '+' button. Clicking on the name of a stock will take you to its detailed page, where you can see its performance over time.
      </p>
      <StocksTable stocks={stocks} onInfoLoad={handleInfoLoad} onChange={setStocks} />
    </>
  );
};

export default Page;
