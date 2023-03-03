import { FC, HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface ListProps extends HTMLAttributes<HTMLUListElement> {

}

const List: FC<ListProps> = ({ className, ...props }) => {
  return (
    <ul className={clsx('list', props)} {...props} />
  );
};

export default List;
