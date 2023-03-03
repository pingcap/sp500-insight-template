import { Page as PageData } from '@/components/Pagination';
import DATA from '@/app/stocks/mock-companies.json';

export type StockData = {
  symbol: string
  industry: string
  shortname: string
  sector: string
  longname: string
  weight: number
  longbusinesssummary: string
  exchange: string
}

export async function getStocks (params: void, page: number, size: number): Promise<PageData<StockData>> {
  return {
    content: DATA.slice((page - 1) * size, page * size).map(transform),
    page,
    size,
    total: DATA.length,
    totalPages: Math.ceil(DATA.length / size),
  };
}

export async function getStock (sym: string): Promise<StockData | null> {
  const d = DATA.find(c => c.Symbol === sym);
  if (d) {
    return transform(d);
  }
  return null;
}

function transform (data: typeof DATA[number]): StockData {
  const result: StockData = {} as never;
  Object.entries(data).forEach(([k, v]) => {
    result[k.toLowerCase() as never] = v as never;
  });
  return result;
}
