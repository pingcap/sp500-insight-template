import { FC, useMemo } from 'react';
import { Page } from './usePagination';
import './pagination.css';
import Link from 'next/link';
import clsx from 'clsx';

export interface PaginatorProps extends Omit<Page<any>, 'content'> {
  pathname: string;
}

const Paginator: FC<PaginatorProps> = ({ pathname, page: pageProp, totalPages, size }: PaginatorProps) => {
  const steps = useSteps(1, totalPages);

  return (
    <ol className="paginator">
      {steps.map((page) => (
        <li
          key={page}
          className={clsx({ active: page === pageProp })}
        >
          <Link
            href={{ pathname, query: { page: page, page_size: size } }}
          >
            {page}
          </Link>
        </li>
      ))}
    </ol>
  );
};

function useSteps (from: number, to: number, step: number = 1) {
  return useMemo(() => {
    if (step === 0) {
      throw new Error('step must not zero');
    }

    if (from < to && step < 0 || from > to && step > 0) {
      throw new Error('bad step');
    }

    const res: number[] = Array(Math.floor((to - from) / step));

    let i = 0;
    let c = from;
    const inc = from < to;
    while (inc ? c < to : c > to) {
      res[i++] = c;
      c += step;
    }
    return res;
  }, [from, to, step]);
}

Paginator.displayName = 'Paginator';

export default Paginator;