import { defineEndpoint } from '@/datasource/data-api';

const CompositionExchangeDistribution = defineEndpoint<{
  index_symbol: string
}, {
  exchange_symbol: string
  companies: number
}>('GET', '/index/compositions/exchange_distribution');

export default CompositionExchangeDistribution;
