import { FC, HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface InlineProps extends HTMLAttributes<HTMLSpanElement> {
  fullwidth?: boolean;
  estimateCharacters?: number;
}

const Inline: FC<InlineProps> = ({ className, fullwidth = false, children, style, estimateCharacters, ...props }) => {
  if (children) {
    return <>{children}</>;
  }
  return (
    <span
      className={clsx('skeleton-primitive skeleton-inline', { 'skeleton-fullwidth': fullwidth }, className)}
      style={
        estimateCharacters ? {
          ...style,
          minWidth: `${estimateCharacters}em`,
        } : style
      }
      {...props}
    />
  );
};

export default Inline;