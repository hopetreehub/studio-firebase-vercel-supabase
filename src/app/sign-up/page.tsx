
// import { SignUpForm } from '@/components/auth/SignUpForm'; // SignUpForm 제거
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

export const metadata: Metadata = {
  title: '회원가입 - InnerSpell',
  description: 'InnerSpell 계정을 만드세요.',
};

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="font-headline text-3xl text-primary">회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center text-md text-muted-foreground">
            회원가입 기능은 현재 일시적으로 사용할 수 없습니다. <br />
            개발이 완료된 후 다시 활성화될 예정입니다.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
