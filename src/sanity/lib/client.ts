import { createClient } from 'next-sanity';

// Fallback to hardcoded values if env vars not set
// These match sanity.cli.ts configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'oinzfji7';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

export const isSanityConfigured = true;

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
});
