import { useState } from "react";
import { ArrowLeft, ChevronRight, AlertTriangle, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePersona } from "@/contexts/PersonaContext";
import { usePageLoader } from "@/hooks/use-page-loader";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

type Screen = "main" | "kyc";

const kycDocuments = [
  "Passport",
  "Emirates ID (front)",
  "Emirates ID (back)",
  "Visa",
  "Salary Certificate",
  "Payslips (6 months)",
  "Personal Bank Statements (6 months)",
];

const emirates = [
  "Abu Dhabi", "Dubai", "Sharjah", "Ajman",
  "Umm Al Quwain", "Ras Al Khaimah", "Fujairah",
];

const transactionTypes = [
  "Primary", "Resale", "Buyout + Equity", "Buyout", "Equity",
];

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="font-body text-xs font-medium text-muted-foreground tracking-wide uppercase block mb-1.5">
    {children}
  </label>
);

const RadioGroup = ({
  name, options, value, onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex gap-4 flex-wrap">
    {options.map((opt) => (
      <label key={opt} className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name={name}
          value={opt}
          checked={value === opt}
          onChange={() => onChange(opt)}
          className="accent-primary w-3.5 h-3.5"
        />
        <span className="font-body text-sm text-foreground">{opt}</span>
      </label>
    ))}
  </div>
);

const AccountSettings = () => {
  const isLoading = usePageLoader();
  const navigate = useNavigate();
  const { activePersona } = usePersona();
  const [screen, setScreen] = useState<Screen>("main");

  const [employmentType, setEmploymentType] = useState(activePersona?.employmentType || "Salaried");
  const [applicantType, setApplicantType] = useState(activePersona?.applicantType || "Solo");
  const [propertyCategory, setPropertyCategory] = useState(activePersona?.propertyCategory || "Residential");
  const [propertyType, setPropertyType] = useState(activePersona?.propertyType || "Off-Plan");
  const [firstProperty, setFirstProperty] = useState(activePersona?.firstProperty || "Yes");
  const [existingMortgage, setExistingMortgage] = useState(activePersona?.existingMortgage || "No");
  const [additionalIncome, setAdditionalIncome] = useState(activePersona?.additionalIncome ?? false);
  const [dob, setDob] = useState(activePersona?.dob || "1980-03-14");
  const [companyName, setCompanyName] = useState(activePersona?.companyName || "TechCorp ME LLC");
  const [workEmail, setWorkEmail] = useState(activePersona?.workEmail || "rajesh.nair80@gmail.com");
  const [yearsAtEmployer, setYearsAtEmployer] = useState(activePersona?.yearsAtEmployer || "3+ years");
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [propertyValue, setPropertyValue] = useState(activePersona?.propertyValue || "1850000");
  const [emirate, setEmirate] = useState(activePersona?.emirate || "Dubai");
  const [transactionType, setTransactionType] = useState(activePersona?.transactionType || "Primary");
  const [monthlyRepayments, setMonthlyRepayments] = useState(activePersona?.monthlyRepayments || "1800");
  const [creditCardLimit, setCreditCardLimit] = useState("");
  const [bonus, setBonus] = useState("");
  const [commission, setCommission] = useState("");
  const [rentalIncome, setRentalIncome] = useState("");
  const [fixedAllowance, setFixedAllowance] = useState("");
  const [variableAllowance, setVariableAllowance] = useState("");

  // Co-applicant state — initialised from persona if present
  const co = activePersona?.coApplicant;
  const [coFullName, setCoFullName] = useState(co?.fullName || "");
  const [coDob, setCoDob] = useState(co?.dob || "");
  const [coCompany, setCoCompany] = useState(co?.companyName || "");
  const [coEmail, setCoEmail] = useState(co?.email || "");
  const [coJobTitle, setCoJobTitle] = useState(co?.jobTitle || "");
  const [coYearsAtEmployer, setCoYearsAtEmployer] = useState(co?.yearsAtEmployer || "");

  if (isLoading) return <ProfileSkeleton />;

  const fieldClass = "w-full font-body text-sm bg-background border border-border rounded-sm px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const selectClass = `${fieldClass} cursor-pointer`;

  if (screen === "kyc") {
    return (
      <div className="min-h-screen bg-background px-6 pt-5 pb-12 md:px-12 md:pt-1 md:pb-16 lg:px-20 lg:pt-2 xl:px-28 xl:pt-4">
        {/* Back button */}
        <div className="max-w-6xl mb-4">
          <button onClick={() => setScreen("main")} className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-2">KYC Documents</h1>
        <p className="font-body text-muted-foreground text-sm leading-relaxed max-w-xl">These documents were uploaded as part of your application.</p>
            </div>
            <div>
              {kycDocuments.map((doc, i) => (
                <div key={doc} className={`flex items-center justify-between py-4 rounded-sm hover:bg-muted/50 transition-colors ${i > 0 ? "border-t border-border/50" : ""}`}>
                  <span className="font-body text-sm text-foreground">{doc}</span>
                  <Button variant="outline" size="sm" disabled>View</Button>
                </div>
              ))}
            </div>
            <p className="font-body text-xs text-muted-foreground mt-4">Deletion available in 83 days</p>
          </div>
          <div className="lg:w-80 xl:w-96 mt-10 lg:mt-0 flex flex-col gap-8 lg:sticky lg:top-8 lg:self-start">
            <Button variant="destructive" className="w-full inline-flex items-center justify-center gap-1.5" disabled>
              <Trash2 className="h-3 w-3" />Delete
            </Button>
            <div className="bg-surface-elevated rounded-sm px-6 py-5">
              <p className="font-body text-accent-foreground text-sm leading-relaxed">Deletion is permanent and cannot be undone. This will remove all KYC documents from your account.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 pt-5 pb-12 md:px-12 md:pt-1 md:pb-16 lg:px-20 lg:pt-2 xl:px-28 xl:pt-4 overflow-x-hidden">
      <div className="max-w-6xl">
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-2">My Profile</h1>
        <p className="font-body text-muted-foreground text-base leading-relaxed max-w-xl mb-6 md:mb-8">Your personal information and application details.</p>
      </div>

      <div className="max-w-6xl space-y-8 md:space-y-12">

        {/* About You */}
        <section>
          <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-6">About You</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <Input value={activePersona?.fullName || "Rajesh Kumar Nair"} readOnly className="bg-muted text-muted-foreground cursor-default" />
            </div>
            <div>
              <FieldLabel>Date of Birth</FieldLabel>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} className={fieldClass} />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Employment Type</FieldLabel>
              <RadioGroup name="employmentType" options={["Salaried", "Self-employed"]} value={employmentType} onChange={setEmploymentType} />
            </div>
            {employmentType === "Salaried" && (
              <>
                <div>
                  <FieldLabel>Company Name</FieldLabel>
                  <input value={companyName} onChange={e => setCompanyName(e.target.value)} className={fieldClass} placeholder="Enter company name" />
                </div>
                <div>
                  <FieldLabel>Work Email</FieldLabel>
                  <input type="email" value={workEmail} onChange={e => setWorkEmail(e.target.value)} className={fieldClass} placeholder="work@company.com" />
                </div>
                <div>
                  <FieldLabel>Years at Current Employer</FieldLabel>
                  <select value={yearsAtEmployer} onChange={e => setYearsAtEmployer(e.target.value)} className={selectClass}>
                    <option value="">Select duration</option>
                    <option>Less than 6 months</option>
                    <option>6 months – 1 year</option>
                    <option>1 – 3 years</option>
                    <option>3+ years</option>
                  </select>
                </div>
              </>
            )}
            {employmentType === "Self-employed" && (
              <>
                <div>
                  <FieldLabel>Business Name</FieldLabel>
                  <input value={businessName} onChange={e => setBusinessName(e.target.value)} className={fieldClass} placeholder="Enter business name" />
                </div>
                <div>
                  <FieldLabel>Business Email</FieldLabel>
                  <input type="email" value={businessEmail} onChange={e => setBusinessEmail(e.target.value)} className={fieldClass} placeholder="hello@business.com" />
                </div>
                <div>
                  <FieldLabel>Years in Business</FieldLabel>
                  <select value={yearsInBusiness} onChange={e => setYearsInBusiness(e.target.value)} className={selectClass}>
                    <option value="">Select duration</option>
                    <option>Less than 2 years</option>
                    <option>2 – 5 years</option>
                    <option>5+ years</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Your Property */}
        <section>
          <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-6">Your Property</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

            {/* Applicant Type + Property Category side by side */}
            <div>
              <FieldLabel>Applicant Type</FieldLabel>
              <RadioGroup name="applicantType" options={["Solo", "With co-applicant"]} value={applicantType} onChange={setApplicantType} />
            </div>
            <div>
              <FieldLabel>Property Category</FieldLabel>
              <RadioGroup name="propertyCategory" options={["Residential", "Commercial"]} value={propertyCategory} onChange={setPropertyCategory} />
            </div>

            {/* Co-applicant fields — full width, appears immediately below when selected */}
            {applicantType === "With co-applicant" && (
              <div className="md:col-span-2 bg-secondary rounded-sm p-5">
                <p className="font-body text-xs font-medium text-muted-foreground tracking-wide uppercase mb-4">Co-applicant Details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                  <div>
                    <FieldLabel>Full Name</FieldLabel>
                    <input value={coFullName} onChange={e => setCoFullName(e.target.value)} className={fieldClass} placeholder="Co-applicant full name" />
                  </div>
                  <div>
                    <FieldLabel>Date of Birth</FieldLabel>
                    <input type="date" value={coDob} onChange={e => setCoDob(e.target.value)} className={fieldClass} />
                  </div>
                  <div>
                    <FieldLabel>Company</FieldLabel>
                    <input value={coCompany} onChange={e => setCoCompany(e.target.value)} className={fieldClass} placeholder="Company name" />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <input type="email" value={coEmail} onChange={e => setCoEmail(e.target.value)} className={fieldClass} placeholder="email@company.com" />
                  </div>
                  <div>
                    <FieldLabel>Job Title</FieldLabel>
                    <input value={coJobTitle} onChange={e => setCoJobTitle(e.target.value)} className={fieldClass} placeholder="Job title" />
                  </div>
                  <div>
                    <FieldLabel>Years at Employer</FieldLabel>
                    <select value={coYearsAtEmployer} onChange={e => setCoYearsAtEmployer(e.target.value)} className={selectClass}>
                      <option value="">Select duration</option>
                      <option>Less than 6 months</option>
                      <option>6 months – 1 year</option>
                      <option>1 – 3 years</option>
                      <option>3+ years</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div>
              <FieldLabel>Property Type</FieldLabel>
              <RadioGroup name="propertyType" options={["Ready", "Off-Plan"]} value={propertyType} onChange={setPropertyType} />
            </div>
            <div>
              <FieldLabel>First Property in UAE?</FieldLabel>
              <RadioGroup name="firstProperty" options={["Yes", "No"]} value={firstProperty} onChange={setFirstProperty} />
            </div>
            <div>
              <FieldLabel>Property Value (AED)</FieldLabel>
              <input type="number" value={propertyValue} onChange={e => setPropertyValue(e.target.value)} className={fieldClass} placeholder="e.g. 1,500,000" />
            </div>
            <div>
              <FieldLabel>Location / Emirate</FieldLabel>
              <select value={emirate} onChange={e => setEmirate(e.target.value)} className={selectClass}>
                <option value="">Select emirate</option>
                {emirates.map(em => <option key={em}>{em}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Transaction Type</FieldLabel>
              <select value={transactionType} onChange={e => setTransactionType(e.target.value)} className={selectClass}>
                <option value="">Select transaction type</option>
                {transactionTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Financial Details */}
        <section>
          <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-6">Financial Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div className="md:col-span-2">
              <FieldLabel>Existing UAE Mortgage?</FieldLabel>
              <RadioGroup name="existingMortgage" options={["Yes", "No"]} value={existingMortgage} onChange={setExistingMortgage} />
            </div>
            <div>
              <FieldLabel>Total Monthly Repayments (AED)</FieldLabel>
              <input type="number" value={monthlyRepayments} onChange={e => setMonthlyRepayments(e.target.value)} className={fieldClass} placeholder="Includes car / personal loans" />
            </div>
            <div>
              <FieldLabel>Total Credit Card Limit (AED)</FieldLabel>
              <input type="number" value={creditCardLimit} onChange={e => setCreditCardLimit(e.target.value)} className={fieldClass} placeholder="Total limit, not balance" />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm font-medium text-foreground">Additional Income</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">Include bonuses, commissions, rental income or allowances</p>
                </div>
                <button
                  onClick={() => setAdditionalIncome(!additionalIncome)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${additionalIncome ? "bg-primary" : "bg-border"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${additionalIncome ? "translate-x-4" : "translate-x-1"}`} />
                </button>
              </div>
            </div>
            {additionalIncome && (
              <>
                <div>
                  <FieldLabel>Guaranteed Annual Bonus (AED)</FieldLabel>
                  <input type="number" value={bonus} onChange={e => setBonus(e.target.value)} className={fieldClass} placeholder="Annual amount" />
                </div>
                <div>
                  <FieldLabel>Annual Commission (AED)</FieldLabel>
                  <input type="number" value={commission} onChange={e => setCommission(e.target.value)} className={fieldClass} placeholder="Annual amount" />
                </div>
                <div>
                  <FieldLabel>Annual Rental Income (AED)</FieldLabel>
                  <input type="number" value={rentalIncome} onChange={e => setRentalIncome(e.target.value)} className={fieldClass} placeholder="Annual amount" />
                </div>
                <div>
                  <FieldLabel>Annual Fixed Allowance (AED)</FieldLabel>
                  <input type="number" value={fixedAllowance} onChange={e => setFixedAllowance(e.target.value)} className={fieldClass} placeholder="Annual amount" />
                </div>
                <div>
                  <FieldLabel>Annual Variable Allowance (AED)</FieldLabel>
                  <input type="number" value={variableAllowance} onChange={e => setVariableAllowance(e.target.value)} className={fieldClass} placeholder="Annual amount" />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Data & Privacy */}
        <div className="border-t-2 border-border pt-8 md:pt-12">
          <section>
            <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-6">Data & Privacy</p>
            <div className="flex items-start gap-3 rounded-sm border border-warning-border bg-warning px-5 py-4 mb-6">
              <AlertTriangle className="h-4 w-4 text-warning-icon mt-0.5 shrink-0" />
              <p className="font-body text-sm text-warning-foreground leading-relaxed">
                Document deletion is permanent and cannot be undone. Deleted documents may need to be re-uploaded if your application is still in progress.
              </p>
            </div>
            <div className="mb-6">
              <p className="font-heading text-sm font-semibold text-foreground mb-1">Your Signature</p>
              <p className="font-body text-xs text-muted-foreground mb-3">Saved signature used to sign your documents</p>
              <div className="border border-border rounded-sm px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-16 h-9 shrink-0 border border-border rounded-sm bg-muted flex items-center justify-center">
                    <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "13px", color: "hsl(var(--primary))", margin: 0 }}>
                      {activePersona ? `${activePersona.initials.split("").join(". ")}.` : "R. Nair"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-sm font-medium text-foreground">Signature saved</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">Used for signing documents</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button disabled className="font-body text-[12px] font-semibold cursor-not-allowed rounded-sm border border-border text-muted-foreground inline-flex items-center justify-center gap-1.5 px-3 h-8">
                    <Eye className="h-3 w-3" />View
                  </button>
                  <button disabled className="font-body text-[12px] font-semibold cursor-not-allowed rounded-sm bg-destructive text-white opacity-60 inline-flex items-center justify-center gap-1.5 px-3 h-8">
                    <Trash2 className="h-3 w-3" />Delete
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <p className="font-heading text-sm font-semibold text-foreground mb-2">KYC Documents</p>
              <button
                onClick={() => setScreen("kyc")}
                className="w-full py-4 rounded-sm hover:bg-muted/50 transition-colors cursor-pointer border-t border-border/50 flex items-center justify-between text-left"
              >
                <div>
                  <span className="font-body text-sm text-foreground">KYC Documents</span>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">Deletion available in 83 days</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default AccountSettings;