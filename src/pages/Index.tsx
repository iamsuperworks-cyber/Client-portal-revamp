import { Button } from "@/components/ui/button";
import { Upload, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-background px-6 pt-0 pb-12 md:px-12 md:pt-1 md:pb-16 lg:px-20 lg:pt-2 xl:px-28 xl:pt-4">
      {/* Greeting - full width again to align grid top with section content */}
      <div className="max-w-6xl mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-2">
          Hello, {activePersona?.firstName || "Rajesh"}
        </h1>
        <p className="font-body text-muted-foreground text-base leading-relaxed max-w-xl">
          Your specialist has matched you with these banks based on your profile.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
        {/* Left: Bank list */}
        <div className="flex-1 min-w-0">
          <section>
            <p className="font-heading text-xs tracking-widest uppercase text-text-tertiary mb-5">
              Eligible Banks
            </p>

            <div className="space-y-0">
              {banks.map((bank, i) => (
                <div
                  key={bank.name}
                  className={`py-4 ${i > 0 ? "border-t border-border/50" : ""}`}
                >
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-8">
                    <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
                      {bank.name}
                    </h2>
                    <div className="flex items-baseline gap-6 font-body text-sm text-muted-foreground">
                      <span>
                        <span className="text-text-tertiary mr-1.5">Max</span>
                        <span className="text-foreground font-medium">{bank.maxLoan}</span>
                      </span>
                      <span>
                        <span className="text-text-tertiary mr-1.5">Rate</span>
                        <span className="text-foreground font-medium">{bank.rate}</span>
                      </span>
                      <span>
                        <span className="text-text-tertiary mr-1.5">Term</span>
                        <span className="text-foreground font-medium">{bank.term}</span>
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
              <Button variant="premium" className="w-full" onClick={onNext}>
                Complete Your Profile
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button variant="premium" className="w-full" onClick={() => navigate("/upload")}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>

          {/* Info card */}
          <div className="bg-card border border-border rounded-lg px-6 py-5">
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Complete the profile to get document checklist.
            </p>
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
