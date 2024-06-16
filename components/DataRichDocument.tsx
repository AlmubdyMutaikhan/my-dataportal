import { MDXRemote } from 'next-mdx-remote';
import dynamic from 'next/dynamic';
import { Mermaid } from '@portaljs/core';

const components = {
  Table: dynamic(() => import('@portaljs/components').then(mod => mod.Table)),
  Catalog: dynamic(() => import('@portaljs/components').then(mod => mod.Catalog)),
  mermaid: Mermaid,
  Vega: dynamic(() => import('@portaljs/components').then(mod => mod.Vega)),
  VegaLite: dynamic(() => import('@portaljs/components').then(mod => mod.VegaLite)),
  LineChart: dynamic(() => import('@portaljs/components').then(mod => mod.LineChart)),
  FlatUiTable: dynamic(() => import('@portaljs/components').then(mod => mod.FlatUiTable)),
} as any;

export default function DRD({ source }: { source: any }) {
  return <MDXRemote {...source} components={components} />;
}
