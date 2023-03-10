import { cache } from 'react';
import { StockItem } from '@/components/Stocks';
import { getUserSelectedStocks } from '@/app/api/user/selected_stocks/route';

export const fetchUserSelectedStocks = cache(async (userId: number): Promise<StockItem[]> => {
  const { rows } = await getUserSelectedStocks(userId);
  return rows.map(({ last_2nd_close_price, last_change_percentage, last_close_price, last_change_day, ...rest }: any) => ({
    ...rest,
    last_2nd_close_price: parseFloat(last_2nd_close_price),
    last_change_percentage: parseFloat(last_change_percentage),
    last_close_price: parseFloat(last_close_price),
    last_change_day: String(last_change_day),
  }));
});
