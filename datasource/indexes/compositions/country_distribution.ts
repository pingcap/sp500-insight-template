import { defineEndpoint } from '@/datasource/data-api';

const CompositionCountryDistribution = defineEndpoint<{
  index_symbol: string
}, {
  country_code: string
  companies: number
}>('GET', '/index/compositions/country_distribution');

export default CompositionCountryDistribution;
