import { SignInForm } from '@/components/auth/SignInForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - MysticSight Tarot',
  description: 'Sign in to your MysticSight Tarot account.',
};

export default function SignInPage() {
  return <SignInForm />;
}
