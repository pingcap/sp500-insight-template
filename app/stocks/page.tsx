import Stocks from './Stocks';
import { usePagination } from '@/components/Pagination';
import Paginator from '@/components/Pagination/Paginator';
import { getStocks } from './api';

type PageProps = {
  searchParams?: {
    page?: string
    page_size?: string
  }
}

const Page = ({ searchParams: { page = '1', page_size: pageSize = '10' } = {} }: PageProps) => {
  const data = usePagination(getStocks, undefined, parsePage(page), parsePageSize(pageSize));

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

export default Page;
