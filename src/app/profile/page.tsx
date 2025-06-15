
'use client';
// import { useAuth } from '@/context/AuthContext'; // useAuth 제거
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Avatar 관련 제거
// import { Button } from '@/components/ui/button'; // Button 제거 (필요시 유지)
// import { Input } from '@/components/ui/input'; // Input 제거 (필요시 유지)
// import { Label } from '@/components/ui/label'; // Label 제거 (필요시 유지)
// import { Separator } from '@/components/ui/separator'; // Separator 제거 (필요시 유지)
import { UserCircle } from 'lucide-react';
// import { useEffect } from 'react'; // useEffect 제거
// import { useRouter } from 'next/navigation'; // useRouter 제거
// import { Spinner } from '@/components/ui/spinner'; // Spinner 제거

export default function ProfilePage() {
  // const { user, loading } = useAuth(); // useAuth 관련 로직 제거
  // const router = useRouter();

  // useEffect(() => { // 리디렉션 로직 제거
  //   if (!loading && !user) {
  //     router.push('/sign-in?redirect=/profile');
  //   }
  // }, [user, loading, router]);

  // if (loading || !user) { // 로딩 상태 제거
  //   return (
  //     <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
  //       <Spinner size="large" />
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <header className="text-center">
        <UserCircle className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">내 프로필</h1>
      </header>
      <Card className="shadow-xl border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">기능 비활성화됨</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-md text-muted-foreground">
            프로필 기능은 현재 일시적으로 사용할 수 없습니다. 개발 완료 후 다시 활성화될 예정입니다.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
