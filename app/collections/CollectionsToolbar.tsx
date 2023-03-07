'use client';
import { FC, useState } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import * as Dialog from '@radix-ui/react-dialog';
import { PlusIcon } from '@heroicons/react/20/solid';
import '@/components/styles/toolbar.css';
import '@/components/styles/dialog.css';
import Form, { FormControl } from '@/components/Form';
import TextField from '@/components/Form/TextField';
import { useRefCallback } from '@/utils/hook';

const CollectionsToolbar: FC = () => {
  return (
    <>
      <Toolbar.Root className="toolbar">
        <AddCollectionItem className="toolbar-button" style={{ marginLeft: 'auto' }}>
          <PlusIcon />
          NEW COLLECTION
        </AddCollectionItem>
      </Toolbar.Root>
    </>
  );
};

CollectionsToolbar.displayName = 'CollectionsToolbar';

export default CollectionsToolbar;

const AddCollectionItem: FC<Toolbar.ToolbarButtonProps> = (props) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = useRefCallback((data: { id: string, name: string }) => {
    setOpen(false);
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Toolbar.Button {...props} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title className='dialog-title'>
            New Collection
          </Dialog.Title>
          <Form onSubmit={handleSubmit}>
            <FormControl name="id" label="ID" placeholder="id" defaultValue="">
              <TextField />
            </FormControl>
            <FormControl name="name" label="Name" placeholder="name" defaultValue="">
              <TextField />
            </FormControl>
            <div className="flex">
              <button className="mt-12 ml-auto" type="submit">SUBMIT</button>
            </div>
          </Form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

AddCollectionItem.displayName = 'AddCollectionItem';
