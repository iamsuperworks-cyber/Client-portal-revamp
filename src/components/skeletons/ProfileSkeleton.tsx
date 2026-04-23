import { Skeleton } from "@/components/ui/skeleton";

const FieldRow = ({ label = "w-24" }: { label?: string }) => (
  <div className="space-y-1.5">
    <Skeleton className={`h-3 ${label}`} />
    <Skeleton className="h-9 w-full max-w-xs rounded-sm" />
  </div>
);

const FieldRowWide = ({ label = "w-24" }: { label?: string }) => (
  <div className="space-y-1.5">
    <Skeleton className={`h-3 ${label}`} />
    <Skeleton className="h-9 w-full max-w-sm rounded-sm" />
  </div>
);

const RadioRow = ({ label = "w-32" }: { label?: string }) => (
  <div className="space-y-2">
    <Skeleton className={`h-3 ${label}`} />
    <div className="flex gap-4">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

const SectionLabel = ({ width = "w-24" }: { width?: string }) => (
  <Skeleton className={`h-3 ${width} mb-5`} />
);

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-background px-6 pt-5 pb-12 md:px-12 md:pt-1 md:pb-16 lg:px-20 lg:pt-2 xl:px-28 xl:pt-4 overflow-x-hidden">

    {/* Page title */}
    <div className="max-w-6xl mb-6 md:mb-8">
      <Skeleton className="h-8 w-36 mb-3" />
      <Skeleton className="h-4 w-72" />
    </div>

    <div className="max-w-6xl space-y-8 md:space-y-12">

      {/* About You */}
      <section>
        <SectionLabel width="w-20" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <FieldRow label="w-20" />
          <FieldRow label="w-24" />
          <div className="md:col-span-2"><RadioRow label="w-28" /></div>
          <FieldRow label="w-28" />
          <FieldRow label="w-20" />
          <FieldRow label="w-36" />
        </div>
      </section>

      {/* Your Property */}
      <section>
        <SectionLabel width="w-28" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <RadioRow label="w-24" />
          <RadioRow label="w-32" />
          <RadioRow label="w-24" />
          <RadioRow label="w-32" />
          <FieldRow label="w-32" />
          <FieldRow label="w-28" />
          <div className="md:col-span-2"><FieldRowWide label="w-32" /></div>
        </div>
      </section>

      {/* Financial Details */}
      <section>
        <SectionLabel width="w-36" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <div className="md:col-span-2"><RadioRow label="w-40" /></div>
          <FieldRow label="w-48" />
          <FieldRow label="w-40" />
          {/* Additional income toggle row */}
          <div className="md:col-span-2 flex items-center justify-between py-1">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-5 w-9 rounded-full shrink-0" />
          </div>
        </div>
      </section>

      {/* Data & Privacy */}
      <div className="border-t-2 border-border pt-8 md:pt-12">
        <section>
          <SectionLabel width="w-28" />
          <Skeleton className="h-16 w-full max-w-lg rounded-sm mb-6" />
          <div className="mb-6">
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-3 w-52 mb-3" />
            <div className="border border-border rounded-sm px-4 py-3 flex items-center gap-3 max-w-lg">
              <Skeleton className="h-9 w-16 rounded-sm shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
              <div className="flex gap-2 shrink-0">
                <Skeleton className="h-8 w-14 rounded-sm" />
                <Skeleton className="h-8 w-16 rounded-sm" />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <Skeleton className="h-4 w-32 mb-3" />
            <div className="border-t border-border/50 pt-4 flex items-center justify-between max-w-lg">
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          </div>
        </section>
      </div>

    </div>
  </div>
);

export default ProfileSkeleton;
