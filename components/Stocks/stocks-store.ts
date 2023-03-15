import { ValueStorage } from '@/utils/valueStorage';

const optionalStocksStore = new ValueStorage<string[]>(
  'localStorage',
  'optional-stocks',
  arr => arr.join(','),
  text => text.split(',').map(s => s.trim()).filter(Boolean),
  () => [],
);

export default optionalStocksStore;