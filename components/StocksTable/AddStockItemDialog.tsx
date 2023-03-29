'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { FC, useState } from 'react';
import Stocks, { AnyStockItem, StockItem } from '@/components/Stocks';
import '@/components/styles/dialog.css';

interface AddStockItemDialogProps {
  stocks: AnyStockItem[];
  onInfoLoad?: (stock: StockItem) => void;
  onChange?: (mutate: (stocks: AnyStockItem[]) => AnyStockItem[]) => void;
  onAdd?: (stock: AnyStockItem) => void;
}

const AddStockItemDialog: FC<AddStockItemDialogProps> = ({ stocks, onInfoLoad, onChange, onAdd }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className='opacity-50 transition-opacity hover:opacity-80'>
        + ADD OTHERS
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content w-[420px]">
          <Dialog.Title className="dialog-title">
            New Collection
          </Dialog.Title>
          <Stocks className="h-[70vh]" stocks={stocks} onStockInfoLoaded={onInfoLoad} onStocksUpdate={onChange} onStockAdd={onAdd} userId={1} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddStockItemDialog;
