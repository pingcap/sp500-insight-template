import { FC } from 'react';
import columns, { Column } from './columns';
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

export interface StocksTableHeadProps {
  columnsOffsetLeft: (number | undefined)[];
  stickyColumns: number;
  orderedField?: string;
  order: 'ASC' | 'DESC';
  onReorder?: (field: string) => void;
}

const StocksTableHead: FC<StocksTableHeadProps> = ({ columnsOffsetLeft, stickyColumns, orderedField, order, onReorder }) => {
  const handleClickReorderButton = (column: Column) => {
    if (!column.field) {
      return;
    }
    onReorder?.(column.field);
  };
  return (
    <thead>
    <tr>
      {columns.map((column, index) => (
        <th
          key={column.field ?? column.title}
          className={index < stickyColumns ? 'sticky z-20 bg-primary' : 'sticky z-10 bg-primary'}
          style={{
            left: columnsOffsetLeft[index],
            top: 0,
          }}
        >
          <ReorderButton
            show={!!column.ordered}
            order={orderedField === column.field ? order : 'NONE'}
            onClick={() => handleClickReorderButton(column)}
          />
          {column.title}
        </th>
      ))}
    </tr>
    </thead>
  );
};

export default StocksTableHead;

function ReorderButton ({ show, order, onClick }: { show: boolean, order: 'NONE' | 'ASC' | 'DESC', onClick?: () => void }) {
  if (!show) {
    return null;
  }
  const iconClassNames = 'w-4 inline-block mr-2 cursor-pointer';
  switch (order) {
    case 'ASC':
      return <ChevronUpIcon className={clsx(iconClassNames, 'text-primary')} onClick={onClick} />;
    case 'DESC':
      return <ChevronDownIcon className={clsx(iconClassNames, 'text-primary')} onClick={onClick} />;
    case 'NONE':
      return <ChevronUpDownIcon className={clsx(iconClassNames, 'text-secondary hover:text-primary')} onClick={onClick} />;
  }
}
