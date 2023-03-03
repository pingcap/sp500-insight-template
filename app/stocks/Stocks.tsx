import { FC, HTMLAttributes } from 'react';
import StockItem from './StockItem';
import { StockData } from './api';
import List from '@/components/List';

export interface StockListProps extends HTMLAttributes<HTMLUListElement> {
  data: StockData[];
}

const Stocks: FC<StockListProps> = ({ className, data, ...props }) => {
  return (
    <List {...props} >
      {data.map(stock => (
        <StockItem key={stock.symbol} data={stock} />
      ))}
    </List>
  );
};

Stocks.displayName = 'Stocks';

export default Stocks;
