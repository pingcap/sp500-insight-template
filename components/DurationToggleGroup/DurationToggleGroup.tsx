import { FC } from 'react';
import CommonToggleGroup from '@/components/ToggleGroup';

interface DurationToggleGroupProps {
  value?: string | null;
  onChange?: (value: string) => void;
  hasRealtime?: boolean;
}

const DurationToggleGroup: FC<DurationToggleGroupProps> = ({ value, onChange, hasRealtime = false }) => {
  return (
    <CommonToggleGroup value={value} onChange={onChange} options={hasRealtime ? DURATION_WITH_REALTIME : DURATIONS} label="Duration" />
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

const DURATION_WITH_REALTIME: Duration[] = [
  { name: 'Realtime' },
  ...DURATIONS,
]

export default DurationToggleGroup;