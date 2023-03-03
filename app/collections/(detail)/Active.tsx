'use client';

import { cloneElement, FC, isValidElement, ReactElement } from 'react';
import { CollectionsProps } from '@/app/collections/Collections';
import { useSelectedLayoutSegment } from 'next/navigation';
import clsx from 'clsx';

// F**KING HACK
// Why need this component?
// Currently, next server component does not support `useSelectedLayoutSegment` hook, and we cannot get path params.
// The solution is mark `CollectionItem` as client component, and the element will receive key prop, then we judge
// active state by the key.
const Active: FC<{ children: ReactElement<CollectionsProps> }> = ({ children }) => {
  const id = useSelectedLayoutSegment() ?? undefined;

  if (isValidElement(children)) {
    // Seems to be never executed.
    return cloneElement(children, { active: id });
  } else {
    // Server component is actually a lazy, and the server component directly returns html elements (component info erased).
    // We need to `inject` the lazy promise resolve procedure and use `cloneElement` mutate the fulfilled element.

    // In some cases, provided promise was already resolved, and in the `then` callback, `payloadCopy` would not be initialized,
    // so we need an extra object to store these info.
    let sync: Partial<LazyElementAttrs> = {};
    let payloadCopy: Promise<ReactElement> & {
      status: string
      value: unknown;
      reason: unknown
    };
    payloadCopy = new Promise((resolve, reject) => {
      const originalPayload = (children as LazyElement)._payload;
      originalPayload.then(
        element => {
          const mutatedElement = cloneElement(element, {}, ...element.props.children.map((item: ReactElement) => {
            if (item.key === id) {
              return cloneElement(item, { className: clsx(item.props.className, 'active') });
            } else {
              return item;
            }
          }));
          Object.assign(payloadCopy ?? sync, originalPayload, {
            value: mutatedElement,
          });
          resolve(mutatedElement);
        },
        error => {
          Object.assign(payloadCopy ?? sync, originalPayload);
          reject(error);
        });
    }) as never;

    // Server side lazy element has some extra attributes, copy them.
    Object.assign(payloadCopy, (children as LazyElement)._payload, sync);

    // Hope it works every time :)
    return {
      ...children as any,
      _payload: payloadCopy,
    } as any;
  }
};

type LazyElementAttrs = {
  status: string
  value: any;
  reason: unknown
}

type LazyElement = {
  readonly $$typeof: unique symbol
  readonly _init: any
  readonly _payload: Promise<ReactElement> & LazyElementAttrs;
}

Active.displayName = 'Active';

export default Active;
