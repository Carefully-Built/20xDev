'use client';

import { notFound } from 'next/navigation';
import { NextStudio } from 'next-sanity/studio';

import { siteConfig } from '@/config/site';
import config from '@/sanity/sanity.config';

export default function StudioPage(): React.ReactElement {
  if (!siteConfig.features.studio) notFound();

  return <NextStudio config={config} />;
}
