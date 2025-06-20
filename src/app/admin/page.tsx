
'use client'; // Add this because we'll use useState and useEffect

import React, { useState, useEffect } from 'react';
import { AIPromptConfigForm } from '@/components/admin/AIPromptConfigForm';
import { BlogManagementForm } from '@/components/admin/BlogManagementForm';
import { UserManagement } from '@/components/admin/UserManagement';
import { SystemManagement } from '@/components/admin/SystemManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Cog, FileText, Users, ShieldCheck, ListChecks, Edit, Trash2, AlertTriangle } from 'lucide-react';

import { getAllPosts, deleteBlogPost } from '@/actions/blogActions'; // Import from actions
import type { BlogPost } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';


function ExistingBlogPosts({ onEditPost, onPostsLoaded }: { onEditPost: (post: BlogPost) => void; onPostsLoaded: () => void; }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await getAllPosts(); 
      setPosts(fetchedPosts);
      setError(null);
    } catch (err: any) {
      setError('게시물을 불러오는 데 실패했습니다: ' + err.message);
      toast({ variant: 'destructive', title: '오류', description: '게시물 목록을 가져오지 못했습니다.' });
    } finally {
      setLoading(false);
      onPostsLoaded();
    }
  };

  useEffect(() => {
    fetchPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPostsLoaded]); 

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    const result = await deleteBlogPost(postToDelete.id);
    if (result.success) {
      toast({ title: '성공', description: `"${postToDelete.title}" 게시물이 삭제되었습니다.` });
      setPosts(posts.filter(p => p.id !== postToDelete.id));
    } else {
      toast({ variant: 'destructive', title: '삭제 실패', description: result.error });
    }
    setPostToDelete(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center py-10"><Spinner size="large" /></div>;
  }
  if (error) {
    return <p className="text-destructive text-center py-10">{error}</p>;
  }

  return (
    <Card className="shadow-lg border-primary/10 mt-6">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary flex items-center">
          <ListChecks className="mr-2 h-5 w-5" /> 기존 블로그 게시물
        </CardTitle>
        <CardDescription>게시물을 수정하거나 삭제할 수 있습니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center">게시물이 없습니다.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>슬러그</TableHead>
                <TableHead>작성일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-xs truncate" title={post.title}>{post.title}</TableCell>
                  <TableCell className="max-w-xs truncate" title={post.slug}>{post.slug}</TableCell>
                  <TableCell>{new Date(post.date).toLocaleDateString('ko-KR')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEditPost(post)}>
                      <Edit className="mr-1 h-4 w-4" /> 수정
                    </Button>
                    <AlertDialogTrigger asChild>
                       <Button variant="destructive" size="sm" onClick={() => setPostToDelete(post)}>
                        <Trash2 className="mr-1 h-4 w-4" /> 삭제
                      </Button>
                    </AlertDialogTrigger>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center"><AlertTriangle className="mr-2 text-destructive"/>정말로 삭제하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                "{postToDelete?.title}" 게시물을 삭제합니다. 이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPostToDelete(null)}>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">삭제 확인</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}


export default function AdminDashboardPage() {
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(undefined);
  const [refreshPostListKey, setRefreshPostListKey] = useState(0); // Key to trigger refresh

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
  };

  const handleCancelEdit = () => {
    setEditingPost(undefined);
  };
  
  const handleFormSubmitSuccess = () => {
    setEditingPost(undefined); // Clear editing mode
    setRefreshPostListKey(prev => prev + 1); // Trigger list refresh
  };


  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4">
          <ShieldCheck className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold text-primary">관리자 대시보드</h1>
        <p className="mt-2 text-lg text-foreground/80">
          애플리케이션의 다양한 설정을 관리합니다. (향후 실제 로그인 시 관리자 권한 필요)
        </p>
      </header>

      <Tabs defaultValue="blog-management" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="ai-config" className="text-sm sm:text-base">
            <Cog className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" /> AI 설정
          </TabsTrigger>
          <TabsTrigger value="blog-management" className="text-sm sm:text-base">
            <FileText className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" /> 블로그 관리
          </TabsTrigger>
          <TabsTrigger value="user-management" className="text-sm sm:text-base">
            <Users className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" /> 회원 관리
          </TabsTrigger>
          <TabsTrigger value="system-management" className="text-sm sm:text-base">
            <ShieldCheck className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" /> 시스템 관리
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-config">
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center">
                <Cog className="mr-2 h-6 w-6" /> AI 프롬프트 및 안전 설정
              </CardTitle>
              <CardDescription>
                타로 해석 생성을 위한 AI의 프롬프트 템플릿 및 안전 설정을 관리하고 업데이트합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIPromptConfigForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog-management">
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center">
                <FileText className="mr-2 h-6 w-6" /> {editingPost ? '블로그 게시물 수정' : '새 블로그 게시물 작성'}
              </CardTitle>
              <CardDescription>
                {editingPost ? `"${editingPost.title}" 게시물을 수정합니다.` : '새로운 블로그 게시물을 작성합니다.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlogManagementForm 
                key={editingPost ? editingPost.id : 'new'} // Re-mount form when editingPost changes
                initialData={editingPost} 
                onFormSubmitSuccess={handleFormSubmitSuccess}
                onCancelEdit={handleCancelEdit}
              />
            </CardContent>
          </Card>
          <Separator className="my-8" />
          <ExistingBlogPosts key={refreshPostListKey} onEditPost={handleEditPost} onPostsLoaded={() => {}} />
        </TabsContent>

        <TabsContent value="user-management">
          <UserManagement />
        </TabsContent>

        <TabsContent value="system-management">
          <SystemManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
