import { DependencyList, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

export function useMounted () {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
}

export function useAuto<Unresolved, Resolved extends Unresolved> (value: Resolved | Unresolved, isResolved: (value: Resolved | Unresolved) => value is Resolved, fetch: (prev: Unresolved) => Promise<Resolved>, onLoad?: (resolved: Resolved) => void) {
  const [storeValue, setStoreValue] = useState(value);
  const [tried, setTried] = useState(false);
  const mounted = useMounted();

  useEffect(() => {
    if (!isResolved(storeValue)) {
      if (!tried) {
        setTried(true);
        void fetch(storeValue)
          .then(value => {
            if (mounted.current) {
              setStoreValue(value);
              onLoad?.(value)
            }
          });
      }
    }
  }, [tried, storeValue]);

  return storeValue;
}

export function useTransform<T, R> (t: T, transformer: (raw: T) => R, dependencyList?: DependencyList) {
  return useMemo(
    () => {
      return transformer(t);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencyList ?? [t],
  );
}
