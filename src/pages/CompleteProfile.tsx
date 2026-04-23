import React, { useState } from "react";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="font-body text-xs font-medium text-muted-foreground tracking-wide uppercase block mb-1.5">
    {children} {required && <span className="text-destructive">*</span>}
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

const fieldClass = "w-full font-body text-sm bg-background border border-border rounded-sm px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary";
const selectClass = `${fieldClass} cursor-pointer`;

interface CompleteProfileProps {
  onComplete: () => void;
}

const CompleteProfile = ({ onComplete }: CompleteProfileProps) => {
  const { activePersona } = usePersona();

  // State for all fields
  const [firstName, setFirstName] = useState(activePersona?.firstName || "");
  const [lastName, setLastName] = useState(activePersona?.fullName?.split(" ").slice(1).join(" ") || "");
  const [email, setEmail] = useState(activePersona?.email || "");
  const [phone, setPhone] = useState("+971 ");
  const [origin, setOrigin] = useState("India");
  const [motherMaidenName, setMotherMaidenName] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [dependents, setDependents] = useState("");

  const [yearMovedToUAE, setYearMovedToUAE] = useState("");
  const [uaeAddress, setUaeAddress] = useState("");
  const [uaeCity, setUaeCity] = useState("");
  const [uaeState, setUaeState] = useState("");
  const [uaePoBox, setUaePoBox] = useState("");
  const [durationInCurrentAddress, setDurationInCurrentAddress] = useState("");
  const [residenceStatus, setResidenceStatus] = useState("");

  const [uaeRef1Name, setUaeRef1Name] = useState("");
  const [uaeRef1Mobile, setUaeRef1Mobile] = useState("+971 ");
  const [uaeRef2Name, setUaeRef2Name] = useState("");
  const [uaeRef2Mobile, setUaeRef2Mobile] = useState("+971 ");

  const [homeAddress, setHomeAddress] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [homeCountry, setHomeCountry] = useState("");
  const [homeZip, setHomeZip] = useState("");
  const [homePhone, setHomePhone] = useState("+971 ");

  const [homeRef1Name, setHomeRef1Name] = useState("");
  const [homeRef1Mobile, setHomeRef1Mobile] = useState("+971 ");
  const [homeRef2Name, setHomeRef2Name] = useState("");
  const [homeRef2Mobile, setHomeRef2Mobile] = useState("+971 ");

  const [incomeSalary, setIncomeSalary] = useState("20,000");
  const [incomeRental, setIncomeRental] = useState("600");

  const [employmentType, setEmploymentType] = useState("Salaried");
  const [companyName, setCompanyName] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyPersonalEmail, setCompanyPersonalEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [companyZip, setCompanyZip] = useState("");
  const [companyPhone, setCompanyPhone] = useState("+971 ");
  const [noOfEmployees, setNoOfEmployees] = useState("");
  const [companyHrEmail, setCompanyHrEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  const [hasCreditCard, setHasCreditCard] = useState("Yes");
  const [hasPersonalLoan, setHasPersonalLoan] = useState("No");
  const [hasAutoLoan, setHasAutoLoan] = useState("No");
  const [hasOtherLoans, setHasOtherLoans] = useState("No");

  return (
    <div className="min-h-screen bg-background px-6 pt-0 pb-32 md:px-12 md:pt-1 md:pb-16 lg:px-20 lg:pt-2 xl:px-28 xl:pt-4 relative flex flex-col">
      <div className="max-w-6xl">
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-2">
          Complete Your Profile
        </h1>
        <p className="font-body text-muted-foreground text-base leading-relaxed max-w-xl mb-8">
          This helps us prepare your exact document checklist.
        </p>
      </div>

      <div className="max-w-6xl space-y-12 pb-32">
        {/* Personal information */}
            <section>
              <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-6">Personal information</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <div>
                  <FieldLabel required>First name</FieldLabel>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={fieldClass} placeholder="Abhishek" />
                </div>
                <div>
                  <FieldLabel required>Last name</FieldLabel>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={fieldClass} placeholder="Singh" />
                </div>
                <div>
                  <FieldLabel required>Email</FieldLabel>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} placeholder="abhisheksinghpro007@gmail.com" />
                </div>
                <div>
                  <FieldLabel required>Phone number</FieldLabel>
                  <div className="flex gap-2">
                    <input value="+971" readOnly className="w-16 font-body text-sm bg-muted border border-border rounded-sm px-3 py-2 text-muted-foreground" />
                    <input value={phone.replace("+971 ", "")} onChange={(e) => setPhone("+971 " + e.target.value)} className={fieldClass} placeholder="568030907" />
                  </div>
                </div>
                <div>
                  <FieldLabel required>Where are you from?</FieldLabel>
                  <select value={origin} onChange={(e) => setOrigin(e.target.value)} className={selectClass}>
                    <option value="India">India</option>
                    <option value="UAE">UAE</option>
                    <option value="UK">UK</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
                <div>
                  <FieldLabel required>Mother's maiden name</FieldLabel>
                  <input value={motherMaidenName} onChange={(e) => setMotherMaidenName(e.target.value)} className={fieldClass} placeholder="E.g.: Jane Doe" />
                </div>
                <div>
                  <FieldLabel required>Marital status</FieldLabel>
                  <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className={selectClass}>
                    <option value="">Select an option</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
                <div>
                  <FieldLabel required>Number of dependents</FieldLabel>
                  <input type="number" value={dependents} onChange={(e) => setDependents(e.target.value)} className={fieldClass} placeholder="Number of dependents" />
                </div>
              </div>
            </section>

            {/* Residency details in UAE */}
            <section>
              <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-6">Residency details in UAE</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <div>
                  <FieldLabel required>In which year did you move to UAE?</FieldLabel>
                  <input type="number" value={yearMovedToUAE} onChange={(e) => setYearMovedToUAE(e.target.value)} className={fieldClass} placeholder="In which year did you move to UAE?" />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel required>Address</FieldLabel>
                  <input value={uaeAddress} onChange={(e) => setUaeAddress(e.target.value)} className={fieldClass} placeholder="Address" />
                </div>
                <div>
                  <FieldLabel required>City</FieldLabel>
                  <input value={uaeCity} onChange={(e) => setUaeCity(e.target.value)} className={fieldClass} placeholder="City" />
                </div>
                <div>
                  <FieldLabel required>State</FieldLabel>
                  <select value={uaeState} onChange={(e) => setUaeState(e.target.value)} className={selectClass}>
                    <option value="">Pick a state</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                  </select>
                </div>
                <div>
                  <FieldLabel required>PO Box</FieldLabel>
                  <input value={uaePoBox} onChange={(e) => setUaePoBox(e.target.value)} className={fieldClass} placeholder="PO Box" />
                </div>
                <div>
                  <FieldLabel required>How long are you living in your current address?</FieldLabel>
                  <div className="flex gap-2 items-center">
                    <input type="number" value={durationInCurrentAddress} onChange={(e) => setDurationInCurrentAddress(e.target.value)} className={fieldClass} placeholder="years" />
                    <span className="font-body text-sm text-muted-foreground">years</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <FieldLabel required>Status of current residence</FieldLabel>
                  <select value={residenceStatus} onChange={(e) => setResidenceStatus(e.target.value)} className={selectClass}>
                    <option value="">Select your current residence</option>
                    <option value="Owned">Owned</option>
                    <option value="Rented">Rented</option>
                    <option value="Company Provided">Company Provided</option>
                  </select>
                </div>
              </div>
            </section>

            {/* UAE references */}
            <section>
              <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-6">UAE references</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <div>
                  <FieldLabel required>Name of friend/relative (1)</FieldLabel>
                  <input value={uaeRef1Name} onChange={(e) => setUaeRef1Name(e.target.value)} className={fieldClass} placeholder="Name of friend/relative (1)" />
                </div>
                <div>
                  <FieldLabel required>Mobile number of friend/relative (1)</FieldLabel>
                  <div className="flex gap-2">
                    <input value="+971" readOnly className="w-16 font-body text-sm bg-muted border border-border rounded-sm px-3 py-2 text-muted-foreground" />
                    <input value={uaeRef1Mobile.replace("+971 ", "")} onChange={(e) => setUaeRef1Mobile("+971 " + e.target.value)} className={fieldClass} placeholder="Mobile number" />
                  </div>
                </div>
                <div>
                  <FieldLabel required>Name of friend/relative (2)</FieldLabel>
                  <input value={uaeRef2Name} onChange={(e) => setUaeRef2Name(e.target.value)} className={fieldClass} placeholder="Name of friend/relative (2)" />
                </div>
                <div>
                  <FieldLabel required>Mobile number of friend/relative (2)</FieldLabel>
                  <div className="flex gap-2">
                    <input value="+971" readOnly className="w-16 font-body text-sm bg-muted border border-border rounded-sm px-3 py-2 text-muted-foreground" />
                    <input value={uaeRef2Mobile.replace("+971 ", "")} onChange={(e) => setUaeRef2Mobile("+971 " + e.target.value)} className={fieldClass} placeholder="Mobile number" />
                  </div>
                </div>
              </div>
            </section>

            {/* Home country residency details */}
            <section>
              <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-6">Home country residency details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <div className="md:col-span-2">
                  <FieldLabel required>Address</FieldLabel>
                  <input value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} className={fieldClass} placeholder="Address" />
                </div>
                <div>
                  <FieldLabel required>City</FieldLabel>
                  <input value={homeCity} onChange={(e) => setHomeCity(e.target.value)} className={fieldClass} placeholder="City" />
                </div>
                <div>
                  <FieldLabel required>Country</FieldLabel>
                  <select value={homeCountry} onChange={(e) => setHomeCountry(e.target.value)} className={selectClass}>
                    <option value="">Pick a country</option>
                    <option value="India">India</option>
                    <option value="UK">UK</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
                <div>
                  <FieldLabel required>Postal / Zip</FieldLabel>
                  <input value={homeZip} onChange={(e) => setHomeZip(e.target.value)} className={fieldClass} placeholder="Postal / Zip" />
                </div>
                <div>
                  <FieldLabel required>Phone number</FieldLabel>
                  <div className="flex gap-2">
                    <input value="+971" readOnly className="w-16 font-body text-sm bg-muted border border-border rounded-sm px-3 py-2 text-muted-foreground" />
                    <input value={homePhone.replace("+971 ", "")} onChange={(e) => setHomePhone("+971 " + e.target.value)} className={fieldClass} placeholder="Phone number" />
                  </div>
                </div>
              </div>
            </section>

            {/* Home country references */}
            <section>
              <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-6">Home country references</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <div>
                  <FieldLabel required>Name of friend/relative (1)</FieldLabel>
                  <input value={homeRef1Name} onChange={(e) => setHomeRef1Name(e.target.value)} className={fieldClass} placeholder="Name of friend/relative (1)" />
                </div>
                <div>
                  <FieldLabel required>Mobile number of friend/relative (1)</FieldLabel>
                  <div className="flex gap-2">
                    <input value="+971" readOnly className="w-16 font-body text-sm bg-muted border border-border rounded-sm px-3 py-2 text-muted-foreground" />
                    <input value={homeRef1Mobile.replace("+971 ", "")} onChange={(e) => setHomeRef1Mobile("+971 " + e.target.value)} className={fieldClass} placeholder="Mobile number" />
                  </div>
                </div>
                <div>
                  <FieldLabel required>Name of friend/relative (2)</FieldLabel>
                  <input value={homeRef2Name} onChange={(e) => setHomeRef2Name(e.target.value)} className={fieldClass} placeholder="Name of friend/relative (2)" />
                </div>
                <div>
                  <FieldLabel required>Mobile number of friend/relative (2)</FieldLabel>
                  <div className="flex gap-2">
                    <input value="+971" readOnly className="w-16 font-body text-sm bg-muted border border-border rounded-sm px-3 py-2 text-muted-foreground" />
                    <input value={homeRef2Mobile.replace("+971 ", "")} onChange={(e) => setHomeRef2Mobile("+971 " + e.target.value)} className={fieldClass} placeholder="Mobile number" />
                  </div>
                </div>
              </div>
            </section>

            {/* Income */}
            <section>
              <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-6">Income</p>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  <div>
                    <FieldLabel required>Income type</FieldLabel>
                    <select value="Salary" disabled className={`${selectClass} bg-muted text-muted-foreground`}>
                      <option>Salary</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel required>Monthly income</FieldLabel>
                    <div className="flex gap-2 items-center">
                      <input value={incomeSalary} onChange={(e) => setIncomeSalary(e.target.value)} className={fieldClass} placeholder="20,000" />
                      <span className="font-body text-sm text-muted-foreground">AED</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  <div>
                    <FieldLabel required>Income type</FieldLabel>
                    <select value="Rental" disabled className={`${selectClass} bg-muted text-muted-foreground`}>
                      <option>Rental</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel required>Monthly income</FieldLabel>
                    <div className="flex gap-2 items-center">
                      <input value={incomeRental} onChange={(e) => setIncomeRental(e.target.value)} className={fieldClass} placeholder="600" />
                      <span className="font-body text-sm text-muted-foreground">AED</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Employment information */}
            <section>
              <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-6">Employment information</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <div>
                  <FieldLabel required>Employment type</FieldLabel>
                  <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className={selectClass}>
                    <option value="Salaried">Salaried</option>
                    <option value="Self-employed">Self-employed</option>
                  </select>
                </div>
                <div>
                  <FieldLabel required>Company's name</FieldLabel>
                  <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={fieldClass} placeholder="Company's name" />
                </div>
                <div>
                  <FieldLabel required>Company's industry</FieldLabel>
                  <select value={companyIndustry} onChange={(e) => setCompanyIndustry(e.target.value)} className={selectClass}>
                    <option value="">Select an option</option>
                    <option value="Tech">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healcare">Healthcare</option>
                  </select>
                </div>
                <div>
                  <FieldLabel required>Job title</FieldLabel>
                  <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className={fieldClass} placeholder="Job title" />
                </div>
                <div>
                  <FieldLabel required>Company's personal email</FieldLabel>
                  <input type="email" value={companyPersonalEmail} onChange={(e) => setCompanyPersonalEmail(e.target.value)} className={fieldClass} placeholder="Company's personal email" />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel required>Company address</FieldLabel>
                  <input value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} className={fieldClass} placeholder="Company address" />
                </div>
                <div>
                  <FieldLabel required>Company City</FieldLabel>
                  <input value={companyCity} onChange={(e) => setCompanyCity(e.target.value)} className={fieldClass} placeholder="Company City" />
                </div>
                <div>
                  <FieldLabel required>Company Country</FieldLabel>
                  <select value={companyCountry} onChange={(e) => setCompanyCountry(e.target.value)} className={selectClass}>
                    <option value="">Pick a country</option>
                    <option value="India">India</option>
                    <option value="UAE">UAE</option>
                  </select>
                </div>
                <div>
                  <FieldLabel required>Company ZIP</FieldLabel>
                  <input value={companyZip} onChange={(e) => setCompanyZip(e.target.value)} className={fieldClass} placeholder="Company ZIP" />
                </div>
                <div>
                  <FieldLabel required>Company phone number</FieldLabel>
                  <div className="flex gap-2">
                    <input value="+971" readOnly className="w-16 font-body text-sm bg-muted border border-border rounded-sm px-3 py-2 text-muted-foreground" />
                    <input value={companyPhone.replace("+971 ", "")} onChange={(e) => setCompanyPhone("+971 " + e.target.value)} className={fieldClass} placeholder="Phone number" />
                  </div>
                </div>
                <div>
                  <FieldLabel required>No of employees</FieldLabel>
                  <input type="number" value={noOfEmployees} onChange={(e) => setNoOfEmployees(e.target.value)} className={fieldClass} placeholder="No of employees" />
                </div>
                <div>
                  <FieldLabel required>Company HR email</FieldLabel>
                  <input type="email" value={companyHrEmail} onChange={(e) => setCompanyHrEmail(e.target.value)} className={fieldClass} placeholder="Company HR email" />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel required>Company website</FieldLabel>
                  <input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className={fieldClass} placeholder="Company website" />
                </div>
              </div>
            </section>

            {/* Additional loans and cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
              <section>
                <FieldLabel required>Do you have credit cards?</FieldLabel>
                <RadioGroup name="creditCards" options={["Yes", "No"]} value={hasCreditCard} onChange={setHasCreditCard} />
              </section>
              <section>
                <FieldLabel required>Do you have any personal loans?</FieldLabel>
                <RadioGroup name="personalLoans" options={["Yes", "No"]} value={hasPersonalLoan} onChange={setHasPersonalLoan} />
              </section>
              <section>
                <FieldLabel required>Do you have any auto loans?</FieldLabel>
                <RadioGroup name="autoLoans" options={["Yes", "No"]} value={hasAutoLoan} onChange={setHasAutoLoan} />
              </section>
              <section>
                <FieldLabel required>Do you have any other existing loans?</FieldLabel>
                <RadioGroup name="otherLoans" options={["Yes", "No"]} value={hasOtherLoans} onChange={setHasOtherLoans} />
              </section>
            </div>
          </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 right-0 py-2 px-6 md:px-12 lg:px-20 xl:px-28 bg-background border-t border-border z-10" style={{ left: 220 }}>
        <div className="max-w-6xl flex justify-end">
          <Button variant="premium" className="w-full md:w-auto px-12 h-10" onClick={onComplete}>
            Continue to Documents
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
