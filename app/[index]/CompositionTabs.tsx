'use client';
import { FC } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import IndexCompositions from '@/charts/IndexCompositions';
import IndexCompositionCountryDistribution from '@/charts/IndexCompositionCountryDistribution';
import IndexCompositionExchangeDistribution from '@/charts/IndexCompositionExchangeDistribution';

export interface ContributionTagsProps {
  index: string;
}

const CompositionTabs: FC<ContributionTagsProps> = ({ index }) => {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List className="flex gap-4 mb-2">
        {TABS.map(({ key, title }) => (
          <Tabs.Trigger key={key} value={key} className="text-primary px-2 py-1 rounded-xl transition-colors hover:bg-secondary text-lg data-[state=active]:bg-active data-[state=active]:text-significant">
            {title}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {TABS.map(({ key, Component }) => (
        <Tabs.Content key={key} value={key}>
          <Component index={index} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

type TabItem = {
  key: string
  title: string
  Component: FC<{ index: string }>
}

const TABS: TabItem[] = [
  { key: 'overview', title: 'Overview', Component: IndexCompositions },
  { key: 'country_distribution', title: 'Country Distribution', Component: IndexCompositionCountryDistribution },
  { key: 'exchange_distribution', title: 'Exchange Distribution', Component: IndexCompositionExchangeDistribution },
];

export default CompositionTabs;