
'use client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { UserCircle, Edit3 } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in?redirect=/profile');
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
        <UserCircle className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">내 프로필</h1>
        <p className="mt-2 text-lg text-foreground/80">
          계정 정보 및 환경 설정을 관리합니다.
        </p>
      </header>

      <Card className="shadow-xl border-primary/10">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || '사용자'} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : <UserCircle />}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline text-2xl text-primary">{user.displayName || 'InnerSpell 사용자'}</CardTitle>
              <CardDescription className="text-md text-muted-foreground">{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="displayName">닉네임</Label>
            <div className="flex items-center space-x-2">
              <Input id="displayName" defaultValue={user.displayName || ''} disabled className="bg-muted/50" />
              <Button variant="outline" size="icon" disabled><Edit3 className="h-4 w-4" /></Button>
            </div>
            <p className="text-xs text-muted-foreground">닉네임 변경 기능은 준비 중입니다.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">이메일 주소</Label>
            <Input id="email" type="email" value={user.email || ''} disabled  className="bg-muted/50" />
          </div>

          <Separator />

           <div>
            <h3 className="font-semibold text-lg text-primary mb-2">계정 관리</h3>
            <Button variant="outline" disabled className="w-full sm:w-auto">비밀번호 변경 (준비 중)</Button>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}
