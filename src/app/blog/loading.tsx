
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
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Blog Posts Skeleton Area */}
        <div className="w-full lg:w-2/3 space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col md:flex-row space-x-0 md:space-x-4 bg-card p-4 rounded-lg shadow-md">
              <Skeleton className="h-48 md:h-auto md:w-1/3 lg:w-2/5 rounded-lg aspect-video md:aspect-[4/3]" />
              <div className="md:w-2/3 lg:w-3/5 space-y-3 mt-4 md:mt-0">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-8 w-24 mt-2" />
              </div>
            </div>
          ))}
        </div>
        {/* Sidebar Skeleton Area */}
        <aside className="w-full lg:w-1/3 space-y-6">
          <Skeleton className="h-[150px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
        </aside>
      </div>
    </div>
  );
}
