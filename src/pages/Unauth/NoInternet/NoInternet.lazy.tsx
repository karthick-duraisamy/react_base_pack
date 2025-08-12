import React, { JSX, lazy, Suspense } from 'react';

const LazyNoInternet = lazy(() => import('./NoInternet'));

const NoInternet = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyNoInternet {...props} />
  </Suspense>
);

export default NoInternet;
