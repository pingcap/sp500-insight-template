import { defineEndpoint } from '@/datasource/data-api';

const HistoryPriceNowEndpoint = defineEndpoint<{}, { date: string }>('GET', '/index/history_price/now', true);

export default HistoryPriceNowEndpoint;
