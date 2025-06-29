
import { redirect } from 'next/navigation';

export default function BlogPage() {
  // Permanently redirect to the external blog
  redirect('https://blog.innerspell.com');
}
