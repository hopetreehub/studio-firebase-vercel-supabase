
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ShieldQuestion, AlertCircle, Loader2 } from "lucide-react";
import { listFirebaseUsers, changeUserRole, type AppUser } from '@/actions/userActions'; // Import changeUserRole
import { useToast } from '@/hooks/use-toast';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export function UserManagement() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [userToEditRole, setUserToEditRole] = useState<AppUser | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<string>('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    const result = await listFirebaseUsers(100); 
    if (result.error) {
      setError(result.error);
      toast({
        variant: 'destructive',
        title: '사용자 로딩 오류',
        description: result.error,
      });
    } else {
      setUsers(result.users);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenRoleDialog = (user: AppUser) => {
    setUserToEditRole(user);
    setSelectedNewRole(user.role || '사용자'); // Pre-fill with current role
  };

  const handleConfirmRoleChange = async () => {
    if (!userToEditRole || !selectedNewRole) return;

    setIsUpdatingRole(true);
    const result = await changeUserRole(userToEditRole.uid, selectedNewRole);
    setIsUpdatingRole(false);

    toast({
      title: result.success ? '역할 변경 요청 성공' : '역할 변경 요청 실패',
      description: result.message,
      duration: 7000,
    });

    if (result.success) {
      // Optimistically update UI or re-fetch users
      // For simulation, we can update the local state:
      setUsers(users.map(u => u.uid === userToEditRole.uid ? {...u, role: selectedNewRole} : u));
    }
    setUserToEditRole(null);
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Users className="mr-2 h-6 w-6" /> 사용자 관리
          </CardTitle>
          <CardDescription>
            애플리케이션 사용자를 불러오는 중입니다...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-destructive flex items-center">
            <AlertCircle className="mr-2 h-6 w-6" /> 오류 발생
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            사용자 정보를 불러오는 데 실패했습니다. Firebase Admin SDK 설정 및 권한을 확인해주세요.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Users className="mr-2 h-6 w-6" /> 사용자 관리
          </CardTitle>
          <CardDescription>
            Firebase Authentication에서 실제 사용자 목록을 표시합니다. 역할 변경 기능은 현재 시뮬레이션 상태입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>닉네임</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead>마지막 로그인</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">{user.displayName || <span className="text-muted-foreground">N/A</span>}</TableCell>
                    <TableCell>{user.email || <span className="text-muted-foreground">N/A</span>}</TableCell>
                    <TableCell>
                      <Badge variant={user.role?.toLowerCase() === 'admin' ? 'default' : 'secondary'}>
                        {user.role || '사용자'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.creationTime ? new Date(user.creationTime).toLocaleDateString('ko-KR') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {user.lastSignInTime ? new Date(user.lastSignInTime).toLocaleDateString('ko-KR') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleOpenRoleDialog(user)}
                        >
                          <ShieldQuestion className="mr-1 h-4 w-4" /> 역할 변경
                        </Button>
                      </AlertDialogTrigger>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">등록된 사용자가 없습니다.</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-4">
            참고: 실제 사용자 역할 변경 기능은 Firebase Custom Claims를 사용한 백엔드 구현(예: Firebase Functions)이 필요합니다. 현재는 시뮬레이션으로 작동하며, Custom Claim이 있다면 해당 값이 표시됩니다.
          </p>
        </CardContent>
      </Card>

      {userToEditRole && (
        <AlertDialog open={!!userToEditRole} onOpenChange={(open) => !open && setUserToEditRole(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>역할 변경: {userToEditRole.displayName || userToEditRole.email}</AlertDialogTitle>
              <AlertDialogDescription>
                사용자 '{userToEditRole.email}'의 역할을 변경합니다. 이 작업은 현재 시뮬레이션이며, 실제 적용을 위해서는 백엔드 설정이 필요합니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4 space-y-2">
              <Label htmlFor="role-select">새 역할 선택</Label>
              <Select value={selectedNewRole} onValueChange={setSelectedNewRole}>
                <SelectTrigger id="role-select">
                  <SelectValue placeholder="역할 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="사용자">사용자</SelectItem>
                  <SelectItem value="admin">관리자 (Admin)</SelectItem>
                  {/* Add other roles as needed */}
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setUserToEditRole(null)}>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmRoleChange} disabled={isUpdatingRole}>
                {isUpdatingRole && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUpdatingRole ? '변경 중...' : '변경 확인 (시뮬레이션)'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
