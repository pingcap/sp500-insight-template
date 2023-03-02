import { FC } from 'react';
import './stock-item.css';
import Link from 'next/link';

export type StockData = {
  symbol: string
  industry: string
  shortname: string
  sector: string
  longname: string
  weight: number
  longbusinesssummary: string
  exchange: string
}

export interface StockItemProps {
  data: StockData;
}

const StockItem: FC<StockItemProps> = ({ data }) => {
  return (
    <li className="stock-item">
      <Link href={`/stocks/${data.symbol}`}>
        <span className="left">
          <span className="symbol">
          {data.symbol}
        </span>
        <span className="name">
          {data.longname}
        </span>
        </span>
      </Link>
    </li>
  );
};

StockItem.displayName = 'StockItem';

export default StockItem;
