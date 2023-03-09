import { DateTime } from 'luxon';
import { notFound } from 'next/navigation';

export interface QueryResult<T> {
  rows: T[];
  queryStart: DateTime;
  queryEnd: DateTime;
  queryCost: number;
}

export function unique<T> (result: QueryResult<T>): T {
  const { rows } = result;
  if (rows.length === 0) {
    notFound();
  } else if (rows.length > 1) {
    throw new Error('more than one result fetched.');
  }
  return rows[0];
}

export function list<T> (result: QueryResult<T>): T[] {
  return result.rows;
}