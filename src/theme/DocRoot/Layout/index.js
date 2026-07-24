import React from 'react';
import Layout from '@theme-original/DocRoot/Layout';
import AutoScrollSidebar from '@site/src/components/AutoScrollSidebar';

export default function LayoutWrapper(props) {
  return (
    <>
      <AutoScrollSidebar />
      <Layout {...props} />
    </>
  );
}