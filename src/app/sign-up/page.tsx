import { SignUpForm } from '@/components/auth/SignUpForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - MysticSight Tarot',
  description: 'Create your MysticSight Tarot account.',
};

export default function SignUpPage() {
  return <SignUpForm />;
}
