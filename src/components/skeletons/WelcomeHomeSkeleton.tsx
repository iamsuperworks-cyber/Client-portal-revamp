import { Skeleton } from "@/components/ui/skeleton";

const WelcomeHomeSkeleton = () => (
  <div className="min-h-screen bg-background px-6 pt-5 pb-12 md:px-12 md:pt-1 md:pb-16 lg:px-20 lg:pt-2 xl:px-28 xl:pt-4">
    <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">

      {/* Left */}
      <div className="flex-1 min-w-0">
        {/* Heading row */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-6 w-32 hidden md:block" />
        </div>

        {/* Action banner */}
        <Skeleton className="h-24 w-full rounded-lg mb-4" />

        {/* Bank list section */}
        <div className="mt-6">
          <Skeleton className="h-3 w-24 mb-4" />
          <div className="space-y-0">
            {[120, 90, 110, 80].map((w, i) => (
              <div key={i} className={`flex items-center justify-between py-4 ${i > 0 ? "border-t border-border/50" : ""}`}>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 w-full">
                  <Skeleton className={`h-6 w-${w === 120 ? "28" : w === 90 ? "16" : w === 110 ? "24" : "20"}`} />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right (desktop only) */}
      <div className="hidden lg:flex lg:w-80 xl:w-96 flex-col gap-6 lg:sticky lg:top-14 lg:self-start">
        {/* Application details card */}
        <div className="border border-border rounded-lg px-6 py-5 space-y-4">
          <Skeleton className="h-3 w-32 mb-2" />
          {[["w-12", "w-36"], ["w-20", "w-28"], ["w-16", "w-24"]].map(([a, b], i) => (
            <div key={i} className="space-y-1">
              <Skeleton className={`h-3 ${a}`} />
              <Skeleton className={`h-4 ${b}`} />
            </div>
          ))}
        </div>
        {/* Support */}
        <div className="border-t border-border pt-6 space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>

    </div>
  </div>
);

export default WelcomeHomeSkeleton;
