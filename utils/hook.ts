import { useCallback, useRef } from 'react';

export function useRefCallback<T extends (...args: any) => any> (cb: T) {
  const ref = useRef(cb);

  ref.current = cb;

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return ref.current(...args);
  }, []) as T;
}