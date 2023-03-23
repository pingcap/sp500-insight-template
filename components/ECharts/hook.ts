import { DependencyList, useDebugValue, useEffect, useRef } from 'react';
import { EChartsOption, EChartsType, SetOptionOpts } from 'echarts';

export function useECharts () {
  const ref = useRef<EChartsType>();

  return {
    ref,
    useOption<T> (getOption: () => EChartsOption, opts?: SetOptionOpts | DependencyList, deps?: DependencyList) {
      useDebugValue(undefined, getOption)
      useEffect(
        () => {
          if (opts && !(opts instanceof Array)) {
            ref.current?.setOption(getOption(), opts);
          } else {
            ref.current?.setOption(getOption());
          }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        opts ? opts instanceof Array ? opts : (deps ?? []) : [],
      );
    },
  };
}
