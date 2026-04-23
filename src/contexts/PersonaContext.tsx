import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CoApplicant {
  fullName: string;
  dob: string;
  companyName: string;
  email: string;
  jobTitle: string;
  yearsAtEmployer: string;
}

export interface Persona {
  firstName: string;
  fullName: string;
  email: string;
  initials: string;
  dob: string;
  companyName: string;
  workEmail: string;
  yearsAtEmployer: string;
  employmentType: string;
  applicantType: string;
  propertyCategory: string;
  propertyType: string;
  propertyValue: string;
  emirate: string;
  transactionType: string;
  firstProperty: string;
  existingMortgage: string;
  monthlyRepayments: string;
  additionalIncome: boolean;
  coApplicant?: CoApplicant;
}

export const personas: Persona[] = [
  {
    firstName: "Rajesh",
    fullName: "Rajesh Kumar Nair",
    email: "rajesh.nair80@gmail.com",
    initials: "RK",
    dob: "1980-03-14",
    companyName: "TechCorp ME LLC",
    workEmail: "rajesh.nair80@gmail.com",
    yearsAtEmployer: "3+ years",
    employmentType: "Salaried",
    applicantType: "Solo",
    propertyCategory: "Residential",
    propertyType: "Off-Plan",
    propertyValue: "1850000",
    emirate: "Dubai",
    transactionType: "Primary",
    firstProperty: "Yes",
    existingMortgage: "No",
    monthlyRepayments: "1800",
    additionalIncome: false,
  },
  {
    firstName: "Fatima",
    fullName: "Fatima Khalid Al Mansoori",
    email: "fatima.mansoori88@hotmail.com",
    initials: "FK",
    dob: "1988-09-22",
    companyName: "Abu Dhabi Dept of Education & Knowledge",
    workEmail: "fatima.mansoori88@hotmail.com",
    yearsAtEmployer: "3+ years",
    employmentType: "Salaried",
    applicantType: "Solo",
    propertyCategory: "Residential",
    propertyType: "Ready",
    propertyValue: "3200000",
    emirate: "Abu Dhabi",
    transactionType: "Resale",
    firstProperty: "No",
    existingMortgage: "Yes",
    monthlyRepayments: "7700",
    additionalIncome: false,
  },
  {
    firstName: "James",
    fullName: "James Robert Whitfield",
    email: "james.whitfield75@gmail.com",
    initials: "JW",
    dob: "1975-07-05",
    companyName: "Gulf Partners Advisory Ltd",
    workEmail: "james.whitfield75@gmail.com",
    yearsAtEmployer: "3+ years",
    employmentType: "Salaried",
    applicantType: "Solo",
    propertyCategory: "Residential",
    propertyType: "Ready",
    propertyValue: "8500000",
    emirate: "Dubai",
    transactionType: "Primary",
    firstProperty: "Yes",
    existingMortgage: "Yes",
    monthlyRepayments: "11800",
    additionalIncome: true,
  },
  {
    firstName: "Priya",
    fullName: "Priya Sharma",
    email: "priya.sharma85@gmail.com",
    initials: "PS",
    dob: "1985-04-18",
    companyName: "Aldar Properties PJSC",
    workEmail: "priya.sharma85@gmail.com",
    yearsAtEmployer: "1 – 3 years",
    employmentType: "Salaried",
    applicantType: "With co-applicant",
    propertyCategory: "Residential",
    propertyType: "Ready",
    propertyValue: "3800000",
    emirate: "Dubai",
    transactionType: "Primary",
    firstProperty: "Yes",
    existingMortgage: "No",
    monthlyRepayments: "6500",
    additionalIncome: false,
    coApplicant: {
      fullName: "Arjun Sharma",
      dob: "1982-11-03",
      companyName: "Emirates Steel",
      email: "arjun.sharma82@gmail.com",
      jobTitle: "Operations Director",
      yearsAtEmployer: "3+ years",
    },
  },
  {
    firstName: "Ananya",
    fullName: "Ananya Krishnamurthy",
    email: "a.krishnamurthy@deloitte.ae",
    initials: "AK",
    dob: "1992-08-29",
    companyName: "Deloitte & Touche Middle East",
    workEmail: "a.krishnamurthy@deloitte.ae",
    yearsAtEmployer: "6 months – 1 year",
    employmentType: "Salaried",
    applicantType: "Solo",
    propertyCategory: "Residential",
    propertyType: "Ready",
    propertyValue: "950000",
    emirate: "Dubai",
    transactionType: "Primary",
    firstProperty: "Yes",
    existingMortgage: "No",
    monthlyRepayments: "1600",
    additionalIncome: false,
  },
  {
    firstName: "Vikram",
    fullName: "Vikram Dilip Sethi",
    email: "v.sethi@alshayagroup.com",
    initials: "VS",
    dob: "1976-03-03",
    companyName: "Alshaya Group",
    workEmail: "v.sethi@alshayagroup.com",
    yearsAtEmployer: "3+ years",
    employmentType: "Salaried",
    applicantType: "Solo",
    propertyCategory: "Residential",
    propertyType: "Ready",
    propertyValue: "3100000",
    emirate: "Dubai",
    transactionType: "Buyout",
    firstProperty: "No",
    existingMortgage: "Yes",
    monthlyRepayments: "30300",
    additionalIncome: false,
  },
];

interface PersonaContextType {
  activePersona: Persona | null;
  setActivePersona: (persona: Persona) => void;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePersona, setActivePersona] = useState<Persona | null>(personas[0]);

  return (
    <PersonaContext.Provider value={{ activePersona, setActivePersona }}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error("usePersona must be used within a PersonaProvider");
  }
  return context;
};