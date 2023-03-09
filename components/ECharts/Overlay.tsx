import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface OverlayProps {
  show: boolean;
  children: ReactNode;
}

const Overlay: FC<OverlayProps> = ({ show, children }) => {
  return (
    <div
      className={clsx(
        'absolute z-10 w-full h-full pointer-events-none flex items-center justify-center bg-black opacity-0 transition-opacity',
        { 'opacity-40 pointer-events-auto': show },
      )}
      aria-hidden={show}
    >
      {children}
    </div>
  );
};
export default Overlay;