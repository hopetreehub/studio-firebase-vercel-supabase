
'use client'; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <AlertCircle className="w-24 h-24 text-destructive mb-8" />
      <h1 className="text-4xl font-bold text-primary mb-4 font-headline">이런! 오류가 발생했습니다</h1>
      <p className="text-lg text-foreground/80 mb-6 max-w-md">
        예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        오류 코드: {error.digest || '알 수 없음'}
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          size="lg"
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
        >
          다시 시도
        </Button>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <a href="/">홈으로 돌아가기</a>
        </Button>
      </div>
    </div>
  );
}
