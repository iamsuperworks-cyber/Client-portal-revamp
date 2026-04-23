import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as ToasterSonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UploadProvider } from "./contexts/UploadContext";
import { WelcomeStateProvider } from "./contexts/WelcomeStateContext";
import { PersonaProvider } from "./contexts/PersonaContext";
import { QueriesProvider } from "./contexts/QueriesContext";
import AppSidebar from "./components/AppSidebar";
import BottomNav from "./components/BottomNav";
import TopBar from "./components/TopBar";
import ProductTour from "./components/ProductTour";
import AccountSettings from "./pages/AccountSettings.tsx";
import Index from "./pages/Index.tsx";
import WelcomeHome from "./pages/WelcomeHome.tsx";
import UploadDocuments from "./pages/UploadDocuments.tsx";
import BankList from "./pages/BankList.tsx";
import ApplicationTracking from "./pages/ApplicationTracking.tsx";
import DocumentsToSign from "./pages/DocumentsToSign.tsx";
import NotFound from "./pages/NotFound.tsx";
import HomePage from "./pages/HomePage.tsx";
import Login from "./pages/Login.tsx";
import VerifyOtp from "./pages/VerifyOtp.tsx";
import QueryDetail from "./pages/QueryDetail.tsx";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const queryClient = new QueryClient();

const AppLayout = () => {
  const isAuthenticated = sessionStorage.getItem("authenticated");
  const location = useLocation();

  if (!isAuthenticated) {
    sessionStorage.setItem("redirectPath", location.pathname);
    return <Navigate to="/login" replace />;
  }
  const isHome = location.pathname === "/";
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 relative md:ml-[220px]">
        <TopBar />
        <div className="pb-20 md:pb-0">
          <Outlet />
        </div>
      </div>
      <BottomNav />
      {isHome && <ProductTour />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <ToasterSonner />
      <UploadProvider>
        <WelcomeStateProvider>
          <PersonaProvider>
            <QueriesProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/verify" element={<VerifyOtp />} />
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/upload" element={<UploadDocuments />} />
                    <Route path="/banks" element={<BankList />} />
                    <Route path="/track" element={<ApplicationTracking />} />
                    <Route path="/sign" element={<DocumentsToSign />} />
                    <Route path="/account" element={<AccountSettings />} />
                    <Route path="/queries/:queryId" element={<QueryDetail />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </QueriesProvider>
          </PersonaProvider>
        </WelcomeStateProvider>
      </UploadProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
