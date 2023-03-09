'use client';
import { forwardRef, ReactElement } from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { StockItem, UnresolvedStockItem } from './Stock';
import '@/components/styles/context-menu.css';

export interface StockContextMenuProps {
  stock: StockItem | UnresolvedStockItem;
  onRemove?: (stockSymbol: string) => void;
}

const StockContextMenu = forwardRef<HTMLDivElement, StockContextMenuProps>((props, forwardedRef) => {
  const elements = buildContent(props);

  return (
    <ContextMenu.Content className="context-menu-content border-1 border-gray-400 rounded select-none bg-black" ref={forwardedRef}>
      {elements}
    </ContextMenu.Content>
  );
});

StockContextMenu.displayName = 'StockContextMenu';

export default StockContextMenu;

const buildContent = ({ onRemove, stock }: StockContextMenuProps): ReactElement[] => {
  const elements: ReactElement[] = [];
  if (onRemove) {
    elements.push(
      <ContextMenu.Item key="delete" className="px-4 py-2 transition-colors cursor-pointer bg-white bg-opacity-0 hover:bg-opacity-5">
        <div onClick={() => onRemove(stock.stock_symbol)}>Remove</div>
      </ContextMenu.Item>,
    );
  }
  return elements;
};
