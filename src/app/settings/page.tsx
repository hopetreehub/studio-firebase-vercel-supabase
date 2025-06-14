'use client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Cog, Bell, Palette } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in?redirect=/settings');
    }
  }, [user, loading, router]);

  if (loading || !user) {
     return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="text-center">
        <Cog className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">Settings</h1>
        <p className="mt-2 text-lg text-foreground/80">
          Customize your MysticSight Tarot experience.
        </p>
      </header>

      <Card className="shadow-xl border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Palette className="mr-2 h-6 w-6 text-accent" /> Appearance
          </CardTitle>
          <CardDescription>Manage theme and display settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="text-md">Dark Mode</Label>
            <Switch id="dark-mode" disabled /> 
          </div>
           <p className="text-xs text-muted-foreground">Dark mode toggle coming soon.</p>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Bell className="mr-2 h-6 w-6 text-accent" /> Notifications
          </CardTitle>
          <CardDescription>Control how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="newsletter-notifications" className="text-md">Newsletter Subscription</Label>
            <Switch id="newsletter-notifications" defaultChecked disabled />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="feature-updates" className="text-md">Feature Updates</Label>
            <Switch id="feature-updates" disabled />
          </div>
          <p className="text-xs text-muted-foreground">Notification preferences coming soon.</p>
        </CardContent>
      </Card>

      <Separator />
      <div className="text-center">
        <Button variant="destructive" disabled>Delete Account (Coming Soon)</Button>
      </div>
    </div>
  );
}
