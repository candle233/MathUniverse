import React from 'react';
import { initialMathNodes } from '@/data/seedData';
import { notFound } from 'next/navigation';
import NodeDetailClient from '@/components/node/NodeDetailClient';

export async function generateStaticParams() {
  return initialMathNodes.map((node) => ({
    slug: node.slug,
  }));
}

export default async function NodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const node = initialMathNodes.find((n) => n.slug === slug);
  if (!node) {
    notFound();
  }
  return <NodeDetailClient node={node} />;
}
