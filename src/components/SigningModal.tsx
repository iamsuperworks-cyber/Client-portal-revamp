import { useState, useEffect, useRef } from "react";
import { X, Check, Upload, ChevronLeft, ChevronRight, PenLine } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SigningDocument {
  id: string;
  name: string;
  bank: string;
  dateReceived: string;
  signatureCount: number;
}

interface SigningModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (signedIds: string[]) => void;
  documents: SigningDocument[];
  bankName: string;
  onGoHome: () => void;
  onContinueSigning: () => void;
  onViewSigned: () => void;
  hasPendingOtherBanks: boolean;
  pendingOtherBankNames: string[];
}

type DocStatus = "pending" | "signed";

const PLACEHOLDER_PARAGRAPHS = [
  'This Mortgage Agreement ("Agreement") is entered into as of the date set forth below, by and between the Lender identified herein and the Borrower(s) named below. This Agreement sets forth the terms and conditions under which the Lender agrees to provide a mortgage loan to the Borrower for the purchase of the property described herein.',
  "The Borrower agrees to repay the principal amount of the loan together with interest at the rate specified in the attached schedule. Payments shall be made in equal monthly instalments over the term of the loan, commencing on the first day of the month following the disbursement of funds.",
  "The Borrower acknowledges that the property described in Schedule A shall serve as collateral for this loan. In the event of default, the Lender reserves the right to initiate foreclosure proceedings in accordance with applicable law.",
  "The Borrower represents and warrants that all information provided in connection with this loan application is true, complete, and accurate. Any material misrepresentation may result in the immediate acceleration of the loan balance.",
  "This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which the property is located. Any disputes arising under this Agreement shall be resolved through binding arbitration.",
  "The Borrower agrees to maintain adequate insurance coverage on the property for the duration of the loan term. Proof of insurance must be provided to the Lender annually and upon request.",
];

let hasSetSignatureThisSession = false;

const SigningModal = ({
  open,
  onClose,
  onComplete,
  documents = [],
  bankName,
  onGoHome,
  onContinueSigning,
  onViewSigned,
  hasPendingOtherBanks,
  pendingOtherBankNames,
}: SigningModalProps) => {
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [docStatuses, setDocStatuses] = useState<Record<string, DocStatus>>({});
  const [signedFields, setSignedFields] = useState<Record<string, number>>({});
  const [allComplete, setAllComplete] = useState(false);
  const [showSignatureUpload, setShowSignatureUpload] = useState(!hasSetSignatureThisSession);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setActiveDocIndex(0);
      const statuses: Record<string, DocStatus> = {};
      const fields: Record<string, number> = {};
      documents.forEach((d) => {
        statuses[d.id] = "pending";
        fields[d.id] = 0;
      });
      setDocStatuses(statuses);
      setSignedFields(fields);
      setAllComplete(false);
      setShowSignatureUpload(!hasSetSignatureThisSession);
      setSignaturePreview(null);
      setUploadError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, bankName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Please upload a PNG or JPG file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File size must be under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignaturePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSignature = () => {
    setSignaturePreview(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const activeDoc = documents[activeDocIndex];
  const currentDocSignedFields = activeDoc ? (signedFields[activeDoc.id] || 0) : 0;
  const isCurrentDocFullySigned = activeDoc ? currentDocSignedFields === activeDoc.signatureCount : false;
  const signedCount = Object.values(docStatuses).filter((s) => s === "signed").length;
  const progressPct = documents.length > 0 ? (signedCount / documents.length) * 100 : 0;

  const handleClose = () => {
    const signedIds = documents.filter((d) => docStatuses[d.id] === "signed").map((d) => d.id);
    if (signedIds.length > 0) onComplete(signedIds);
    onClose();
  };

  const handleInsertSignature = () => {
    if (!activeDoc || isCurrentDocFullySigned) return;
    const newCount = currentDocSignedFields + 1;
    const updatedFields = { ...signedFields, [activeDoc.id]: newCount };
    setSignedFields(updatedFields);
    if (newCount === activeDoc.signatureCount) {
      const updatedStatuses = { ...docStatuses, [activeDoc.id]: "signed" as DocStatus };
      setDocStatuses(updatedStatuses);
    }
  };

  const handlePrev = () => {
    if (activeDocIndex > 0) setActiveDocIndex(activeDocIndex - 1);
  };

  const handleNext = () => {
    if (activeDocIndex < documents.length - 1) {
      if (isCurrentDocFullySigned) {
        setActiveDocIndex(activeDocIndex + 1);
      }
    } else if (isCurrentDocFullySigned) {
      setAllComplete(true);
      onComplete(documents.map((d) => d.id));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div
        className="relative z-10 bg-card rounded-lg shadow-xl flex flex-col overflow-hidden"
        style={{ width: 1180, height: 680 }}
      >
        {/* Header */}
        <div className="flex items-center px-5 border-b border-border shrink-0" style={{ height: 48 }}>
          <div className="flex-1" />
          <div className="flex-1 flex items-center justify-center">
            <p className="font-heading text-sm font-semibold text-foreground text-center">{bankName} — Documents to Sign</p>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* Left panel */}
          <div
            className={`shrink-0 bg-secondary border-r border-border flex flex-col transition-opacity duration-300 ${showSignatureUpload ? "opacity-40 pointer-events-none" : ""}`}
            style={{ width: 200 }}
          >
            <div className="px-4 pt-4 pb-2">
              <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                Documents
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-2">
              {documents.map((doc, idx) => {
                const status = docStatuses[doc.id] || "pending";
                const isActive = idx === activeDocIndex;
                const isSigned = status === "signed";
                return (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDocIndex(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-sm flex items-start gap-2.5 transition-colors ${
                      isActive
                        ? "bg-primary/10 border-l-2 border-primary"
                        : "border-l-2 border-transparent hover:bg-muted"
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${
                        isSigned ? "bg-primary" : "border border-border"
                      }`}
                    >
                      {isSigned && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`font-body text-xs leading-tight ${isSigned ? "text-primary font-medium" : "text-foreground"}`}
                        style={{ fontWeight: 500 }}
                      >
                        {doc.name}
                      </p>
                      <p
                        className={`font-body mt-0.5 ${isSigned ? "text-primary" : "text-muted-foreground"}`}
                        style={{ fontSize: 10 }}
                      >
                        {isSigned ? "Signed" : "Pending"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Left panel footer */}
            {!showSignatureUpload && !allComplete && (
              <div className="mt-auto border-t border-border p-4 bg-secondary/50">
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">
                  This form
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{
                        width: activeDoc?.signatureCount
                          ? `${(currentDocSignedFields / activeDoc.signatureCount) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                  <span className="font-body text-[10px] text-muted-foreground whitespace-nowrap">
                    {currentDocSignedFields} of {activeDoc?.signatureCount}
                  </span>
                </div>
                <div className="bg-muted/60 rounded-sm p-3">
                  <p className="font-body text-[10px] font-medium text-foreground mb-1.5">How to sign</p>
                  <ol className="font-body text-[10px] text-muted-foreground space-y-1 pl-3 list-decimal">
                    <li>Scroll through the form</li>
                    <li>Find highlighted signature spaces</li>
                    <li>Click Insert Signature when you reach one</li>
                    <li>Repeat for all fields</li>
                    <li>Click Next for the next form</li>
                    <li>Click Done when all forms are signed</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Center panel */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            {showSignatureUpload ? (
              <div className="flex-1 flex items-center justify-center bg-muted/30 p-6">
                <div className="bg-card rounded-lg border border-border p-8 max-w-[420px] w-full shadow-sm">
                  <h2 className="font-heading text-lg font-bold text-foreground mb-2">Set your signature</h2>
                  <p className="font-body text-xs text-muted-foreground mb-6 leading-relaxed">
                    Upload an image of your signature. It will be used to sign all your documents — you won't need to upload it again.
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                  />
                  <div
                    onClick={() => !signaturePreview && fileInputRef.current?.click()}
                    className={`border border-dashed border-border rounded-lg flex flex-col items-center justify-center mb-2 transition-colors relative overflow-hidden ${
                      !signaturePreview ? "p-8 cursor-pointer hover:bg-muted/50" : "h-[160px]"
                    }`}
                  >
                    {signaturePreview ? (
                      <img
                        src={signaturePreview}
                        alt="Signature preview"
                        className="w-full h-full object-contain p-4"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-muted-foreground mb-3" />
                        <p className="font-body text-xs font-medium text-foreground mb-1">Click to upload signature</p>
                        <p className="font-body text-[10px] text-muted-foreground">PNG, JPG up to 2MB</p>
                      </>
                    )}
                  </div>
                  {uploadError && (
                    <p className="font-body text-[10px] text-destructive mb-4">{uploadError}</p>
                  )}
                  {signaturePreview && (
                    <div className="mt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex items-center justify-center">
                            <input type="checkbox" id="remove-bg" className="w-3.5 h-3.5 accent-primary cursor-pointer" />
                          </div>
                          <div>
                            <label htmlFor="remove-bg" className="font-body text-xs font-medium text-foreground cursor-pointer">Remove background</label>
                            <p className="font-body text-[10px] text-muted-foreground mt-0.5">Removes white or light backgrounds from your signature image</p>
                          </div>
                        </div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="font-body text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors mt-0.5"
                        >
                          Replace
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      hasSetSignatureThisSession = true;
                      setShowSignatureUpload(false);
                    }}
                    disabled={!signaturePreview}
                    className={`w-full mt-6 font-body text-[11px] font-semibold cursor-pointer rounded-sm px-6 py-2.5 transition-colors ${
                      signaturePreview
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                    }`}
                  >
                    Proceed to Review
                  </button>
                </div>
              </div>
            ) : !allComplete ? (
              <>
                <div className="flex-1 overflow-y-scroll p-6 bg-muted/30">
                  <div className="bg-card rounded-lg border border-border p-8 max-w-2xl mx-auto relative shadow-sm">
                    <h3 className="font-heading text-base font-bold text-foreground mb-4">{activeDoc?.name}</h3>
                    {PLACEHOLDER_PARAGRAPHS.map((p, i) => (
                      <p key={i} className="font-body text-xs text-foreground/80 leading-relaxed mb-3">
                        {p}
                      </p>
                    ))}
                    <div className="mt-10 pt-6 border-t border-border space-y-4">
                      {Array.from({ length: activeDoc?.signatureCount || 0 }).map((_, i) => {
                        const isSigned = i < currentDocSignedFields;
                        return (
                          <div
                            key={i}
                            className={`rounded border-2 border-dashed flex flex-col items-center justify-center transition-colors p-3 ${
                              isSigned ? "border-primary bg-primary/5" : "border-primary/40 bg-primary/5"
                            }`}
                          >
                            {isSigned ? (
                              <Check className="h-6 w-6 text-primary" />
                            ) : (
                              <>
                                <span className="font-body text-[10px] font-medium text-primary tracking-wider">
                                  Signature required
                                </span>
                                <span className="font-body text-[10px] text-primary/70 mt-0.5">
                                  Click Insert Signature below to sign here
                                </span>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="border-t border-border px-6 py-3 flex items-center justify-between bg-card shrink-0">
                  <button
                    onClick={handlePrev}
                    disabled={activeDocIndex === 0}
                    className="flex items-center justify-center font-body text-[11px] font-semibold cursor-pointer rounded-sm px-3 py-1.5 border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    Prev
                  </button>
                  <button
                    onClick={handleInsertSignature}
                    disabled={isCurrentDocFullySigned}
                    className="flex items-center gap-1.5 font-body text-[11px] font-semibold cursor-pointer rounded-sm px-4 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PenLine className="h-3.5 w-3.5" />
                    Insert Signature
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!isCurrentDocFullySigned}
                    className="flex items-center justify-center font-body text-[11px] font-semibold cursor-pointer rounded-sm px-3 py-1.5 border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {activeDocIndex === documents.length - 1 && isCurrentDocFullySigned ? "Done" : "Next"}
                    {!(activeDocIndex === documents.length - 1 && isCurrentDocFullySigned) && <ChevronRight className="h-3.5 w-3.5 ml-1" />}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-7 w-7 text-primary-foreground" />
                </div>
                {hasPendingOtherBanks ? (
                  <>
                    <h2 className="font-heading text-xl font-bold text-foreground">All {bankName} forms signed</h2>
                    <p className="font-body text-sm text-muted-foreground text-center max-w-md">
                      You still have pending forms with {pendingOtherBankNames.join(" and ")}.
                    </p>
                    <button
                      onClick={onContinueSigning}
                      className="mt-4 w-full max-w-xs font-body text-[11px] font-semibold cursor-pointer rounded-sm px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Sign Next Bank
                    </button>
                    <button
                      onClick={onViewSigned}
                      className="w-full max-w-xs font-body text-[11px] font-semibold cursor-pointer rounded-sm px-6 py-2.5 border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      View Signed Forms
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="font-heading text-xl font-bold text-foreground">All forms signed</h2>
                    <p className="font-body text-sm text-muted-foreground text-center max-w-md">
                      You've signed all your bank forms. They are saved in the Signed tab.
                    </p>
                    <button
                      onClick={onGoHome}
                      className="mt-4 w-full max-w-xs font-body text-[11px] font-semibold cursor-pointer rounded-sm px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Go Home
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigningModal;