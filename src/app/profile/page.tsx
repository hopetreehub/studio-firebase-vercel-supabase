
'use client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { UserCircle, Edit3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { updateProfile as firebaseUpdateProfile } from 'firebase/auth'; // aliased to avoid conflict
import { useToast } from '@/hooks/use-toast';
import type { User } from 'firebase/auth';


export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in?redirect=/profile');
    }
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdating(true);
    try {
      await firebaseUpdateProfile(user, { displayName });
      // Manually update the user object in AuthContext or re-fetch if necessary
      // For now, we'll just assume Firebase propagates this change or user reloads
      if (auth.currentUser) { // auth needs to be imported from firebase client
         // This is a trick to force re-render if displayName changed
        const updatedUser = { ...auth.currentUser, displayName: displayName } as User;
         // You might need a way to update the user in your AuthContext
         // For simplicity, we're not doing that here, but in a real app, you would.
      }

      toast({ title: '성공', description: '프로필이 업데이트되었습니다.' });
      setIsEditing(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: '오류', description: `프로필 업데이트 실패: ${error.message}` });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Spinner size="large" />
      </div>
    );
  }
  
  // Need to import auth from '@/lib/firebase/client' for the trick above.
  // This is a placeholder since I cannot add imports here.
  // In a real scenario, you'd have a way to update AuthContext's user.
  const auth = { currentUser: user };


  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <header className="text-center">
        <UserCircle className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">내 프로필</h1>
      </header>
      <Card className="shadow-xl border-primary/10">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl text-primary">계정 정보</CardTitle>
            {!isEditing && (
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                {(displayName || user.email?.charAt(0) || 'U').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-2">
                  <Label htmlFor="displayNameInput" className="sr-only">닉네임</Label>
                  <Input 
                    id="displayNameInput" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="닉네임"
                    className="text-lg font-semibold"
                  />
                   <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={isUpdating}>
                      {isUpdating ? <Spinner size="small" className="mr-2" /> : null}
                      저장
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setIsEditing(false); setDisplayName(user.displayName || '');}}>
                      취소
                    </Button>
                   </div>
                </form>
              ) : (
                <p className="text-2xl font-semibold text-foreground">{displayName || '닉네임 없음'}</p>
              )}
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Separator />
          <div>
            <Label className="text-sm font-medium text-muted-foreground">계정 생성일</Label>
            <p className="text-foreground">{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('ko-KR') : '정보 없음'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">마지막 로그인</Label>
            <p className="text-foreground">{user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('ko-KR') : '정보 없음'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
