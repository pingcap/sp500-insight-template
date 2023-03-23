import { defineEndpoint } from '@/utils/data-api/endpoint';

namespace endpoints {
  export namespace index {
    export type IndexCommonParams = {
      index_symbol: string
    }

    export namespace compositions {
      type CompositionData = {
        stock_symbol: string
        exchange_symbol: string
        short_name: string
        weight: number
        last_change_day: string
        last_close_price: number
        last_2nd_close_price: number
        last_change_percentage: number
        market_cap: number
        revenue_growth?: number
      }

      export const GET = defineEndpoint<IndexCommonParams, CompositionData>('GET', '/index/compositions');

      export namespace by_sector {
        export const GET = defineEndpoint<IndexCommonParams & { sector: string }, CompositionData>('GET', '/index/compositions_by_sector');
      }

      export namespace country_distribution {
        export const GET = defineEndpoint<IndexCommonParams, {
          country_code: string
          companies: number
        }>('GET', '/index/compositions/country_distribution');
      }

      export namespace exchange_distribution {
        export const GET = defineEndpoint<{
          index_symbol: string
        }, {
          exchange_symbol: string
          companies: number
        }>('GET', '/index/compositions/exchange_distribution');
      }
    }

    export namespace history_price {
      type RangeParams = IndexCommonParams & {
        start_date: string
        end_date: string
      }

      export type IndexHistoryData = {
        record_date: string
        price: number
      }

      export namespace daily {
        export const GET = defineEndpoint<RangeParams, IndexHistoryData>('GET', `/index/history_price/daily`);
      }

      export namespace weekly {
        export const GET = defineEndpoint<RangeParams, IndexHistoryData>('GET', `/index/history_price/weekly`);
      }
    }

    export namespace sector_industry_distribution {
      export const GET = defineEndpoint<{
        index_symbol: string
      }, {
        industry: string
        sector: string
        stock_symbol: string
        short_name: string
        weight: number
        market_cap: number
        trend: 1 | -1 | 0
      }>
      ('GET', '/index/sector_industry_distribution');
    }

    export namespace latest_price {
      export const GET = defineEndpoint<IndexCommonParams, {
        last_updated_at: string
        last_1st_price: number
        last_2nd_price: number
        last_changes: number
      }>('GET', '/index/latest_price', true);
    }

    export namespace sector_ranking {
      import IndexCommonParams = endpoints.index.IndexCommonParams;
      export const GET = defineEndpoint<IndexCommonParams, {
        sector: string
        companies: number
        companies_ranking: number
        total_market_cap: number
        total_market_cap_ranking: number
        avg_revenue_growth: number
        avg_revenue_growth_ranking: number
      }>('GET', '/index/sector_ranking');
    }
  }

  export namespace stock {
    export type StockCommonParams = { stock_symbol: string }

    export namespace summary {
      export const GET = defineEndpoint<StockCommonParams, {
        stock_symbol: string
        last_change_day: string
        last_close_price: number
        last_2nd_close_price: number
        last_change: number
        last_change_percentage: number
        short_name: string
        exchange_symbol: string
        market_cap: number
        revenue_growth?: number
      }>('GET', '/stock/summary', true);
    }

    export namespace info {
      export const GET = defineEndpoint<StockCommonParams, {
        stock_symbol: string
        short_name: string
        long_name: string
        long_business_summary: string
        sector: string
        industry: string
        city: string
        state: string
        country: string
        full_time_employees: number
        market_cap: number
        revenue_growth: number
        ebitda: number
      }>('GET', '/stock/info', true);
    }

    export namespace history_price {
      type RangeParams = StockCommonParams & {
        start_date: string
        end_date: string
      }

      export type StockHistoryData = {
        record_date: string
        low: number
        high: number
        open: number
        close: number
        adj_close: number
      }

      export namespace daily {
        export const GET = defineEndpoint<RangeParams, StockHistoryData>('GET', `/stock/history_price/daily`);
      }

      export namespace weekly {
        export const GET = defineEndpoint<RangeParams, StockHistoryData>('GET', `/stock/history_price/weekly`);
      }
    }
  }
}

export default endpoints;
