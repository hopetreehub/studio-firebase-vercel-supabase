
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export function SystemManagement() {
  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <ShieldCheck className="mr-2 h-6 w-6" /> 시스템 관리
        </CardTitle>
        <CardDescription>
          애플리케이션의 주요 시스템 설정을 관리합니다. (향후 개발 예정)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">시스템 관리 기능은 현재 준비 중입니다.</p>
          <p className="text-sm text-muted-foreground mt-2">
            향후 이곳에서 애플리케이션 로그 확인, 백업 및 복원, 주요 기능 활성화/비활성화 등의 기능을 제공할 예정입니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
