import { FC } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

interface CommonToggleGroupProps {
  value?: string | null;
  onChange?: (value: string) => void;
  options: { name: string }[]
  label?: string
}

const CommonToggleGroup: FC<CommonToggleGroupProps> = ({ value, onChange, options, label }) => {
  return (
    <ToggleGroup.Root
      className="flex gap-4 mt-4 mb-2 flex-wrap"
      type="single"
      defaultValue="center"
      value={value ?? undefined}
      onValueChange={onChange}
      aria-label={label}
    >
      {options.map(({ name }) => (
        <ToggleGroup.Item className="toggle-item" key={name} value={name} aria-label={name}>
          {name}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
};

export default CommonToggleGroup;