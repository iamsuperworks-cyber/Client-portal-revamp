import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MessageSquare, Building2, Paperclip, Send, CheckCircle2, Info, X, ArrowRight } from "lucide-react";
import { useQueries, Query, Message, Attachment } from "@/contexts/QueriesContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";

const QueryDetail = () => {
  const { queryId } = useParams();
  const navigate = useNavigate();
  const { getQuery, respondToQuery } = useQueries();
  const query = getQuery(queryId || "");
  const [responseText, setResponseText] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([]);
  const [isSent, setIsSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isAwaitingClient = query?.status === "awaiting_client" || query?.status === "overdue";
  const isResolved = query?.status === "resolved";

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200); // Limit max height
      textarea.style.height = `${newHeight}px`;
      
      // Scroll to bottom if growing
      if (isAwaitingClient && !isSent) {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [responseText, isAwaitingClient, isSent]);

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h2 className="font-heading text-xl font-semibold mb-2">Query not found</h2>
        <p className="font-body text-muted-foreground mb-6">The query you are looking for does not exist or has been moved.</p>
        <button 
          onClick={() => navigate("/")}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-sm font-body font-medium hover:bg-primary/90 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleSend = () => {
    if (responseText.trim() || attachedFiles.length > 0) {
      respondToQuery(
        query.id, 
        responseText, 
        attachedFiles.map(f => ({ id: Math.random().toString(36).substr(2, 9), name: f.name, size: f.size }))
      );
      setResponseText("");
      setAttachedFiles([]);
      setIsSent(true);
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(f => ({
        name: f.name,
        size: f.size > 1024 * 1024 
          ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${(f.size / 1024).toFixed(0)} KB`
      }));
      setAttachedFiles(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 48) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return format(date, "d MMM, h:mm a");
  };

  const renderSLAPill = () => {
    if (isSent) return null;
    if (isResolved) {
      const lastMsg = query.messages[query.messages.length - 1];
      return (
        <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-primary/20">
          Resolved {formatDistanceToNow(new Date(lastMsg.timestamp), { addSuffix: true })}
        </span>
      );
    }

    if (query.status === "awaiting_bank") {
      return null;
    }

    const now = new Date();
    const diffMs = query.slaDeadline.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remHours = diffHours % 24;

    if (diffMs < 0) {
      return (
        <span className="bg-destructive/10 text-destructive text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-destructive/20">
          Overdue by {Math.abs(diffHours)}h
        </span>
      );
    }

    const isStrongAmber = diffHours < 24;
    return (
      <span className={cn(
        "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
        isStrongAmber 
          ? "bg-amber-100 text-amber-900 border-amber-900/20" 
          : "bg-amber-50 text-amber-800 border-amber-800/10"
      )}>
        Respond in {diffDays > 0 ? `${diffDays}d ` : ""}{remHours}h
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background px-6 pt-5 pb-12 md:px-12 md:pt-1 md:pb-16 lg:px-20 lg:pt-2 xl:px-28 xl:pt-4">
      {/* Back Button */}
      <div className="max-w-6xl mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-8">
            Query from {query.bankName}
          </h1>

          {/* Instructions Card */}
          <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6 flex gap-3 items-start">
            <div className="h-5 w-5 rounded-full bg-foreground flex items-center justify-center shrink-0 mt-0.5">
              <Info className="h-3 w-3 text-primary" />
            </div>
            <div className="font-body text-[13px] text-foreground leading-relaxed">
              <span className="font-bold text-sm">What to do:</span> {query.bankName} has a question about your application. Reply below with text, a document, or both.
            </div>
          </div>

          {/* Chat Window Container */}
          <div className="bg-white border border-border shadow-sm rounded-lg overflow-hidden mb-10 flex flex-col">
            {/* Header / Context Strip */}
            <div className="bg-secondary/40 border-b border-border px-4 py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-body text-muted-foreground min-w-0">
                <div className="h-6 w-6 rounded-full bg-surface-elevated flex items-center justify-center text-[10px] font-bold text-foreground border border-border shrink-0">
                  {query.bankName.charAt(0)}
                </div>
                <span className="font-medium text-foreground">{query.bankName}</span>
                <span className="opacity-50">•</span>
                <span>{query.stage} stage</span>
                {query.relatedTo && (
                  <>
                    <span className="opacity-50">•</span>
                    <span className="truncate">Related to: {query.relatedTo}</span>
                  </>
                )}
              </div>
              <div className="shrink-0">
                {renderSLAPill()}
              </div>
            </div>

            {/* Thread Area (Body) */}
            <div className="p-4 md:p-5 flex flex-col gap-4">
              {query.messages.map((msg) => {
                const isBank = msg.sender === "bank";
                return (
                  <div key={msg.id} className={cn("flex flex-col max-w-full", isBank ? "items-start" : "items-end")}>
                    <span className="font-body text-[11px] text-muted-foreground mb-1 px-1">
                      {msg.senderName} · {formatTimestamp(msg.timestamp)}
                    </span>
                    <div className={cn(
                      "max-w-[85%] p-3 md:p-4 rounded-lg font-body text-sm leading-relaxed",
                      isBank 
                        ? "bg-secondary text-foreground rounded-bl-none" 
                        : "bg-primary text-primary-foreground rounded-br-none border border-primary/10"
                    )}>
                      {msg.text}
                      
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {msg.attachments.map((file) => (
                            <div key={file.id} className="flex items-center gap-2 bg-white/50 border border-black/5 rounded px-2 py-1 text-[11px] font-medium">
                              <Paperclip className="h-3 w-3" />
                              <span>{file.name}</span>
                              {file.size && <span className="opacity-50 font-normal">({file.size})</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Response Section (Footer) */}
            {!isResolved && !isSent && isAwaitingClient && (
              <div className="border-t border-border bg-secondary/5 p-3 md:p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className={cn(
                  "bg-white border rounded-lg overflow-hidden transition-all duration-200 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary",
                  "border-border shadow-sm mb-2"
                )}>
                  <textarea
                    ref={textareaRef}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response..."
                    className="w-full min-h-[44px] p-3 font-body text-sm bg-transparent border-none focus:outline-none resize-none overflow-hidden"
                    rows={1}
                  />
                  
                  {attachedFiles.length > 0 && (
                    <div className="px-3 pb-2 flex flex-wrap gap-2">
                      {attachedFiles.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 bg-secondary rounded px-2 py-1 text-xs font-medium">
                          <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{file.name}</span>
                          <button 
                            onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                            className="hover:text-destructive transition-colors ml-1"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-border p-2.5 flex items-center justify-between">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileAttach}
                      multiple 
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm font-body text-xs font-medium hover:bg-muted/50 transition-colors"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      Attach file
                    </button>
                    <button 
                      onClick={handleSend}
                      disabled={!responseText.trim() && attachedFiles.length === 0}
                      className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-sm font-body text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      Send response
                      <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Inside Chat Window */}
            {isSent && (
              <div className="border-t border-border bg-primary/5 p-4 flex items-center justify-between gap-4 animate-in zoom-in-95 duration-300">
                <div className="flex gap-3 items-start">
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <p className="font-body text-xs text-foreground leading-relaxed">
                    <span className="font-bold">Response sent to {query.bankName}.</span> We'll notify you when they reply.
                  </p>
                </div>
                <button 
                  onClick={() => navigate("/")}
                  className="shrink-0 bg-foreground text-background px-4 py-1.5 rounded-sm font-body text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm flex items-center gap-2 group"
                >
                  Go home
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>

          {/* Resolved Banner */}
          {isResolved && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3 items-center text-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              <p className="font-body text-sm leading-relaxed">
                This query was resolved and cannot be replied to. For a new question, contact your mortgage specialist.
              </p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="lg:w-80 xl:w-96 mt-10 lg:mt-0 flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          {/* Info Card */}
          <div className="bg-card border border-border rounded-lg px-6 py-5">
            <h3 className="font-heading text-base font-semibold text-foreground tracking-tight mb-3">
              What happens next?
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Once you respond, your message is sent to {query.bankName}. They'll review and may follow up with more questions or resolve the query.
            </p>
          </div>

          {/* Support Section */}
          <div className="border-t border-border pt-6">
            <p className="font-body text-sm font-medium text-foreground mb-1">Need help?</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              Contact your mortgage specialist for guidance on this query.
            </p>
            <div className="space-y-2 text-sm font-body">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">PHONE</span>
                <span className="text-foreground">+971 50 123 4567</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">EMAIL</span>
                <span className="text-foreground">support@rivo.ae</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryDetail;

