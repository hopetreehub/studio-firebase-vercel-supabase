
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export function UserManagement() {
  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <Users className="mr-2 h-6 w-6" /> 사용자 관리
        </CardTitle>
        <CardDescription>
          애플리케이션 사용자를 관리합니다. (향후 개발 예정)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">사용자 관리 기능은 현재 준비 중입니다.</p>
          <p className="text-sm text-muted-foreground mt-2">
            향후 이곳에서 사용자 목록 조회, 역할 변경, 계정 상태 관리 등의 기능을 제공할 예정입니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
