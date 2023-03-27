import type { MDXComponents } from 'mdx/types';
import type { AnchorHTMLAttributes } from 'react';
import Link from 'next/link';

function a ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href) {
    if (/^https?:\/\//.test(href)) {
      return <a href={href} target="_blank" rel="noopener nofollow" {...props} />;
    } else if (/^#/.test(href)) {
      return <a href={href} {...props} />;
    } else {
      return <Link href={href} {...props} />;
    }
  } else {
    return <a href={href} {...props} />;
  }
}

export function useMDXComponents (components: MDXComponents): MDXComponents {
  return { a, ...components };
}
