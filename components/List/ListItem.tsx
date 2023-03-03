import { FC, HTMLAttributes, ReactElement, ReactNode, useMemo } from 'react';
import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import { UrlObject } from 'url';

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'children'>, Pick<LinkProps, 'href' | 'as'> {
  text?: ReactNode;
  description?: ReactNode;
  detail?: ReactNode;
}

const ListItem: FC<ListItemProps> = ({ text, description, detail, href, as, className, ...props }) => {
  const finalClassName = useClassName({ text, description, detail, href, className });

  let content = renderContent(text, description, detail);

  if (href) {
    content = renderHref(href, as, content);
  }

  return (
    <li className={finalClassName}>
      {content}
    </li>
  );
};

function useClassName ({ text, description, detail, href, className }: Pick<ListItemProps, 'text' | 'description' | 'detail' | 'href' | 'className'>) {
  const hasText = !!text;
  const hasDescription = !!description;
  const hasDetail = !!detail;
  const hasHref = !!href;
  return useMemo(() => {
    return clsx(
      'list-item',
      {
        'has-text': hasText,
        'has-description': hasDescription,
        'has-detail': hasDetail,
        'has-href': hasHref,
      },
      className,
    );
  }, [hasText, hasDescription, hasDetail, hasHref, className]);
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

export default ListItem;
