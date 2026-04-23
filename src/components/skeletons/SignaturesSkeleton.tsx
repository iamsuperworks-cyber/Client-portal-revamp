import { Skeleton } from "@/components/ui/skeleton";

const bankGroups = [
  { nameW: "w-20", forms: ["w-40", "w-36", "w-44"] },
  { nameW: "w-12", forms: ["w-36", "w-48"] },
  { nameW: "w-24", forms: ["w-32"] },
];

const SignaturesSkeleton = () => (
  <div className="min-h-screen bg-background px-6 pt-5 pb-12 md:px-12 md:pt-1 md:pb-16 lg:px-20 lg:pt-2 xl:px-28 xl:pt-4">

    {/* Header */}
    <div className="max-w-6xl mb-6">
      <Skeleton className="h-8 w-52 mb-3" />
      <Skeleton className="h-4 w-full max-w-sm mb-1.5" />
      <Skeleton className="h-4 w-64" />
    </div>

    <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">

      {/* Left: tabs + content */}
      <div className="flex-1 min-w-0">
        {/* Tabs */}
        <div className="flex items-center gap-8 mb-6 border-b border-border pb-0">
          <div className="pb-2 border-b-2 border-primary">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="pb-2">
            <Skeleton className="h-4 w-14" />
          </div>
        </div>

        {/* Banks label */}
        <Skeleton className="h-3 w-12 mb-5" />

        {/* Bank groups */}
        <div className="space-y-5">
          {bankGroups.map((group, gi) => (
            <div
              key={gi}
              className="px-4 py-3 -mx-4 rounded-sm"
              style={{ backgroundColor: gi % 2 === 0 ? "#FFFFFF" : "#F7F6F4" }}
            >
              {/* Bank header row */}
              <div className="flex items-center justify-between mb-3">
                <Skeleton className={`h-5 ${group.nameW}`} />
                <Skeleton className="h-8 w-20 rounded-sm" />
              </div>
              {/* Forms */}
              <div>
                {group.forms.map((fw, fi) => (
                  <div key={fi} className={`py-3 ${fi < group.forms.length - 1 ? "border-b border-border/40" : ""}`}>
                    <Skeleton className={`h-4 ${fw} mb-1.5`} />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel (desktop only) */}
      <div className="hidden lg:flex lg:w-80 xl:w-96 flex-col gap-6 lg:sticky lg:top-14 lg:self-start">
        <div className="border border-border rounded-lg px-6 py-5 space-y-4">
          <Skeleton className="h-4 w-36 mb-2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>

    </div>
  </div>
);

export default SignaturesSkeleton;
