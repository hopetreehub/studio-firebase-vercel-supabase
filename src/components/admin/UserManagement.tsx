
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Edit } from "lucide-react";

// Mock data for demonstration
const mockUsers = [
  { id: 'user1', name: '앨리스', email: 'alice@example.com', role: 'admin' as 'admin' | 'user', joinedDate: '2023-01-15' },
  { id: 'user2', name: '밥', email: 'bob@example.com', role: 'user' as 'admin' | 'user', joinedDate: '2023-02-20' },
  { id: 'user3', name: '찰리', email: 'charlie@example.com', role: 'user' as 'admin' | 'user', joinedDate: '2023-03-10' },
  { id: 'user4', name: '다이애나', email: 'diana@example.com', role: 'user' as 'admin' | 'user', joinedDate: '2024-01-05' },
];

export function UserManagement() {

  const handleChangeRole = (userId: string, newRole: string) => {
    // In a real app, this would call an API to update the user's role.
    // For this prototype, we'll just log it and show a toast (from the parent component if needed).
    console.log(`Simulating role change for user ${userId} to ${newRole}.`);
    // Here you might want to use `toast()` if it's passed or available via context.
  };

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <Users className="mr-2 h-6 w-6" /> 사용자 관리
        </CardTitle>
        <CardDescription>
          애플리케이션 사용자를 확인하고 역할을 관리합니다. (현재 목업 데이터 사용)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mockUsers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? '관리자' : '사용자'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.joinedDate).toLocaleDateString('ko-KR')}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleChangeRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                      title={user.role === 'admin' ? '사용자로 변경 (준비 중)' : '관리자로 변경 (준비 중)'}
                      disabled // For now, disable direct role change from UI for prototype simplicity
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-muted-foreground">표시할 사용자가 없습니다.</p>
          </div>
        )}
         <p className="text-xs text-muted-foreground mt-4">
            참고: 사용자 역할 변경 기능은 현재 시뮬레이션이며, 실제 데이터베이스 연동이 필요합니다.
          </p>
      </CardContent>
    </Card>
  );
}
