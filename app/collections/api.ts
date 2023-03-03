import { getStock, StockData } from '@/app/stocks/api';
import DATA from './mock.json';

export type CollectionData = {
  id: string
  name: string
  member: { symbol: string, weight: number }[]
}

export async function getCollections (): Promise<CollectionData[]> {
  return DATA;
}

export async function getCollection (id: string): Promise<CollectionData | null> {
  const collections = await getCollections();
  return collections.find(c => c.id === id) ?? null;
}

export async function getCollectionMember (id: string): Promise<StockData[] | null> {
  const collection = await getCollection(id);
  if (!collection) {
    return null;
  }
  const result = await Promise.all(collection.member.map(async ({ symbol, weight }) => {
    const stock = await getStock(symbol);
    if (stock == null) {
      return null;
    }
    return {
      ...stock,
      weight,
    };
  }));
  return result.filter(notNull);
}

function notNull<T> (v: T): v is Exclude<T, null> {
  return v !== null;
}
