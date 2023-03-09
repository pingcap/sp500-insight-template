import { StockItem, UnresolvedStockItem } from '@/charts/Stock';
import { PlusIcon } from '@heroicons/react/20/solid';

interface StockOverlayProps {
  stock: StockItem | UnresolvedStockItem;
  onAdd?: (stock: StockItem | UnresolvedStockItem) => void;
}

const StockOverlay = ({ stock, onAdd }: StockOverlayProps) => {
  return (
    <div
      className="overlay absolute z-10 rounded bg-primary bg-opacity-60 left-0 top-0 flex items-center justify-center w-full h-full cursor-pointer text-primary hover:text-significant hover:bg-opacity-30 transition-colors"
      onClick={() => onAdd?.(stock)}
    >
      <PlusIcon className="w-6 h-6" />
    </div>
  );
};

export default StockOverlay;