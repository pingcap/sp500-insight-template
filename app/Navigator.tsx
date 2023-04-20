'use client';
import { FC } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

const Navigator: FC = () => {
  const pathname = usePathname();

  return (
    <NavigationMenu.Root className="max-w-[960px] mx-auto sticky top-0 z-20 bg-primary p-2 h-12 my-2">
      <NavigationMenu.List className="flex items-center text-xl gap-8 text-primary">
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link {...linkProps('/SP500', pathname)}>
              S&P 500 Analysis
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link {...linkProps('/selected', pathname)}>
              Selected Stocks
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link {...linkProps('/SP500/sector-ranking', pathname)}>
              Ranking
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link {...linkProps('/SP500/constituents', pathname)}>
              Constituents
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        {/*<NavigationMenu.Item>*/}
        {/*  <NavigationMenu.Link asChild>*/}
        {/*    <Link {...linkProps('/data-tracker/blog', pathname)}>*/}
        {/*      Deploy*/}
        {/*    </Link>*/}
        {/*  </NavigationMenu.Link>*/}
        {/*</NavigationMenu.Item>*/}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};

export default Navigator;

const linkProps = (path: string, currentPath: string): LinkProps & { className?: string } => {
  if (path === currentPath) {
    return {
      href: path,
      className: 'p-2 transitions-colors text-significant rounded bg-active',
    };
  } else {
    return {
      href: path,
      className: 'p-2 transitions-colors'
    };
  }
};
