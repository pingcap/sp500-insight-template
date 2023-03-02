import { FC, HTMLAttributes } from 'react';
import clsx from 'clsx';
import StockItem, { StockData } from './StockItem';
import './stocks.css';

export interface StockListProps extends HTMLAttributes<HTMLUListElement> {
  data: StockData[];
}

const Stocks: FC<StockListProps> = ({ className, data, ...props }) => {
  return (
    <ul className={clsx('stocks', className)} {...props} >
      {data.map(stock => (
        <StockItem key={stock.symbol} data={stock} />
      ))}
    </ul>
  );
};

Stocks.displayName = 'Stocks';

export default Stocks;
