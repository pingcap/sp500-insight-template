'use client';
import { EChartsType, init } from 'echarts';
import { forwardRef, HTMLAttributes, useEffect, useRef } from 'react';
import './echarts.css';
import clsx from 'clsx';

export interface EChartsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'contentEditable'> {
  theme?: string;
}

const ECharts = forwardRef<EChartsType | undefined, EChartsProps>((({ theme, className, ...props }, forwardedRef) => {
  const celRef = useRef<HTMLDivElement>(null);
  const elRef = useRef<HTMLDivElement>(null);
  const ecRef = useRef<EChartsType>();

  useEffect(() => {
    const el = elRef.current;
    const cel = celRef.current;
    if (!el || !cel) {
      return;
    }

    const { width, height } = getComputedStyle(cel);
    const ec = ecRef.current = init(el, theme, {
      renderer: 'svg',
      width: parseInt(width),
      height: parseInt(height),
    });

    const mo = new ResizeObserver(([entry]) => {
      ec.resize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    mo.observe(cel);

    if (typeof forwardedRef === 'function') {
      forwardedRef(ec);
    } else if (forwardedRef) {
      forwardedRef.current = ec;
    }

    return () => {
      mo.disconnect();
      ec.dispose();
    };
  }, []);

  return (
    <div className={clsx('echarts-container', className)} ref={celRef} {...props}>
      <div ref={elRef} />
    </div>
  );
}));

ECharts.displayName = 'ECharts';

export default ECharts;
