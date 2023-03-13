import { defineEndpoint } from '@/datasource/data-api';

const CompositionsEndpoint = defineEndpoint<{
  index_symbol: string
}, {
  stock_symbol: string
  exchange_symbol: string
  short_name: string
  weight: number
  last_change_day: string
  last_close_price: number
  last_2nd_close_price: number
  last_change_percentage: number
}>('GET', '/index/compositions');

export default CompositionsEndpoint;
