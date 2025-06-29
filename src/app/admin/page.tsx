
'use client'; 

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { AIPromptConfigForm } from '@/components/admin/AIPromptConfigForm';
import { DreamInterpretationConfigForm } from '@/components/admin/DreamInterpretationConfigForm';
import { UserManagement } from '@/components/admin/UserManagement';
import { SystemManagement } from '@/components/admin/SystemManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Cog, Users, ShieldCheck, MoonStar } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';


export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to sign-in
        router.replace('/sign-in?redirect=/admin');
      } else if (user.role !== 'admin') {
        // Not an admin, redirect to home
        router.replace('/');
      }
    }
  }, [user, loading, router]);


  
  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">관리자 권한을 확인하는 중...</p>
          <Spinner size="large" />
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4">
          <ShieldCheck className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold text-primary">관리자 대시보드</h1>
        <p className="mt-2 text-lg text-foreground/80">
          애플리케이션의 다양한 설정을 관리합니다.
        </p>
      </header>

      <Tabs defaultValue="tarot-ai-config" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <TabsTrigger value="tarot-ai-config" className="text-sm sm:text-base">
            <Cog className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" /> 타로 AI
          </TabsTrigger>
          <TabsTrigger value="dream-ai-config" className="text-sm sm:text-base">
            <MoonStar className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" /> 꿈해몽 AI
          </TabsTrigger>
          <TabsTrigger value="user-management" className="text-sm sm:text-base">
            <Users className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" /> 회원 관리
          </TabsTrigger>
          <TabsTrigger value="system-management" className="text-sm sm:text-base">
            <ShieldCheck className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" /> 시스템 관리
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tarot-ai-config">
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center">
                <Cog className="mr-2 h-6 w-6" /> 타로 AI 프롬프트 및 안전 설정
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

        <TabsContent value="dream-ai-config">
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center">
                <MoonStar className="mr-2 h-6 w-6" /> 꿈 해몽 AI 프롬프트 설정
              </CardTitle>
              <CardDescription>
                꿈 해몽 생성을 위한 AI의 프롬프트 템플릿을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DreamInterpretationConfigForm />
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
