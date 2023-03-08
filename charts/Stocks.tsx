import { FC } from 'react';
import List from '@/components/List';
import Stock, { StockItem, UnresolvedStockItem } from './Stock';

export interface StocksProps {
  stocks: (StockItem | UnresolvedStockItem)[];
  href?: string
}

const Stocks: FC<StocksProps> = ({ stocks, href }: StocksProps) => {
  return (
    <List>
      {stocks.map((stock) => <Stock stock={stock} href={href} key={stock.stock_symbol} />)}
    </List>
  );
};

Stocks.displayName = 'Stocks';
export default Stocks;
