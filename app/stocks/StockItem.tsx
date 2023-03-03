import { FC } from 'react';
import { StockData } from './api';
import { ListItem } from '@/components/List';

export interface StockItemProps {
  data: StockData;
}

const StockItem: FC<StockItemProps> = ({ data }) => {
  return (
    <ListItem
      text={data.symbol}
      description={data.longname}
      href={`/stocks/${data.symbol}`}
    />
  );
};

StockItem.displayName = 'StockItem';

export default StockItem;
