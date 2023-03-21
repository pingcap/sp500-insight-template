import { DependencyList, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';

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
  const triedRef = useRef(false);
  const id = useId();

  const { data } = useSWR(!triedRef.current && !isResolved(storeValue) && `useAuto-${id}`, () => fetch(storeValue));

  useEffect(() => {
    if (data) {
      setStoreValue(data);
    }
  }, [data]);

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
