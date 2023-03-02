import clsx from 'clsx';
import { forwardRef, HTMLAttributes } from 'react';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ className, ...props }, forwardRef) => {
  return (
    <div ref={forwardRef} className={clsx('container m-auto px-2', className)} {...props} />
  );
});

Container.displayName = 'Container';

export default Container;
