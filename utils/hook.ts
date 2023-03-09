import { useCallback, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useRefCallback<T extends (...args: any) => any> (cb: T) {
  const ref = useRef(cb);

  ref.current = cb;

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return ref.current(...args);
  }, []) as T;
}

export function useSearchParam (name: string, push = false, option?: { forceOptimisticNavigation?: boolean }) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const router = useRouter();

  const searchParam = sp.get(name);
  const setSearchParam = useRefCallback((value: string) => {
    const usp = new URLSearchParams(sp);
    usp.set(name, value);
    const url = `${pathname}?${usp.toString()}`;
    if (push) {
      router.push(url, option);
    } else {
      router.replace(url, option);
    }
  });

  return [searchParam, setSearchParam] as const;
}
