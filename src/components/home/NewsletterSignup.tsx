'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export function NewsletterSignup() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Newsletter signup:', values.email);
    toast({
      title: 'Subscribed!',
      description: "You've successfully signed up for our newsletter.",
    });
    form.reset();
    setLoading(false);
  };

  return (
    <section className="py-16 sm:py-24 bg-primary/5 rounded-xl shadow-lg border border-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="mx-auto h-12 w-12 text-accent mb-4" />
        <h2 className="font-headline text-3xl sm:text-4xl font-semibold text-primary mb-4">
          Stay Connected with MysticSight
        </h2>
        <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter for the latest updates, tarot insights, and exclusive offers.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder="Enter your email address" 
                        className="pl-10 h-12 text-base"
                        {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 shadow-md" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
