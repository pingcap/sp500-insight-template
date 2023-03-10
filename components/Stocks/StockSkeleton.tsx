import { FC } from 'react';
import { SkeletonInline } from '@/components/Skeleton';
import { ListItem } from '@/components/List';

const StockSkeleton: FC = () => {
  return (
    <ListItem
      className=""
      text={(
        <>
          <SkeletonInline estimateCharacters={4} />
          <span className="text-secondary ml-2 text-sm">
            <SkeletonInline estimateCharacters={3} />
          </span>
        </>
      )}
      description={(
        <SkeletonInline estimateCharacters={8} />
      )}
      detail={(
        <span className="flex flex-col text-right">
          <span className="text-significant text-2xl">
            <SkeletonInline estimateCharacters={3} />
          </span>
          <span>
            {<PendingPercentTag />}
          </span>
        </span>
      )}
    />
  );
};

export const PendingPercentTag = () => {
  return (
    <span className="inline-flex items-center justify-end text-significant rounded px-1 min-w-[80px] bg-[#888]">
      --
    </span>
  );
};

export default StockSkeleton;