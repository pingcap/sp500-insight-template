import { ChangeEvent, FC } from 'react';
import { useRefCallback } from '@/utils/hook';
import SearchIcon from '@heroicons/react/20/solid/MagnifyingGlassIcon';
import clsx from 'clsx';

interface ListSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ListSearch: FC<ListSearchProps> = ({ className, value, placeholder = 'Search...', onChange }) => {
  const handleChange = useRefCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  });
  return (
    <div className={clsx('flex gap-2 p-2 items-center transition-colors rounded bg-secondary focus-within:bg-active', className)}>
      <SearchIcon className="h-4 text-secondary" color="currentColor" />
      <input
        className="block flex-1 text-lg outline-none bg-transparent text-significant placeholder:text-secondary"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  );
};

export default ListSearch;
