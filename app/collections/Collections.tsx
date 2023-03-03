import { cache, FC, use } from 'react';
import CollectionItem from '@/app/collections/CollectionItem';
import List from '@/components/List';
import clsx from 'clsx';
import { getCollections } from '@/app/collections/api';

export interface CollectionsProps {
  active?: string;
}

const Collections: FC<CollectionsProps> = ({ active }) => {
  const collections = use(cache(getCollections)());

  return (
    <List>
      {collections.map(c => (
        <CollectionItem className={clsx({ active: active === c.id })} key={c.id} data={c} />
      ))}
    </List>
  );
};

Collections.displayName = 'Collections';

export default Collections;