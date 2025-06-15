
'use client';
// import { useAuth } from '@/context/AuthContext'; // useAuth 제거
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button'; // Button 제거 (필요시 유지)
// import { Switch } from '@/components/ui/switch'; // Switch 제거 (필요시 유지)
// import { Label } from '@/components/ui/label'; // Label 제거 (필요시 유지)
// import { Separator } from '@/components/ui/separator'; // Separator 제거 (필요시 유지)
import { Cog, Palette } from 'lucide-react'; // Bell 아이콘 임시 제거
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'; // useRouter 제거
// import { Spinner } from '@/components/ui/spinner'; // Spinner 제거
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch'; // Switch 는 테마용으로 남겨둠
import { Label } from '@/components/ui/label'; // Label은 테마용으로 남겨둠
import { Separator } from '@/components/ui/separator'; // Separator는 구조용으로 남겨둠
import { Button } from '@/components/ui/button'; // Button은 구조용으로 남겨둠


export default function SettingsPage() {
  // const { user, loading: authLoading } = useAuth(); // useAuth 관련 로직 제거
  // const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // useEffect(() => { // 리디렉션 로직 제거
  //   if (!authLoading && !user) {
  //     router.push('/sign-in?redirect=/settings');
  //   }
  // }, [user, authLoading, router]);

  // if (authLoading || !user || !mounted) { // 로딩 상태 제거 (mounted는 테마용으로 유지)
  //    return (
  //     <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
  //       <Spinner size="large" />
  //     </div>
  //   );
  // }
  if (!mounted) {
    return null; // 테마 로딩 전까지 아무것도 렌더링하지 않음
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="text-center">
        <Cog className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">설정</h1>
        <p className="mt-2 text-lg text-foreground/80">
          InnerSpell 환경을 맞춤 설정하세요. (일부 기능은 현재 비활성화되어 있습니다.)
        </p>
      </header>

      <Card className="shadow-xl border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Palette className="mr-2 h-6 w-6 text-accent" /> 화면 테마
          </CardTitle>
          <CardDescription>테마 및 화면 표시 설정을 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode-toggle" className="text-md">다크 모드</Label>
            <Switch 
              id="dark-mode-toggle" 
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              aria-label="다크 모드 토글"
            /> 
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">알림</CardTitle>
          <CardDescription>알림 수신 방법 설정 (현재 비활성화됨)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            알림 설정 기능은 현재 준비 중입니다.
          </p>
        </CardContent>
      </Card>

      <Separator />
      <div className="text-center">
        <Button variant="destructive" disabled>계정 삭제 (준비 중)</Button>
      </div>
    </div>
  );
}
