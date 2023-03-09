'use client';
import { FC } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';

const Navigator: FC = () => {
  return (
    <NavigationMenu.Root className='container sticky top-0 z-20 bg-primary mx-auto p-2 h-12'>
      <NavigationMenu.List className='flex items-center text-xl gap-8'>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/SP500" >
              S&P 500
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/optional">
              Optional
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};

export default Navigator;