import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Feather } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - MysticSight Tarot',
  description: 'Articles and insights on tarot, spirituality, and self-discovery.',
};

const blogPosts = [
  {
    id: '1',
    title: 'The Beginner\'s Guide to Tarot Reading',
    date: 'October 26, 2023',
    excerpt: 'New to tarot? This guide will walk you through the basics of tarot reading, from choosing your first deck to understanding card meanings.',
    imageSrc: 'https://placehold.co/600x400.png',
    dataAiHint: 'tarot cards guide',
    slug: '/blog/beginners-guide-to-tarot',
  },
  {
    id: '2',
    title: 'Understanding the Major Arcana: A Journey of Archetypes',
    date: 'November 5, 2023',
    excerpt: 'Dive deep into the Major Arcana and explore the powerful archetypal energies that guide our life\'s journey.',
    imageSrc: 'https://placehold.co/600x400.png',
    dataAiHint: 'major arcana',
    slug: '/blog/major-arcana-journey',
  },
  {
    id: '3',
    title: 'How AI is Revolutionizing Tarot Readings',
    date: 'November 15, 2023',
    excerpt: 'Explore the intersection of ancient wisdom and modern technology. How can AI enhance our understanding and experience of tarot?',
    imageSrc: 'https://placehold.co/600x400.png',
    dataAiHint: 'AI tarot',
    slug: '/blog/ai-tarot-revolution',
  },
];

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <Feather className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">Mystic Musings</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Explore articles, insights, and stories about tarot, spirituality, and personal growth.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group">
            <Link href={post.slug} className="block">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={post.imageSrc}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint={post.dataAiHint}
                />
              </div>
            </Link>
            <CardHeader>
              <Link href={post.slug}>
                <CardTitle className="font-headline text-2xl text-primary group-hover:text-accent transition-colors">{post.title}</CardTitle>
              </Link>
              <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
                <CalendarDays className="h-4 w-4 mr-1.5" /> {post.date}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-foreground/70 line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild className="text-accent p-0">
                <Link href={post.slug}>Read More &rarr;</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
