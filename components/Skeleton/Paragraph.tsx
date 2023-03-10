import { FC, ReactNode } from 'react';
import Inline from './Inline';

export interface ParagraphProps {
  lines?: number;
  children?: ReactNode;
}

const Paragraph: FC<ParagraphProps> = ({ lines = 4, children }) => {
  if (children) {
    return <>{children}</>;
  }
  return (
    <>
      {Array(lines).fill(null).map((_, i) => (
        <Inline key={i} fullwidth={i < lines - 1} />
      ))}
    </>
  );
};

export default Paragraph;
