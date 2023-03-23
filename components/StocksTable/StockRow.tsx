import { AnyStockItem, fetchStockSummary, isResolved, StockItem } from '@/components/Stocks';
import { FC } from 'react';
import { useAuto } from '@/utils/hook';
import columns from '@/components/StocksTable/columns';
import clsx from 'clsx';

export interface StockCellProps {
  stock: AnyStockItem;
  stockIndex: number;
  stocks: AnyStockItem[];
  onInfoLoad?: (stock: StockItem) => void;
  stickyColumns: number;
  columnOffsetLeft: (number | undefined)[];
}

const StockRow: FC<StockCellProps> = ({ stock: propStock, stockIndex, stocks, onInfoLoad, stickyColumns, columnOffsetLeft }) => {
  const stock = useAuto(propStock, isResolved, fetchStockSummary, onInfoLoad);

  return (
    <tr>
      {columns.map((column, index) => (
        <td
          key={column.title}
          className={clsx(column.cellClassName?.(stock, stockIndex, stocks), { 'sticky z-0 bg-primary': index < stickyColumns })}
          style={{
            left: columnOffsetLeft[index],
          }}
        >
          {column.renderCell(stock, stockIndex, stocks)}
        </td>
      ))}
    </tr>
  );
};

export default StockRow;
