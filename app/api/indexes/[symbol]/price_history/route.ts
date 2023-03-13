import { DateTime } from 'luxon';
import { NextRequest, NextResponse } from 'next/server';
import { getDurationParams, Unit } from '@/app/api/duration-utils';
import { executeEndpoint } from '@/datasource/data-api';
import HistoryPriceDailyEndpoint from '@/datasource/indexes/history_price/daily';
import HistoryPriceWeeklyEndpoint from '@/datasource/indexes/history_price/weekly';
import HistoryPriceNowEndpoint from '@/datasource/indexes/history_price/now';

const getPriceHistory = async (symbol: string, n: number | 'CURRENT', unit: Unit) => {
  const { row: { date: date_now } } = await executeEndpoint(HistoryPriceNowEndpoint, {});
  const fmt = 'yyyy-MM-dd';

  const now = DateTime.fromFormat(date_now, fmt);

  let start: DateTime;
  let end = now;
  let endpoint: typeof HistoryPriceDailyEndpoint;

  if (n === 'CURRENT') {
    endpoint = HistoryPriceDailyEndpoint;
    start = now.startOf('year');
  } else if (unit === 'YEAR' && n > 1) {
    endpoint = HistoryPriceWeeklyEndpoint;
    start = now.minus({ year: n });
  } else {
    endpoint = HistoryPriceDailyEndpoint;
    switch (unit) {
      case 'YEAR':
        start = now.minus({ year: n });
        break;
      case 'MONTH':
        start = now.minus({ month: n });
        break;
      case 'DAY':
        start = now.minus({ day: n });
        break;
      default:
        throw new Error('Unknown unit');
    }
  }

  return await executeEndpoint(endpoint, {
    start_date: start.toFormat(fmt),
    end_date: end.toFormat(fmt),
    index_symbol: symbol,
  });
};

export async function GET (req: NextRequest, { params }: any) {
  const { n, unit } = getDurationParams(req);
  const { symbol } = params;
  const result = await getPriceHistory(symbol as string, n, unit);
  return NextResponse.json(result);
}
