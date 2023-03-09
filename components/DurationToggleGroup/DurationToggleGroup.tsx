import { FC } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

interface DurationToggleGroupProps {
  value?: string | null;
  onChange?: (value: string) => void;
}

const DurationToggleGroup: FC<DurationToggleGroupProps> = ({ value, onChange }) => {
  return (
    <ToggleGroup.Root
      className="flex gap-4 mt-4 mb-2"
      type="single"
      defaultValue="center"
      value={value ?? undefined}
      onValueChange={onChange}
      aria-label="Duration"
    >
      {DURATIONS.map(({ name }) => (
        <ToggleGroup.Item className="toggle-item" key={name} value={name} aria-label={name}>
          {name}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
};

interface Duration {
  name: string;
}

const DURATIONS: Duration[] = [
  {
    name: '6M',
  },
  {
    name: 'YTD',
  },
  {
    name: '1Y',
  },
  {
    name: '5Y',
  },
  {
    name: 'MAX',
  }];

export default DurationToggleGroup;