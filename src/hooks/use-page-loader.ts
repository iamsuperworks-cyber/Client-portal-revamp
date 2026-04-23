import { useState, useEffect } from "react";

export const usePageLoader = (duration = 500) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return isLoading;
};
