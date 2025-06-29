
import { redirect } from 'next/navigation';

type Props = {
  params: { slug: string };
};

export default function BlogPostPage({ params }: Props) {
  // Permanently redirect to the external blog post URL
  redirect(`https://blog.innerspell.com/${params.slug}`);
}
