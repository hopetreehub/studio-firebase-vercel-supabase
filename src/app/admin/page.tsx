
import { AIPromptConfigForm } from '@/components/admin/AIPromptConfigForm';
import { BlogManagementForm } from '@/components/admin/BlogManagementForm';
import { UserManagement } from '@/components/admin/UserManagement';
import { SystemManagement } from '@/components/admin/SystemManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Cog, FileText, Users, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '관리자 대시보드 - InnerSpell',
  description: 'InnerSpell 애플리케이션 설정을 관리합니다.',
};

export default function AdminDashboardPage() {
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

      <Tabs defaultValue="ai-config" className="w-full">
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
                <FileText className="mr-2 h-6 w-6" /> 블로그 게시물 작성 및 관리
              </CardTitle>
              <CardDescription>
                새로운 블로그 게시물을 작성하거나 기존 게시물을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlogManagementForm />
            </CardContent>
          </Card>
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
