import { unstable_serialize } from 'swr';
import { cache } from 'react';

export function unstable_cache<P, F extends (...args: any) => Promise<P>> (fn: F, ssrNativeCache = false): F {
  if (typeof window === 'undefined') {
    return ssrNativeCache ? cache(fn) : fn;
  } else {
    const cache = new Map<string, Promise<any>>();

    return ((...args: any[]) => {
      const key = unstable_serialize(args);
      const cached = cache.get(key);
      if (cached) {
        return cached;
      } else {
        const newCache = fn(...args);
        cache.set(key, newCache);
        return newCache;
      }
    }) as any;
  }
}

type CacheFn<P, F extends (...args: any) => Promise<P>> = (fn: F) => F;
