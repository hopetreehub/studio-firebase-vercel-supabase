
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Server, Database, BrainCircuit, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const systemStatuses = [
  { name: "애플리케이션 서버", status: "Online", icon: <Server className="h-5 w-5" />, variant: "default" as const },
  { name: "데이터베이스 연결", status: "Connected", icon: <Database className="h-5 w-5" />, variant: "default" as const },
  { name: "AI 생성 서비스 (Genkit)", status: "Operational", icon: <BrainCircuit className="h-5 w-5" />, variant: "default" as const },
  { name: "최근 백업 상태", status: "Success (2시간 전)", icon: <CheckCircle className="h-5 w-5" />, variant: "default" as const },
  { name: "보안 경고", status: "없음", icon: <Info className="h-5 w-5" />, variant: "secondary" as const },
];


export function SystemManagement() {
  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <ShieldCheck className="mr-2 h-6 w-6" /> 시스템 관리
        </CardTitle>
        <CardDescription>
          애플리케이션의 주요 시스템 상태를 확인합니다. (현재 목업 데이터 사용)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-foreground/90">시스템 상태 개요</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemStatuses.map((item) => (
              <Card key={item.name} className="p-4 bg-card/70 border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={item.status === "Online" || item.status === "Connected" || item.status.startsWith("Success") || item.status === "Operational" || item.status === "없음" ? "text-green-500" : "text-yellow-500"}>
                       {item.icon}
                    </span>
                    <p className="text-sm font-medium text-foreground/80">{item.name}</p>
                  </div>
                  <Badge variant={item.variant} className={
                     item.status === "Online" || item.status === "Connected" || item.status.startsWith("Success") || item.status === "Operational" || item.status === "없음" ? "bg-green-500/10 text-green-700 border-green-500/30" : "bg-yellow-500/10 text-yellow-700 border-yellow-500/30"
                  }>
                    {item.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
           <h3 className="text-lg font-semibold mb-2 text-foreground/90">시스템 로그 (예시)</h3>
           <div className="bg-muted/50 p-3 rounded-md max-h-48 overflow-y-auto text-xs font-mono text-foreground/70">
            <p>[{new Date(Date.now() - 3600000).toLocaleString('ko-KR')}] INFO: Application server started successfully on port 3000.</p>
            <p>[{new Date(Date.now() - 3540000).toLocaleString('ko-KR')}] INFO: Database connection established.</p>
            <p>[{new Date(Date.now() - 1800000).toLocaleString('ko-KR')}] INFO: User 'alice@example.com' logged in.</p>
            <p>[{new Date(Date.now() - 1200000).toLocaleString('ko-KR')}] AI_GEN: Tarot interpretation requested by user 'bob@example.com'.</p>
            <p>[{new Date(Date.now() - 1195000).toLocaleString('ko-KR')}] AI_GEN: Tarot interpretation generated successfully.</p>
            <p>[{new Date(Date.now() - 600000).toLocaleString('ko-KR')}] ADMIN: AI prompt configuration updated by 'alice@example.com'.</p>
            <p>[{new Date().toLocaleString('ko-KR')}] SYSTEM: Health check OK.</p>
           </div>
        </div>
         <p className="text-xs text-muted-foreground mt-4">
            참고: 시스템 관리 기능은 현재 시뮬레이션이며, 실제 모니터링 및 로깅 시스템 연동이 필요합니다.
        </p>
      </CardContent>
    </Card>
  );
}
