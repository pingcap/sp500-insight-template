import { FC, HTMLAttributes, ReactElement, ReactNode, useMemo } from 'react';
import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import { UrlObject } from 'url';
import * as ContextMenu from '@radix-ui/react-context-menu';

type ContextMenuElement = ReactElement<ContextMenu.MenuContentProps, typeof ContextMenu.Content>;

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'children'>, Pick<LinkProps, 'as'> {
  text?: ReactNode;
  description?: ReactNode;
  detail?: ReactNode;
  menu?: ContextMenuElement;
  overlay?: ReactElement;
  href?: string;
}

const ListItem: FC<ListItemProps> = ({ text, description, detail, href, as, className, menu, overlay, ...props }) => {
  const finalClassName = useClassName({ text, description, detail, href, overlay, className });

  let content = renderContent(text, description, detail);

  if (href) {
    content = renderHref(href, as, content);
  }

  if (menu) {
    content = renderContextMenu(menu, content);
  }

  return (
    <li className={finalClassName} {...props}>
      {content}
      {overlay}
    </li>
  );
};

function useClassName ({ text, description, detail, href, overlay, className }: Pick<ListItemProps, 'text' | 'description' | 'detail' | 'href' | 'className' | 'overlay'>) {
  const hasText = !!text;
  const hasDescription = !!description;
  const hasDetail = !!detail;
  const hasHref = !!href;
  const hasOverlay = !!overlay;
  return useMemo(() => {
    return clsx(
      'list-item relative',
      {
        'has-text': hasText,
        'has-description': hasDescription,
        'has-detail': hasDetail,
        'has-href': hasHref,
        'has-overlay': hasOverlay,
      },
      className,
    );
  }, [hasText, hasDescription, hasDetail, hasHref, hasOverlay, className]);
}

function renderContent (text: ReactNode, description: ReactNode, detail: ReactNode) {
  return (
    <>
      {(text || description) && (<span className="left">
        {text && <span className="text">{text}</span>}
        {description && <span className="description">{description}</span>}
      </span>)}
      {detail && (<span className="right">
        {detail}
      </span>)}
    </>
  );
}

function renderHref (href: string | UrlObject, as: string | UrlObject | undefined, content: ReactElement) {
  return <Link href={href} as={as}>{content}</Link>;
}

function renderContextMenu (contextMenu: ContextMenuElement, content: ReactElement) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        {content}
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        {contextMenu}
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

export default ListItem;
