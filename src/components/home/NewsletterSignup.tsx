
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
import { Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { subscribeToNewsletter, type NewsletterSubscriptionFormData } from '@/actions/newsletterActions';

const formSchema = z.object({
  email: z.string().email({ message: '유효한 이메일 주소를 입력해주세요.' }),
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

  const onSubmit = async (values: NewsletterSubscriptionFormData) => {
    setLoading(true);
    const result = await subscribeToNewsletter(values);
    
    if (result.success) {
      toast({
        title: '구독 처리 완료',
        description: result.message,
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: '구독 실패',
        description: result.message,
      });
    }
    setLoading(false);
  };

  return (
    <section className="py-16 sm:py-24 bg-primary/5 rounded-xl shadow-lg border border-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="mx-auto h-12 w-12 text-accent mb-4" />
        <h2 className="font-headline text-3xl sm:text-4xl font-semibold text-primary mb-4">
          InnerSpell 소식 받기
        </h2>
        <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
          뉴스레터를 구독하고 최신 업데이트, 타로 통찰, 특별 혜택을 받아보세요.
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
                        placeholder="이메일 주소를 입력하세요" 
                        className="pl-10 h-12 text-base"
                        {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 shadow-md" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? '구독 중...' : '구독하기'}
            </Button>
          </form>
        </Form>
         <p className="text-xs text-muted-foreground mt-4">
            구독 시 <a href="mailto:junsupark9999@gmail.com" className="underline hover:text-accent">junsupark9999@gmail.com</a>에서 발송되는 뉴스레터를 수신하게 됩니다. (실제 발송은 현재 구현되지 않았습니다.)
        </p>
      </div>
    </section>
  );
}
