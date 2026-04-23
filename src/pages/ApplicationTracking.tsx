import React from "react";
import { ArrowLeft, Check, MessageSquare, ChevronDown, Phone, Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueries } from "@/contexts/QueriesContext";
import { formatDistanceToNow, isToday, isYesterday, format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type StageStatus = "completed" | "current" | "upcoming";

interface Substage {
  name: string;
  date?: string;
}

interface Stage {
  name: string;
  status: StageStatus;
  whatsHappening: string;
  substages: Substage[];
  date?: string;
  startDate?: string;
}

const stages: Stage[] = [
  { 
    name: "Submitted to Bank", 
    status: "completed", 
    date: "20 Apr 2024",
    whatsHappening: "Initial application is forwarded to the bank. Bank credit officer reviews the case, may raise queries, and coordination happens between MS and the bank for clarification/resolution.",
    substages: [
      { name: "Draft", date: "12 Apr 2024" },
      { name: "Submitted to Bank", date: "14 Apr 2024" },
      { name: "Under Review", date: "15 Apr 2024" },
      { name: "Sales Queries", date: "17 Apr 2024" },
      { name: "Submitted to Credit", date: "18 Apr 2024" },
      { name: "Credit Queries", date: "20 Apr 2024" }
    ]
  },
  { 
    name: "Pre-Approval", 
    status: "current", 
    startDate: new Date().toISOString(),
    whatsHappening: "Issued once the bank is satisfied with credit assessment and query resolution.",
    substages: [
      { name: "Pre-Approved" }
    ]
  },
  { 
    name: "Valuation", 
    status: "upcoming", 
    whatsHappening: "Property assessment is initiated, and the client pays valuation fees.",
    substages: [
      { name: "Valuation" }
    ]
  },
  { 
    name: "FOL (Final Offer Letter)", 
    status: "upcoming", 
    whatsHappening: "Final loan terms are issued after valuation report approval and all pending conditions are cleared.",
    substages: [
      { name: "FOL" }
    ]
  },
  { 
    name: "FOL Signing", 
    status: "upcoming", 
    whatsHappening: "Client visits the bank directly to sign the required loan documents.", 
    substages: [
      { name: "FOL Signed" },
      { name: "Final Documents" }
    ]
  },
  { 
    name: "Disbursement / Transfer", 
    status: "upcoming", 
    whatsHappening: "Final stage where property registration is completed and loan funds are released.",
    substages: [
      { name: "Approved" },
      { name: "Disbursed" },
      { name: "Property Transferred" }
    ]
  },
];

const ApplicationTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bankName = (location.state as { bankName?: string })?.bankName ?? "Bank";
  const currentIndex = stages.findIndex((s) => s.status === "current");
  const { queries } = useQueries();

  const formatSinceDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "d MMM yyyy");
  };

  const bankQueries = queries.filter(q => q.bankName === bankName);
  const activeQuery = bankQueries.find(q => q.status === "awaiting_client" || q.status === "overdue");
  const resolvedQueries = bankQueries.filter(q => q.status === "resolved");
  const awaitingBank = bankQueries.find(q => q.status === "awaiting_bank");

  const latestResolved = resolvedQueries.length > 0 
    ? resolvedQueries.sort((a, b) => b.messages[b.messages.length - 1].timestamp.localeCompare(a.messages[a.messages.length - 1].timestamp))[0]
    : null;

  const renderQueriesCard = () => {
    // STATE A: Active query exists
    if (activeQuery) {
      const diffMs = activeQuery.slaDeadline.getTime() - new Date().getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      const remHours = diffHours % 24;
      const slaText = diffMs < 0 
        ? `Overdue by ${Math.abs(diffHours)}h` 
        : `Respond in ${diffDays > 0 ? `${diffDays}d ` : ""}${remHours}h`;

      return (
        <div className="bg-card border-[1.5px] border-primary rounded-lg px-6 py-5 shadow-sm">
          <p className="font-heading text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
            QUERIES FROM {bankName.toUpperCase()}
          </p>
          <div className="flex items-start gap-3 mb-5">
            <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
            <div className="min-w-0">
              <p className="font-body text-[13px] font-medium text-foreground leading-tight truncate">
                {activeQuery.title}
              </p>
              <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                {slaText}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/queries/${activeQuery.id}`)}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-sm font-body text-sm font-semibold hover:opacity-90 transition-opacity mb-3"
          >
            Respond to query →
          </button>
        </div>
      );
    }

    // STATE B: Past queries only OR awaiting bank
    if (resolvedQueries.length > 0 || awaitingBank) {
      const showQuery = awaitingBank || latestResolved;
      if (!showQuery) return null;

      const isAwaiting = showQuery.status === "awaiting_bank";
      const lastMsg = showQuery.messages[showQuery.messages.length - 1];

      return (
        <div className="bg-card border border-border rounded-lg px-6 py-5">
          <p className="font-heading text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
            QUERIES FROM {bankName.toUpperCase()}
          </p>
          <div className="flex items-start gap-3 mb-5">
            <div className="h-2 w-2 rounded-full bg-muted mt-1.5 shrink-0" />
            <div className="min-w-0">
              <p className="font-body text-[13px] font-medium text-foreground leading-tight">
                {resolvedQueries.length} past query{resolvedQueries.length > 1 ? "ies" : ""}
              </p>
              <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                {isAwaiting ? "Awaiting bank response" : `Most recent: ${formatDistanceToNow(new Date(lastMsg.timestamp), { addSuffix: true })}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/queries/${showQuery.id}`)}
            className="w-full bg-background border border-border text-foreground py-2.5 rounded-sm font-body text-sm font-semibold hover:bg-muted/50 transition-colors"
          >
            View past queries →
          </button>
        </div>
      );
    }

    // STATE C: No queries
    return null;
  };

  return (
    <div className="min-h-screen bg-background px-6 pt-0 pb-12 md:px-12 md:pt-1 md:pb-16 lg:px-20 lg:pt-2 xl:px-28 xl:pt-4">
      {/* Back button */}
      <div className="max-w-6xl mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mb-3">
        <nav className="flex items-center gap-1.5 font-body text-xs">
          <span className="text-muted-foreground">Applications</span>
          <span className="text-muted-foreground">›</span>
          <span className="text-foreground/70 font-medium">{bankName}</span>
        </nav>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
        {/* Left: Timeline checklist */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-2">
              My Application
            </h1>
            <p className="font-body text-muted-foreground text-sm leading-relaxed max-w-xl">
              Track the progress of your mortgage application across every stage.
            </p>
          </div>

          <Accordion 
            type="multiple" 
            defaultValue={[`item-${currentIndex}`]}
            className="relative pt-2"
          >
            {stages.map((stage, i) => {
              const isCompleted = stage.status === "completed";
              const isCurrent = stage.status === "current";
              const isUpcoming = stage.status === "upcoming";
              const isFirst = i === 0;
              const isLast = i === stages.length - 1;

              return (
                <div key={i} className="relative flex items-stretch gap-4 group mb-6 last:mb-0">
                  {/* Trail Column (Icon & Progress Line) */}
                  <div className="shrink-0 flex flex-col items-center relative w-12 text-center h-auto">
                    {/* Background Line (Continuous Pipe) */}
                    {/* Top segment: from top to center (not for first) */}
                    {!isFirst && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-[28px] bg-muted/20 z-0" />
                    )}
                    {/* Bottom segment: from center to bottom (always, except last center-to-bottom is handled) */}
                    {!isLast ? (
                      <div className="absolute top-[28px] left-1/2 -translate-x-1/2 w-1 h-[calc(100%+1.5rem)] bg-muted/20 z-0" />
                    ) : null}

                    {/* Progress Fill Line (Active Segment) */}
                    {/* Upper part fill (Solid for completed and current stages) */}
                    {!isFirst && (isCompleted || isCurrent) && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-[28px] bg-primary z-10" />
                    )}

                    {/* Lower part fill (Solid for completed, Fading for current) */}
                    {!isLast && (
                      <>
                        {isCompleted && (
                          <div className="absolute top-[28px] left-1/2 -translate-x-1/2 w-1 h-[calc(100%+1.5rem)] bg-primary z-10" />
                        )}
                        {isCurrent && (
                          <div className="absolute top-[28px] left-1/2 -translate-x-1/2 w-1 h-[calc(100%+1.5rem)] bg-gradient-to-b from-primary to-transparent z-10" />
                        )}
                      </>
                    )}

                    {/* The Icon Node */}
                    <div className="absolute top-[28px] -translate-y-1/2 z-20">
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-full h-8 w-8 transition-all duration-500 border-4 border-background",
                          isCompleted 
                            ? "bg-primary text-primary-foreground shadow-md scale-100"
                            : isCurrent
                              ? "bg-primary text-primary-foreground ring-6 ring-primary/10 shadow-lg scale-110"
                              : "bg-muted text-muted-foreground/50 border-muted/20 scale-90"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4" strokeWidth={3} />
                        ) : isCurrent ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground animate-pulse" />
                        ) : (
                          <span className="text-[10px] font-bold">{i + 1}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <AccordionItem 
                    value={`item-${i}`}
                    className={cn(
                      "flex-1 rounded-md border transition-all duration-200 shadow-sm",
                      isCurrent 
                        ? "bg-white border-primary shadow-lg ring-1 ring-primary/5 -translate-y-0.5" 
                        : isCompleted
                          ? "bg-white border-border opacity-95 group-hover:opacity-100"
                          : "bg-gray-50/50 border-dashed border-border/60"
                    )}
                    style={{ borderBottomWidth: '1px' }} /* Force override shadcn default border-b behavior if needed, or just handle it via classes */
                  >
                    <AccordionTrigger className="hover:no-underline px-5 py-4 w-full text-left">
                      <div className="flex-1 pr-2">
                        <div className="flex items-center justify-between gap-4 mb-0.5">
                          <h3
                            className={cn(
                              "font-heading text-base font-bold tracking-tight",
                              isUpcoming ? "text-muted-foreground/80" : "text-foreground"
                            )}
                          >
                            {stage.name}
                          </h3>
                          {isCurrent && (
                            <span className="shrink-0 font-heading text-[9px] font-black uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5 rounded-full shadow-sm shadow-primary/20">
                              In Progress {stage.startDate ? `· Since ${formatSinceDate(stage.startDate)}` : ""}
                            </span>
                          )}
                          {isCompleted && stage.date && (
                            <span className="shrink-0 font-body text-[11px] font-medium text-muted-foreground uppercase tracking-tight">
                              {stage.date}
                            </span>
                          )}
                        </div>
                        <p 
                          className={cn(
                            "font-body text-[13px] font-light leading-snug max-w-xl",
                            isUpcoming ? "text-muted-foreground/50" : "text-muted-foreground/80"
                          )}
                        >
                          {stage.whatsHappening}
                        </p>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-5 pb-5 pt-2 border-t border-muted/50">
                      <div className="relative pl-1">
                        {/* Continuous sub-trail background pipe */}
                        {stage.substages.length > 1 && (
                          <div className="absolute left-[11px] top-4 bottom-4 w-[1.5px] bg-muted/20 z-0" />
                        )}
                        
                        {stage.substages.map((sub, subI) => {
                          // Logic for substage status
                          let subStatus: StageStatus = "upcoming";
                          if (isCompleted) {
                            subStatus = "completed";
                          } else if (isCurrent) {
                            // Stage is current, find the first substage without a completion date
                            const firstIncompleteIdx = stage.substages.findIndex(s => !s.date);
                            
                            if (sub.date) {
                              subStatus = "completed";
                            } else if (subI === firstIncompleteIdx) {
                              subStatus = "current";
                            } else if (firstIncompleteIdx !== -1 && subI < firstIncompleteIdx) {
                              subStatus = "completed";
                            } else {
                              subStatus = "upcoming";
                            }
                          }

                          const isSubLast = subI === stage.substages.length - 1;
                          
                          return (
                            <div key={subI} className="relative flex items-center gap-4 group/sub h-9">
                              {/* Sub Trail Node & Segment */}
                              <div className="shrink-0 flex items-center justify-center relative w-6 h-full font-body">
                                {/* Sub-trail active fill segment */}
                                {!isSubLast && (subStatus === "completed" || subStatus === "current") && (
                                  <div className={cn(
                                    "absolute top-1/2 left-1/2 -translate-x-1/2 w-[1.5px] h-full z-10",
                                    subStatus === "completed" ? "bg-primary" : "bg-gradient-to-b from-primary to-transparent"
                                  )} />
                                )}

                                {/* Dot Node */}
                                <div className="z-20">
                                  <div className={cn(
                                    "h-2 w-2 rounded-full",
                                    subStatus === "completed" 
                                      ? "bg-primary" 
                                      : subStatus === "current"
                                        ? "bg-primary animate-pulse"
                                        : "bg-muted-foreground/20"
                                  )} />
                                </div>
                              </div>
                              
                              <div className="flex-1 flex items-center justify-between gap-4 pr-6">
                                <p className={cn(
                                  "font-body text-[13px] transition-colors leading-none",
                                  subStatus === "upcoming" ? "text-muted-foreground/50" : "text-muted-foreground/80",
                                  subStatus === "current" && "text-primary font-medium"
                                )}>
                                  {sub.name}
                                </p>
                                {sub.date && (
                                  <span className="font-body text-[11px] font-medium text-muted-foreground/40 uppercase tracking-tight">
                                    {sub.date}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </div>
              );
            })}
          </Accordion>
        </div>

        {/* Right: Context panel */}
        <div className="lg:w-80 xl:w-96 mt-10 lg:mt-0 flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          {renderQueriesCard()}
          
          {/* Support */}
          <div className="border-t border-border pt-6">
            <p className="font-body text-muted-foreground text-sm leading-relaxed mb-3">
              Need help? Contact your mortgage specialist.
            </p>
            <div className="space-y-1.5 text-sm">
              <a
                href="tel:+971501234567"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                +971 50 123 4567
              </a>
              <a
                href="mailto:support@rivo.ae"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                support@rivo.ae
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTracking;
