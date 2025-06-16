
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Edit, AlertCircle, Loader2 } from "lucide-react";
import { listFirebaseUsers, type AppUser } from '@/actions/userActions'; // Updated import
import { useToast } from '@/hooks/use-toast';

export function UserManagement() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      const result = await listFirebaseUsers(100); // Fetch up to 100 users
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
    fetchUsers();
  }, [toast]);

  const handleSimulateChangeRole = (userId: string, currentEmail?: string) => {
    // In a real app, this would call an API to update the user's role using custom claims.
    // For this prototype, we'll just log it and show a toast.
    console.log(`Simulating role change for user ${userId} (${currentEmail || 'N/A'}). This feature requires backend implementation with custom claims.`);
    toast({
      title: '역할 변경 (시뮬레이션)',
      description: `사용자 ${currentEmail || userId}의 역할 변경은 현재 지원되지 않습니다. 백엔드 구현이 필요합니다.`,
      duration: 5000,
    });
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
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <Users className="mr-2 h-6 w-6" /> 사용자 관리
        </CardTitle>
        <CardDescription>
          Firebase Authentication에서 실제 사용자 목록을 표시합니다. 역할 변경 기능은 현재 비활성화되어 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>닉네임</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>UID</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead>마지막 로그인</TableHead>
                <TableHead className="text-right">역할 (임시)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">{user.displayName || <span className="text-muted-foreground">N/A</span>}</TableCell>
                  <TableCell>{user.email || <span className="text-muted-foreground">N/A</span>}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{user.uid}</TableCell>
                  <TableCell>
                    {user.creationTime ? new Date(user.creationTime).toLocaleDateString('ko-KR') : 'N/A'}
                  </TableCell>
                   <TableCell>
                    {user.lastSignInTime ? new Date(user.lastSignInTime).toLocaleDateString('ko-KR') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Firebase Auth에는 기본 'role' 필드가 없습니다. Custom Claims로 구현 필요. */}
                    <Badge variant={"secondary"}>사용자</Badge> 
                    {/* <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleSimulateChangeRole(user.uid, user.email)}
                      title={'역할 변경 (준비 중)'}
                      disabled 
                    >
                      <Edit className="h-4 w-4" />
                    </Button> */}
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
            참고: 사용자 역할 변경 기능은 Firebase Custom Claims를 사용한 백엔드 구현이 필요합니다. 현재는 모든 사용자가 '사용자'로 표시됩니다.
          </p>
      </CardContent>
    </Card>
  );
}

    