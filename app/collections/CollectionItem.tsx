'use client';
import { CollectionData } from '@/app/collections/api';
import { FC } from 'react';
import { ListItem, ListItemProps } from '@/components/List';

export interface CollectionItemProps extends Omit<ListItemProps, 'text' | 'detail' | 'description' | 'href'> {
  data: CollectionData;
}

const CollectionItem: FC<CollectionItemProps> = ({ data, ...props }) => {
  return (
    <ListItem
      text={data.id}
      description={data.name}
      detail={`${data.member.length} members`}
      href={{
        pathname: '/collections/[id]',
        query: { id: data.id }
      }}
      as={`/collections/${data.id}`}
      {...props}
    />
  );
};

CollectionItem.displayName = 'CollectionItem'

export default CollectionItem;