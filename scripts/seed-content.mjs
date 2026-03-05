import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'oinzfji7',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
});

async function seed() {
  // Create author
  const author = await client.createOrReplace({
    _type: 'author',
    _id: 'author-alessandro',
    name: 'Alessandro Dodi',
    slug: { _type: 'slug', current: 'alessandro-dodi' },
    bio: 'Co-founder di Carefully Built. Full-stack developer e UI/UX designer.',
  });
  console.log('Created author:', author._id);

  // Create category
  const category = await client.createOrReplace({
    _type: 'category',
    _id: 'category-tech',
    title: 'Technology',
    slug: { _type: 'slug', current: 'technology' },
    description: 'Articoli su tecnologia, sviluppo e design',
  });
  console.log('Created category:', category._id);

  // Create post
  const post = await client.createOrReplace({
    _type: 'post',
    _id: 'post-first-article',
    title: 'Benvenuti sul Blog di Blueprint',
    slug: { _type: 'slug', current: 'benvenuti-sul-blog-di-blueprint' },
    author: { _type: 'reference', _ref: 'author-alessandro' },
    categories: [{ _type: 'reference', _ref: 'category-tech', _key: 'cat1' }],
    publishedAt: new Date().toISOString(),
    excerpt: 'Il primo articolo del nostro blog. Scopri come Blueprint può aiutarti a costruire il tuo prossimo progetto.',
    body: [
      {
        _type: 'block',
        _key: 'intro',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'Benvenuti sul blog di Blueprint! Questo è il primo post di test. Lo Studio Sanity è ora configurato e pronto per gestire tutti i contenuti del blog.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'paragraph2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span2',
            text: 'Da qui potrai creare, modificare e pubblicare articoli con un editor visuale intuitivo.',
          },
        ],
        markDefs: [],
      },
    ],
  });
  console.log('Created post:', post._id);

  console.log('✅ Seed completed!');
}

seed().catch(console.error);
