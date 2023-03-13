import { defineEndpoint } from '@/datasource/data-api';

const HistoryPriceWeeklyEndpoint = defineEndpoint<
  {
    start_date: string
    end_date: string
    index_symbol: string
  },
  {
    record_date: string
    price: number
  }
>('GET', `/index/history_price/weekly`);

export default HistoryPriceWeeklyEndpoint;
