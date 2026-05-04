import { createContext, useContext, useState, useEffect, useRef } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState("Loading…");
  const [loadingSubtitle, setLoadingSubtitle] = useState("Please wait");
  const loadingTimeoutRef = useRef(null);

  const startLoading = (title = "Loading…", subtitle = "Please wait") => {
    setLoadingTitle(title);
    setLoadingSubtitle(subtitle);
    setIsLoading(true);

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    document.documentElement.style.overflow = "hidden";
  };

  const stopLoading = (delayMs = 300) => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      document.documentElement.style.overflow = "";
    }, delayMs);
  };

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingTitle,
        loadingSubtitle,
        startLoading,
        stopLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}
