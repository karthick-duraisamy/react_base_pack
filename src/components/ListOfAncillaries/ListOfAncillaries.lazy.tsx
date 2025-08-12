import React, { JSX, lazy, Suspense } from 'react';

const LazyListOfAncillaries = lazy(() => import('./ListOfAncillaries'));

const ListOfAncillaries = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyListOfAncillaries page={''} {...props} />
  </Suspense>
);

export default ListOfAncillaries;
