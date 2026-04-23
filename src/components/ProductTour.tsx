import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowDown, ArrowUp, ArrowRight, MousePointerClick } from "lucide-react";

type Placement = "top" | "bottom" | "right";

interface TourStep {
  targetSelector: string;
  title: string;
  description: string;
  preferredPlacement: Placement;
}

const steps: TourStep[] = [
  {
    targetSelector: '[data-tour="profile-btn"]',
    title: "Start with your profile",
    description:
      "Complete your profile so we can match you with the best banks and build your personal document checklist.",
    preferredPlacement: "bottom",
  },
  {
    targetSelector: '[data-tour="documents-nav"]',
    title: "Submit your documents",
    description:
      "Upload your mortgage data and documents here. Once done, you'll be able to view the status of your mortgage.",
    preferredPlacement: "right",
  },
];

const findVisibleTarget = (selector: string): HTMLElement | null => {
  const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
  return (
    els.find((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }) || null
  );
};

const ProductTour = () => {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(false);
  const [viewport, setViewport] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 1024,
    h: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const update = () => {
      const target = findVisibleTarget(steps[step].targetSelector);
      if (target) {
        const r = target.getBoundingClientRect();
        const inView = r.top < window.innerHeight && r.bottom > 0;
        if (!inView) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setRect(r);
      } else {
        setRect(null);
      }
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };

    update();
    const interval = setInterval(update, 150);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [visible, step]);

  const finishTour = () => {
    setVisible(false);
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else finishTour();
  };

  if (!visible || !rect) return null;

  const current = steps[step];
  const isMobile = viewport.w < 768;
  const pad = 6;
  const targetRadius = 12;

  const highlight = {
    top: rect.top - pad,
    left: rect.left - pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };

  const TIP_W = isMobile ? Math.min(viewport.w - 32, 320) : 300;
  const TIP_GAP = 24;
  const EDGE = 12;

  let placement: Placement = current.preferredPlacement;
  if (isMobile) {
    const spaceBelow = viewport.h - rect.bottom;
    const spaceAbove = rect.top;
    placement = spaceBelow >= 200 || spaceBelow >= spaceAbove ? "bottom" : "top";
  } else if (placement === "right") {
    const spaceRight = viewport.w - rect.right;
    if (spaceRight < TIP_W + TIP_GAP) placement = "bottom";
  }

  let tipTop = 0;
  let tipLeft = 0;
  let arrowDir: "up" | "down" | "left" | "right" = "up";

  if (placement === "bottom") {
    tipTop = rect.bottom + TIP_GAP;
    tipLeft = rect.left + rect.width / 2 - TIP_W / 2;
    arrowDir = "up";
  } else if (placement === "top") {
    tipTop = rect.top - TIP_GAP;
    tipLeft = rect.left + rect.width / 2 - TIP_W / 2;
    arrowDir = "down";
  } else {
    tipTop = rect.top + rect.height / 2 - 60;
    tipLeft = rect.right + TIP_GAP;
    arrowDir = "left";
  }

  tipLeft = Math.max(EDGE, Math.min(tipLeft, viewport.w - TIP_W - EDGE));
  tipTop = Math.max(EDGE, Math.min(tipTop, viewport.h - 200));

  const arrowColor = "hsl(var(--primary))";

  const renderArrow = () => {
    const base = "absolute pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]";
    if (arrowDir === "up") {
      return (
        <div
          className={`${base} animate-tour-bounce-y`}
          style={{
            top: rect.bottom + 6,
            left: rect.left + rect.width / 2 - 14,
          }}
        >
          <ArrowUp className="h-7 w-7" style={{ color: arrowColor }} strokeWidth={3} />
        </div>
      );
    }
    if (arrowDir === "down") {
      return (
        <div
          className={`${base} animate-tour-bounce-y`}
          style={{
            top: rect.top - 34,
            left: rect.left + rect.width / 2 - 14,
          }}
        >
          <ArrowDown className="h-7 w-7" style={{ color: arrowColor }} strokeWidth={3} />
        </div>
      );
    }
    return (
      <div
        className={`${base} animate-tour-bounce-x`}
        style={{
          top: rect.top + rect.height / 2 - 14,
          left: rect.right + 6,
        }}
      >
        <ArrowRight
          className="h-7 w-7 -scale-x-100"
          style={{ color: arrowColor }}
          strokeWidth={3}
        />
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[70]">
      {/* Spotlight — dark everywhere except the target area */}
      <div
        className="absolute rounded-xl pointer-events-none transition-all duration-300"
        style={{
          top: highlight.top,
          left: highlight.left,
          width: highlight.width,
          height: highlight.height,
          borderRadius: targetRadius,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.65)",
        }}
      />

      {/* Pulsing ring around target */}
      <div
        className="absolute pointer-events-none animate-tour-ring"
        style={{
          top: highlight.top - 3,
          left: highlight.left - 3,
          width: highlight.width + 6,
          height: highlight.height + 6,
          borderRadius: targetRadius + 3,
          border: `2px solid ${arrowColor}`,
          boxShadow: `0 0 24px 2px ${arrowColor}55`,
        }}
      />

      {/* Static ring (sharper accent) */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: highlight.top,
          left: highlight.left,
          width: highlight.width,
          height: highlight.height,
          borderRadius: targetRadius,
          border: `2px solid ${arrowColor}`,
        }}
      />

      {/* Click-blocker overlay (catches clicks outside target but lets target be clicked) */}
      <div className="absolute inset-0 pointer-events-auto" onClick={finishTour} />

      {/* Arrow */}
      {renderArrow()}

      {/* Tooltip */}
      <div
        className="absolute bg-card border border-border rounded-lg shadow-2xl p-5 pointer-events-auto animate-fade-in"
        style={{ top: tipTop, left: tipLeft, width: TIP_W }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={finishTour}
          className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close tour"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
            <MousePointerClick className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            Step {step + 1} of {steps.length}
          </p>
        </div>

        <h3 className="font-heading text-base font-bold text-foreground mb-1.5">
          {current.title}
        </h3>
        <p className="font-body text-xs text-muted-foreground leading-relaxed mb-4">
          {current.description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={finishTour}
            className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
          <button
            onClick={handleNext}
            className="font-body text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm px-4 py-2 transition-colors"
          >
            {step < steps.length - 1 ? "Next" : "Got it"}
          </button>
        </div>

        <div className="flex items-center gap-1 mt-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === step ? "bg-primary w-6" : "bg-border w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductTour;
