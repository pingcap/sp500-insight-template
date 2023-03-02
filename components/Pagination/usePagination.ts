import { cache, use } from 'react';

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export function usePagination<T, P> (loadSource: (params: P, page: number, pageSize: number) => Promise<Page<T>>, params: P, page: number = 1, pageSize = 10) {
  return use(cache(loadSource)(params, page, pageSize));
}