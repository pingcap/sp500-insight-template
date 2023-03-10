'use client';
import { FC, useMemo, useState } from 'react';
import useSWR from 'swr';
import Stocks from '@/components/Stocks';

const IndexCompositions: FC<{ index: string }> = ({ index }) => {
  const { data = [], isLoading } = useSWR([index, 'compositions'], compositions);

  return (
    <>
      <Stocks className='h-[400px]' stocks={data} href='/optional/<symbol>' loading={isLoading && 5} />
    </>
  );
};

export default IndexCompositions;

type IndexCompositionRecord = {
  exchange_symbol: string
  last_2nd_close_price: number
  last_change_day: string
  last_change_percentage: number
  last_close_price: number
  short_name: string
  stock_symbol: string
  weight: number
}

export const compositions = async ([index]: [string]): Promise<IndexCompositionRecord[]> => {
  const res = await fetch(`/api/indexes/${index}/compositions`);
  const { rows } = await res.json();
  return rows.map(({ last_2nd_close_price, last_change_percentage, last_close_price, ...rest }: any) => ({
    ...rest,
    last_2nd_close_price: parseFloat(last_2nd_close_price),
    last_change_percentage: parseFloat(last_change_percentage),
    last_close_price: parseFloat(last_close_price),
  }));
};
