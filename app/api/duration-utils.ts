import { NextRequest } from 'next/server';
import URL from 'node:url';

type N = number | 'CURRENT';
export type Unit = 'DAY' | 'MONTH' | 'YEAR'

export function getDurationParams (req: NextRequest) {
  const url = new URL.URL(req.url)
  const duration = url.searchParams.get('duration') ?? '6M'
  let n: N;
  let unit: Unit;
  const matched = duration.match(/^(\d)([YM])$/)
  if (!matched) {
    unit = 'YEAR';
    if (duration === 'YTD') {
      n = 'CURRENT';
    } else if (duration === 'MAX') {
      n = 150;
    } else {
      n = 1;
    }
  } else {
    const [, nValue, unitValue] = matched
    n = parseInt(nValue);
    unit = unitValue === 'Y' ? 'YEAR' : 'MONTH';
  }

  return { n, unit }
}