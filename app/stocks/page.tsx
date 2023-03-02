import Stocks from './Stocks';
import { Page as PageData, usePagination } from '@/components/Pagination';
import DATA from '@/app/stocks/mock-companies.json';
import { StockData } from '@/app/stocks/StockItem';
import Paginator from '@/components/Pagination/Paginator';

type PageProps = {
  searchParams?: {
    page?: string
    page_size?: string
  }
}

const Page = ({ searchParams: { page = '1', page_size: pageSize = '10' } = {} }: PageProps) => {
  const data = usePagination(getData, undefined, parsePage(page), parsePageSize(pageSize));

  const { content, ...pagination } = data ?? {};

  return (
    <>
      <Stocks data={content} />
      <Paginator pathname="/stocks" {...pagination} />
    </>
  );
};

function parsePage (value: string): number {
  const page = parseInt(value);
  if (isFinite(page)) {
    return Math.max(1, page);
  } else {
    return 1;
  }
}

function parsePageSize (value: string): number {
  const page = parseInt(value);
  if (isFinite(page)) {
    return Math.min(Math.max(1, page), 100);
  } else {
    return 10;
  }
}

async function getData (params: void, page: number, size: number): Promise<PageData<StockData>> {
  return {
    content: transform(DATA.slice((page - 1) * size, page * size)),
    page,
    size,
    total: DATA.length,
    totalPages: Math.ceil(DATA.length / size),
  };
}

export async function getCompany (sym: string): Promise<StockData | null> {
  const d = DATA.find(c => c.Symbol === sym);
  if (d) {
    return transform([d])[0];
  }
  return null;
}

export function transform (data: typeof DATA): StockData[] {
  return data.map(item => {
    const result: StockData = {} as never;
    Object.entries(item).forEach(([k, v]) => {
      result[k.toLowerCase() as never] = v as never;
    });
    return result;
  });
}

export default Page;
