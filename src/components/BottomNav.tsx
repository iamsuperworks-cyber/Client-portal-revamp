import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, PenLine, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpload } from "@/contexts/UploadContext";
import { useWelcomeState } from "@/contexts/WelcomeStateContext";

const navItems = [
  { label: "Home", icon: Home, paths: ["/"], route: "/" },
  { label: "Documents", icon: FileText, paths: ["/upload"], route: "/upload", dotKey: "documents" as const },
  { label: "Signatures", icon: PenLine, paths: ["/sign"], route: "/sign", dotKey: "sign" as const },
  { label: "Profile", icon: User, paths: ["/account"], route: "/account" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasUploaded } = useUpload();
  const { showDocsDot, showSignDot } = useWelcomeState();

  const isActive = (paths: string[]) => paths.some((p) => location.pathname === p);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border">
      <div className="flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const active = isActive(item.paths);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              data-tour={item.dotKey === "documents" ? "documents-nav" : undefined}
              className="relative flex flex-col items-center gap-1 flex-1 py-3 min-w-0"
            >
              <div className="relative">
                <item.icon
                  className={cn(
                    "h-[22px] w-[22px] transition-colors",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                />
                {item.dotKey === "documents" && hasUploaded && showDocsDot && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.5)]" />
                )}
                {item.dotKey === "sign" && hasUploaded && showSignDot && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.5)]" />
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium leading-none transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-b-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
