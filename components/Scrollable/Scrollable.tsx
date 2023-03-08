import { FC } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { ScrollAreaProps } from '@radix-ui/react-scroll-area';
import clsx from 'clsx';

export interface ScrollableProps extends ScrollAreaProps {
}

const Scrollable: FC<ScrollableProps> = ({ children, className, ...props }) => {
  return (
    <ScrollArea.Root className={clsx('overflow-hidden', className)} {...props}>
      <ScrollArea.Viewport className="w-full h-full">
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-white bg-opacity-5 rounded-[12px] transition-colors duration-[160ms] ease-out hover:bg-opacity-10 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-white bg-opacity-30 hover:bg-opacity-40 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="bg-white" />
    </ScrollArea.Root>
  );
};

export default Scrollable;
