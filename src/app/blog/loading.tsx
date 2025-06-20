
import { Skeleton } from "@/components/ui/skeleton";
import { Feather } from 'lucide-react';

export default function BlogLoading() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <Feather className="mx-auto h-16 w-16 text-primary mb-4 animate-pulse" />
        <Skeleton className="h-10 w-3/4 sm:w-1/2 mx-auto mb-4" />
        <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" /> {/* Aspect ratio placeholder */}
            <div className="space-y-2 p-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-24 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
