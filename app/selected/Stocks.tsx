'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { AnyStockItem, StockItem } from '@/components/Stocks';
import stocksStore from '@/components/Stocks/stocks-store';
import StocksTable from '@/components/StocksTable';
import useSWR from 'swr';

const Stocks: FC<{ disableEdit: boolean }> = ({ disableEdit }) => {
  const { data, mutate } = useSWR('/data-tracker/list', (url) => fetch(url).then(r => r.json()))
  const [stocks, setStocks] = useState<AnyStockItem[]>([]);

  useEffect(() => {
    setStocks(data?.map((item: any) => ({ stock_symbol: item.symbol})) ?? [])
  }, [data])

  const handleAdd = useCallback(async (stock: AnyStockItem) => {
     await fetch(`/data-tracker/${stock.stock_symbol}`, { method: 'POST' });
     await mutate(undefined);
  }, [])

  const handleInfoLoad = useCallback((stock: StockItem) => {
    setStocks(stocks => stocks.map(s => s.stock_symbol === stock.stock_symbol ? stock : s));
  }, []);

  return (
    <StocksTable
      stocks={stocks}
      onInfoLoad={handleInfoLoad}
      onChange={disableEdit ? undefined : setStocks}
      onAdd={disableEdit ? undefined : handleAdd}
    />
  );

};

export default Stocks;
