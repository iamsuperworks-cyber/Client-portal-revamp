import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpload } from "@/contexts/UploadContext";
import { usePageLoader } from "@/hooks/use-page-loader";
import WelcomeHomeSkeleton from "@/components/skeletons/WelcomeHomeSkeleton";
import Index from "./Index";
import WelcomeHome from "./WelcomeHome";
import CompleteProfile from "./CompleteProfile";

const HomePage = () => {
  const isLoading = usePageLoader();
  const navigate = useNavigate();
  const { hasUploaded } = useUpload();
  const [profileCompleted, setProfileCompleted] = useState(() => {
    return sessionStorage.getItem("profileCompleted") === "true";
  });
  
  // Track the current step in the initial flow
  const [currentStep, setCurrentStep] = useState<'banks' | 'profile'>('banks');

  if (isLoading) return <WelcomeHomeSkeleton />;

  // If profile is completed, show the main dashboard
  if (profileCompleted) {
    return <WelcomeHome />;
  }

  // If they haven't completed profile yet, run the indexed flow
  if (!profileCompleted) {
    if (currentStep === 'banks') {
      return (
        <Index 
          isInitialFlow 
          onNext={() => setCurrentStep('profile')} 
        />
      );
    }
    
    return (
      <CompleteProfile 
        onComplete={() => {
          sessionStorage.setItem("profileCompleted", "true");
          setProfileCompleted(true);
          navigate("/upload");
        }} 
      />
    );
  }

  // Default fallback (should effectively be caught by the step logic above)
  return <Index isInitialFlow onNext={() => setCurrentStep('profile')} />;
};

export default HomePage;
