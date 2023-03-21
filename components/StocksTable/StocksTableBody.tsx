import { AnyStockItem, StockItem } from '@/components/Stocks';
import { FC, ReactNode } from 'react';
import StockRow from '@/components/StocksTable/StockRow';
import columns from '@/components/StocksTable/columns';

export interface StocksTableBodyProps {
  stocks: AnyStockItem[];
  onInfoLoad?: (stock: StockItem) => void;
  lastLine?: ReactNode;
  stickyColumns: number;
  columnsOffsetLeft: (number | undefined)[];
}

const StocksTableBody: FC<StocksTableBodyProps> = ({ stocks, onInfoLoad, lastLine, columnsOffsetLeft, stickyColumns }) => {

  return (
    <tbody>
    {stocks.map((stock, stockIndex, stocks) => (
      <StockRow
        key={stock.stock_symbol}
        stock={stock}
        stockIndex={stockIndex}
        stocks={stocks}
        onInfoLoad={onInfoLoad}
        stickyColumns={stickyColumns}
        columnOffsetLeft={columnsOffsetLeft}
      />
    ))}
    {lastLine && <tr>
      <td colSpan={columns.length} className="sticky left-0">
        {lastLine}
      </td>
    </tr>}
    </tbody>
  );
};

export default StocksTableBody;
