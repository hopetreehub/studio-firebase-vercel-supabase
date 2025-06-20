
'use client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { UserCircle, Edit3, KeyRound, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { 
  updateProfile as firebaseUpdateProfile, 
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword as firebaseUpdatePassword,
} from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';
import type { User } from 'firebase/auth';


export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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
    if (!firebaseAuth.currentUser) return;
    setIsUpdating(true);
    try {
      await firebaseUpdateProfile(firebaseAuth.currentUser, { displayName });
      toast({ title: '성공', description: '프로필이 업데이트되었습니다.' });
      setIsEditing(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: '오류', description: `프로필 업데이트 실패: ${error.message}` });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseAuth.currentUser || !user?.email) {
      toast({ variant: 'destructive', title: '오류', description: '사용자 정보를 찾을 수 없습니다.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ variant: 'destructive', title: '오류', description: '새 비밀번호가 일치하지 않습니다.' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ variant: 'destructive', title: '오류', description: '새 비밀번호는 6자 이상이어야 합니다.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(firebaseAuth.currentUser, credential);
      await firebaseUpdatePassword(firebaseAuth.currentUser, newPassword);
      toast({ title: '성공', description: '비밀번호가 성공적으로 변경되었습니다.' });
      setShowPasswordChangeForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      let errorMessage = '비밀번호 변경 중 오류가 발생했습니다.';
      if (error.code === 'auth/wrong-password') {
        errorMessage = '현재 비밀번호가 올바르지 않습니다.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = '너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = '새 비밀번호가 너무 약합니다. 더 강력한 비밀번호를 사용해주세요.';
      }
      toast({ variant: 'destructive', title: '비밀번호 변경 오류', description: errorMessage });
    } finally {
      setIsChangingPassword(false);
    }
  };


  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Spinner size="large" />
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <header className="text-center">
        <UserCircle className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">내 프로필</h1>
      </header>

      {/* 계정 정보 카드 */}
      <Card className="shadow-xl border-primary/10">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl text-primary">계정 정보</CardTitle>
            {!isEditing && !showPasswordChangeForm && (
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} aria-label="닉네임 수정">
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

      {/* 비밀번호 변경 카드 */}
      <Card className="shadow-xl border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <ShieldCheck className="mr-2 h-6 w-6 text-accent"/>비밀번호 변경
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showPasswordChangeForm ? (
            <Button onClick={() => setShowPasswordChangeForm(true)} disabled={isEditing}>
              비밀번호 변경하기
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="currentPassword" 
                    type={showCurrentPassword ? 'text' : 'password'} 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    required 
                    className="pl-10"
                  />
                  <Button
                    type="button" variant="ghost" size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label={showCurrentPassword ? "현재 비밀번호 숨기기" : "현재 비밀번호 보기"}
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="newPassword">새 비밀번호 (6자 이상)</Label>
                 <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="newPassword" 
                    type={showNewPassword ? 'text' : 'password'} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    className="pl-10"
                  />
                  <Button
                    type="button" variant="ghost" size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? "새 비밀번호 숨기기" : "새 비밀번호 보기"}
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirmNewPassword">새 비밀번호 확인</Label>
                 <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="confirmNewPassword" 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    value={confirmNewPassword} 
                    onChange={(e) => setConfirmNewPassword(e.target.value)} 
                    required 
                    className="pl-10"
                  />
                  <Button
                    type="button" variant="ghost" size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "새 비밀번호 확인 숨기기" : "새 비밀번호 확인 보기"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? <Spinner size="small" className="mr-2" /> : null}
                  비밀번호 저장
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowPasswordChangeForm(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                }}>
                  취소
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

    
