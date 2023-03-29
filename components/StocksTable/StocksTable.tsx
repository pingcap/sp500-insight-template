import { FC, useMemo, useRef, useState } from 'react';
import StocksTableHead from '@/components/StocksTable/StocksTableHead';
import StocksTableBody from '@/components/StocksTable/StocksTableBody';
import { AnyStockItem, StockItem } from '@/components/Stocks';
import AddStockItemDialog from '@/components/StocksTable/AddStockItemDialog';
import './style.css';
import Scrollable from '@/components/Scrollable';
import columns from '@/components/StocksTable/columns';
import { useSize } from '@radix-ui/react-use-size';
import { useRefCallback } from '@/utils/hook';
import clsx from 'clsx';

export interface StocksTableProps {
  className?: string;
  stocks: AnyStockItem[];
  onInfoLoad?: (stock: StockItem) => void;
  onChange?: (mutate: (stocks: AnyStockItem[]) => AnyStockItem[]) => void;
  onAdd?: (stock: AnyStockItem) => void;
  stickyColumns?: number;
}

const StocksTable: FC<StocksTableProps> = ({ className, stocks, stickyColumns = 2, onInfoLoad, onChange , onAdd }) => {
  const { colRefs, widths } = useColumnWidths();
  const [orderedField, setOrderedField] = useState<string>();
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');

  const columnsOffsetLeft = useMemo(() => {
    return columns.map((_, i) => computeOffsetLeft(i, widths, stickyColumns));
  }, [widths, stickyColumns]);

  const handleReorder = useRefCallback((field: string) => {
    if (orderedField === field) {
      switch (order) {
        case 'ASC':
          setOrder('DESC');
          break;
        case 'DESC':
          setOrderedField(undefined);
          setOrder('ASC');
          break;
      }
    } else {
      setOrderedField(field);
      setOrder('ASC');
    }
  });

  const orderedStocks = useMemo(() => {
    if (!orderedField) {
      return stocks;
    }
    const newStocks = [...stocks];

    const sorter: (a: AnyStockItem, b: AnyStockItem) => number = order === 'ASC'
      ? (a, b) => {
        return (a as any)[orderedField] - (b as any)[orderedField];
      }
      : (a, b) => {
        return (b as any)[orderedField] - (a as any)[orderedField];

      };

    newStocks.sort(sorter);
    return newStocks;
  }, [stocks, orderedField, order]);

  return (
    <Scrollable className={clsx('stocks-table-container', className)} direction="xy">
      <table className="stocks-table">
        <colgroup>
          {columns.map((c, i) => <col key={c.title} ref={colRefs[i]} />)}
        </colgroup>
        <StocksTableHead
          columnsOffsetLeft={columnsOffsetLeft}
          stickyColumns={stickyColumns}
          orderedField={orderedField}
          order={order}
          onReorder={handleReorder}
        />
        <StocksTableBody
          stocks={orderedStocks}
          onInfoLoad={onInfoLoad}
          columnsOffsetLeft={columnsOffsetLeft}
          stickyColumns={stickyColumns}
          lastLine={
            (onChange || onAdd) && (<AddStockItemDialog
              stocks={stocks}
              onInfoLoad={onInfoLoad}
              onChange={onChange}
              onAdd={onAdd}
            />)
          }
        />
      </table>
    </Scrollable>
  );
};

StocksTable.displayName = 'StocksTable';

function useColumnWidths () {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const refs = columns.map(() => useRef<HTMLTableColElement>(null));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sizes = columns.map((_, i) => useSize(refs[i].current));

  const widths = useMemo(
    () => {
      return sizes.map(size => size?.width ?? 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sizes.map(size => size?.width)],
  );

  return {
    colRefs: refs,
    widths,
  };
}

function computeOffsetLeft (index: number, columnSizes: number[], stickyColumns: number) {
  if (index >= stickyColumns) {
    return undefined;
  }
  return columnSizes.slice(0, index).reduce((a, b) => a + b, 0) ?? 0;
}

export default StocksTable;
