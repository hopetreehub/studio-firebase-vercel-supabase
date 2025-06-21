
import { getAllPosts } from '@/actions/blogActions';
import { tarotDeck } from '@/lib/tarot-data';
import type { BlogPost, TarotCard } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

function generateSitemapXml(
  siteUrl: string,
  posts: BlogPost[],
  cards: TarotCard[],
  staticPages: { path: string; priority: number; changefreq: string }[]
): string {
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static pages
  staticPages.forEach(page => {
    xml += `
  <url>
    <loc>${siteUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`;
  });

  // Blog posts
  posts.forEach(post => {
    const lastModified = post.updatedAt 
      ? post.updatedAt.toISOString().split('T')[0] 
      : (post.createdAt ? post.createdAt.toISOString().split('T')[0] : today);
    xml += `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Tarot cards
  cards.forEach(card => {
    xml += `
  <url>
    <loc>${siteUrl}/encyclopedia/${card.id}</loc>
    <lastmod>${today}</lastmod> 
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  xml += `</urlset>`;
  return xml;
}

export async function GET() {
  if (!SITE_URL) {
    return new Response('Sitemap disabled: NEXT_PUBLIC_SITE_URL is not set.', {
      status: 500,
    });
  }

  const posts = await getAllPosts();
  const cards = tarotDeck;

  const staticAppPages = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/reading', priority: 0.8, changefreq: 'weekly' },
    { path: '/encyclopedia', priority: 0.8, changefreq: 'monthly' },
    { path: '/blog', priority: 0.8, changefreq: 'weekly' },
    { path: '/community', priority: 0.7, changefreq: 'weekly' },
    { path: '/sign-in', priority: 0.3, changefreq: 'yearly' },
    { path: '/sign-up', priority: 0.3, changefreq: 'yearly' },
  ];

  const body = generateSitemapXml(SITE_URL, posts, cards, staticAppPages);

  return new Response(body, {
    status: 200,
    headers: {
      'Cache-control': 'public, s-maxage=86400, stale-while-revalidate', // Cache for 1 day
      'Content-Type': 'application/xml',
    },
  });
}
