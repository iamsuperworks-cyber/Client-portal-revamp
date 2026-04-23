import { Button } from "@/components/ui/button";
import { Upload, ArrowRight, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePersona } from "@/contexts/PersonaContext";

interface Bank {
  name: string;
  maxLoan: string;
  rate: string;
  term: string;
}

const mockBanks: Bank[] = [
  { name: "Nordea", maxLoan: "AED 1,412,000", rate: "3.45%", term: "25 years" },
  { name: "SEB", maxLoan: "AED 1,328,000", rate: "3.62%", term: "30 years" },
  { name: "Swedbank", maxLoan: "AED 1,247,000", rate: "3.78%", term: "25 years" },
  { name: "Luminor", maxLoan: "AED 1,093,000", rate: "3.91%", term: "20 years" },
];

const Index = ({ onNext, isInitialFlow }: { onNext?: () => void; isInitialFlow?: boolean }) => {
  const banks = mockBanks;
  const navigate = useNavigate();
  const { activePersona } = usePersona();

  return (
    <div className="min-h-screen bg-background px-6 pt-5 pb-12 md:px-12 md:pt-1 md:pb-16 lg:px-20 lg:pt-2 xl:px-28 xl:pt-4">
      {/* Greeting */}
      <div className="max-w-6xl mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-2">
          Hello, {activePersona?.firstName || "Rajesh"}
        </h1>

        {/* Desktop subtitle — shown immediately below heading */}
        <p className="hidden md:block font-body text-muted-foreground text-base leading-relaxed max-w-xl">
          Your specialist has matched you with these banks based on your profile.
        </p>

        {/* Mobile-only CTA — sits right below heading */}
        {isInitialFlow && (
          <div className="md:hidden mt-4 flex flex-col gap-2">
            <Button variant="premium" className="w-full" onClick={onNext} data-tour="profile-btn">
              Complete Your Profile
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <p className="font-body text-xs text-muted-foreground text-center">
              Complete the profile to get document checklist.
            </p>
          </div>
        )}

        {/* Mobile subtitle — shown after CTA with spacing */}
        <p className="md:hidden mt-5 font-body text-muted-foreground text-base leading-relaxed">
          Your specialist has matched you with these banks based on your profile.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
        {/* Left: Bank list */}
        <div className="flex-1 min-w-0">
          <section>
            <p className="font-heading text-xs tracking-widest uppercase text-text-tertiary mb-3">
              Eligible Banks
            </p>

            <div className="space-y-0">
              {banks.map((bank, i) => (
                <div
                  key={bank.name}
                  className={`py-4 ${i > 0 ? "border-t border-border/50" : ""}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 md:gap-8">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-surface-elevated flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <h2 className="font-heading text-xl md:text-3xl font-semibold text-foreground tracking-tight">
                        {bank.name}
                      </h2>
                    </div>
                    <div className="flex items-baseline gap-3 md:gap-6 font-body text-sm text-muted-foreground">
                      <span className="whitespace-nowrap">
                        <span className="text-text-tertiary mr-1">Max</span>
                        <span className="text-foreground font-medium text-xs md:text-sm">{bank.maxLoan}</span>
                      </span>
                      <span className="whitespace-nowrap">
                        <span className="text-text-tertiary mr-1">Rate</span>
                        <span className="text-foreground font-medium text-xs md:text-sm">{bank.rate}</span>
                      </span>
                      <span className="whitespace-nowrap">
                        <span className="text-text-tertiary mr-1">Term</span>
                        <span className="text-foreground font-medium text-xs md:text-sm">{bank.term}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: CTA, note, support */}
        <div className="lg:w-80 xl:w-96 mt-10 lg:mt-0 flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          {/* CTA */}
          <div>
            {isInitialFlow ? (
              <div className="hidden md:flex md:flex-col md:gap-4">
                <Button variant="premium" className="w-full" onClick={onNext} data-tour="profile-btn">
                  Complete Your Profile
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
                <div className="bg-card border border-border rounded-lg px-6 py-5">
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    Complete the profile to get document checklist.
                  </p>
                </div>
              </div>
            ) : (
              <Button variant="premium" className="w-full" onClick={() => navigate("/upload")}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>

          {/* Support */}
          <div className="border-t border-border pt-6">
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Need help? Contact your mortgage specialist for guidance
              on next steps or document requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
