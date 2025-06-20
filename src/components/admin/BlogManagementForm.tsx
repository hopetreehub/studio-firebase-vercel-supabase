
'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FilePlus2, Edit } from 'lucide-react';
import { submitBlogPost, type BlogFormData } from '@/actions/blogActions';
import type { BlogPost } from '@/types'; // For initialData type

const formSchema = z.object({
  title: z.string().min(5, { message: '제목은 최소 5자 이상이어야 합니다.' }).max(100, { message: '제목은 최대 100자까지 가능합니다.'}),
  slug: z.string().min(3, { message: '슬러그는 최소 3자 이상이어야 합니다.' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: '슬러그는 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.' }),
  excerpt: z.string().min(10, { message: '요약은 최소 10자 이상이어야 합니다.' }).max(200, { message: '요약은 최대 200자까지 가능합니다.'}),
  content: z.string().min(50, { message: '본문은 최소 50자 이상이어야 합니다.' }),
  imageSrc: z.string().url({ message: '유효한 이미지 URL을 입력해주세요.' }).optional().or(z.literal('')),
  dataAiHint: z.string().max(50, {message: 'AI 힌트는 최대 50자까지 가능합니다.'}).optional().or(z.literal('')),
  author: z.string().optional().or(z.literal('')),
  tags: z.string().optional().transform(val => val ? val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []),
});

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') 
    .replace(/[^\w-]+/g, '') 
    .replace(/--+/g, '-') 
    .replace(/^-+/, '') 
    .replace(/-+$/, '');
};

interface BlogManagementFormProps {
  initialData?: BlogPost; // For editing
  onFormSubmitSuccess?: () => void; // Callback after successful submission
  onCancelEdit?: () => void; // Callback to cancel editing mode
}

export function BlogManagementForm({ initialData, onFormSubmitSuccess, onCancelEdit }: BlogManagementFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!initialData); // Disable autoSlug if editing
  const [currentPostId, setCurrentPostId] = useState<string | undefined>(initialData?.id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      imageSrc: initialData?.imageSrc || '',
      dataAiHint: initialData?.dataAiHint || '',
      author: initialData?.author || 'InnerSpell 팀',
      tags: initialData?.tags || [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        slug: initialData.slug,
        excerpt: initialData.excerpt,
        content: initialData.content,
        imageSrc: initialData.imageSrc,
        dataAiHint: initialData.dataAiHint,
        author: initialData.author,
        // @ts-ignore
        tags: initialData.tags?.join(', ') || '', // Ensure tags are string for input, will be transformed
      });
      setCurrentPostId(initialData.id);
      setAutoSlug(false); // Editing, so slug should not auto-generate initially
    } else {
      form.reset({ // Reset to default for new post
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        imageSrc: '',
        dataAiHint: '',
        author: 'InnerSpell 팀',
        tags: [],
      });
      setCurrentPostId(undefined);
      setAutoSlug(true);
    }
  }, [initialData, form]);

  const titleValue = form.watch('title');

  useEffect(() => {
    if (autoSlug && titleValue && !currentPostId) { // Only auto-generate for new posts
      form.setValue('slug', generateSlug(titleValue), { shouldValidate: true });
    }
  }, [titleValue, autoSlug, form, currentPostId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    const formData: BlogFormData = {
      ...values,
      // @ts-ignore
      tags: typeof values.tags === 'string' ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : values.tags || [],
    };

    const result = await submitBlogPost(formData, currentPostId);

    if (result.success && result.postId) {
      toast({
        title: currentPostId ? '게시물 수정 성공' : '게시물 저장 성공',
        description: `"${values.title}" 게시물이 데이터베이스에 성공적으로 ${currentPostId ? '수정' : '저장'}되었습니다. (ID: ${result.postId})`,
        duration: 7000,
      });
      form.reset({ title: '', slug: '', excerpt: '', content: '', imageSrc: '', dataAiHint: '', author: 'InnerSpell 팀', tags: [] });
      setCurrentPostId(undefined);
      setAutoSlug(true);
      if (onFormSubmitSuccess) {
        onFormSubmitSuccess(); // Call callback if provided
      }
      if (currentPostId && onCancelEdit) { // If was editing, call cancel to reset mode
        onCancelEdit();
      }
    } else {
        let description = '알 수 없는 오류가 발생했습니다.';
        if (typeof result.error === 'string') {
            description = result.error;
        } else if (typeof result.error === 'object' && result.error !== null) {
            const fieldErrors = result.error as any;
            if (fieldErrors.slug) {
                description = fieldErrors.slug; 
            } else {
                description = Object.values(fieldErrors).flat().join(' ');
            }
        }
      toast({
        variant: 'destructive',
        title: currentPostId ? '게시물 수정 실패' : '게시물 저장 실패',
        description: description,
      });
    }
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">제목</FormLabel>
              <FormControl>
                <Input placeholder="게시물 제목을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">슬러그 (URL 경로)</FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input placeholder="example-post-slug" {...field} disabled={autoSlug && !currentPostId} />
                </FormControl>
                <Button type="button" variant="outline" onClick={() => setAutoSlug(!autoSlug)} disabled={!!currentPostId}>
                  {autoSlug ? '수동 입력' : '자동 생성'}
                </Button>
              </div>
              <FormDescription>
                게시물의 고유 URL 경로입니다. {autoSlug && !currentPostId ? "제목 기준으로 자동 생성됩니다." : "수동으로 입력해주세요."}
                {currentPostId && " 수정 시 슬러그를 변경하면 기존 링크가 깨질 수 있습니다."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">요약</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="게시물 목록에 표시될 짧은 요약을 입력하세요 (200자 이내)"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">본문</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="게시물 전체 내용을 입력하세요."
                  className="min-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageSrc"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">대표 이미지 URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
               <FormDescription>
                비워두면 기본 플레이스홀더 이미지가 사용됩니다.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataAiHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">이미지 AI 힌트</FormLabel>
              <FormControl>
                <Input placeholder="예: tarot cards, magic" {...field} />
              </FormControl>
              <FormDescription>
                대표 이미지 검색을 위한 키워드 (1-2 단어). 비워두면 'placeholder image'가 사용됩니다.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">작성자</FormLabel>
              <FormControl>
                <Input placeholder="작성자 이름 (기본값: InnerSpell 팀)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field: { onChange, value, ...fieldProps } }) => ( 
            <FormItem>
              <FormLabel className="text-lg font-semibold">태그</FormLabel>
              <FormControl>
                <Input 
                  placeholder="쉼표(,)로 구분하여 태그 입력 (예: 타로, 명상, 운세)" 
                  {...fieldProps} 
                  // @ts-ignore
                  onChange={(e) => onChange(e.target.value)} 
                  // @ts-ignore
                  value={Array.isArray(value) ? value.join(', ') : (value || '')} 
                />
              </FormControl>
              <FormDescription>
                게시물 분류를 위한 태그를 쉼표로 구분하여 입력하세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 py-3 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (currentPostId ? <Edit className="mr-2 h-5 w-5" /> : <FilePlus2 className="mr-2 h-5 w-5" />)}
              {currentPostId ? '게시물 수정' : '새 게시물 저장'}
            </Button>
            {currentPostId && onCancelEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onCancelEdit();
                  form.reset({ title: '', slug: '', excerpt: '', content: '', imageSrc: '', dataAiHint: '', author: 'InnerSpell 팀', tags: [] });
                  setCurrentPostId(undefined);
                  setAutoSlug(true);
                }}
                className="w-full sm:w-auto"
              >
                수정 취소 / 새 글 작성
              </Button>
            )}
        </div>
      </form>
    </Form>
  );
}
