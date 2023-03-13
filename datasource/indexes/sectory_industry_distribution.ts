import { defineEndpoint } from '@/datasource/data-api';

const SectorIndustryDistributionEndpoint = defineEndpoint<{
  index_symbol: string
}, {
  industry: string
  sector: string
  stock_symbol: string
  weight: number
  trend: 1 | -1 | 0
}>
('GET', '/index/sector_industry_distribution');

export default SectorIndustryDistributionEndpoint;
