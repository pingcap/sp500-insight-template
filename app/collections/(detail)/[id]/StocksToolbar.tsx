'use client';
import * as Toolbar from '@radix-ui/react-toolbar';
import { FC } from 'react';
import '@/components/styles/toolbar.css';
import '@/components/styles/dialog.css';
import { PlusIcon } from '@heroicons/react/20/solid';

const StocksToolbar: FC = () => {
  return (
    <Toolbar.Root className="toolbar">
      <Toolbar.Button className="toolbar-button" style={{ marginLeft: 'auto' }}>
        <PlusIcon />
        NEW MEMBER STOCK
      </Toolbar.Button>
    </Toolbar.Root>
  );
};

StocksToolbar.displayName = 'StocksToolbar';

export default StocksToolbar;
