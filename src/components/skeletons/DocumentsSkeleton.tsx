import { Skeleton } from "@/components/ui/skeleton";

const DocumentsSkeleton = () => (
  <div className="min-h-screen bg-background px-6 pt-5 pb-12 md:px-12 md:pt-1 md:pb-16 lg:px-20 lg:pt-2 xl:px-28 xl:pt-4">

    {/* Header */}
    <div className="max-w-6xl mb-6">
      <Skeleton className="h-8 w-56 mb-3" />
      <Skeleton className="h-4 w-full max-w-md mb-1.5" />
      <Skeleton className="h-4 w-72" />
    </div>

    <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">

      {/* Left: pending */}
      <div className="flex-1 min-w-0 space-y-8">
        {/* Progress */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-1 w-full rounded-full" />
        </div>

        {/* Pending label */}
        <div className="space-y-5">
          <Skeleton className="h-3 w-16" />

          {/* KYC Documents category */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-8 w-20 rounded-sm" />
            </div>
            {["w-20", "w-28", "w-16"].map((w, i) => (
              <div key={i} className={`py-2 ${i > 0 ? "border-t border-border/40" : ""}`}>
                <Skeleton className={`h-4 ${w}`} />
                {i === 1 && (
                  <div className="ml-4 mt-2 space-y-1.5">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Income & Financial category */}
          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-52" />
              <Skeleton className="h-8 w-20 rounded-sm" />
            </div>
            {["w-32", "w-28", "w-44", "w-36"].map((w, i) => (
              <div key={i} className={`py-2 ${i > 0 ? "border-t border-border/40" : ""}`}>
                <Skeleton className={`h-4 ${w}`} />
              </div>
            ))}
          </div>

          {/* Additional documents category */}
          <div className="space-y-3 mt-6">
            <Skeleton className="h-5 w-44" />
            {["w-36", "w-24", "w-40"].map((w, i) => (
              <div key={i} className={`py-2 flex items-center justify-between ${i > 0 ? "border-t border-border/40" : ""}`}>
                <Skeleton className={`h-4 ${w}`} />
                <Skeleton className="h-7 w-16 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: uploaded (desktop only) */}
      <div className="hidden lg:flex lg:w-80 xl:w-96 flex-col gap-6 lg:sticky lg:top-14 lg:self-start">
        <Skeleton className="h-3 w-20 mb-2" />
        <div className="border border-border rounded-lg px-5 py-4 space-y-4">
          <Skeleton className="h-4 w-32" />
          {["w-40", "w-36", "w-44"].map((w, i) => (
            <div key={i} className={`py-2 ${i > 0 ? "border-t border-border/40" : ""}`}>
              <Skeleton className={`h-4 ${w}`} />
              <Skeleton className="h-3 w-24 mt-1" />
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);

export default DocumentsSkeleton;
