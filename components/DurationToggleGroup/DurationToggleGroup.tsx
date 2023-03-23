import { FC } from 'react';
import CommonToggleGroup from '@/components/ToggleGroup';

interface DurationToggleGroupProps {
  value?: string | null;
  onChange?: (value: string) => void;
}

const DurationToggleGroup: FC<DurationToggleGroupProps> = ({ value, onChange }) => {
  return (
    <CommonToggleGroup value={value} onChange={onChange} options={DURATIONS} label="Duration" />
  );
};

interface Duration {
  name: string;
}

const DURATIONS: Duration[] = [
  {
    name: '7D',
  },
  {
    name: '14D',
  },
  {
    name: '1M',
  },
  {
    name: '3M',
  },
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