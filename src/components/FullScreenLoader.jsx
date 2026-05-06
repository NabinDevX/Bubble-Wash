import { useEffect } from "react";
import PageLoader from "./PageLoader.jsx";

const fullScreenLoaderStyles = `
  @keyframes fade-in-loader {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fullscreen-loader-container {
    animation: fade-in-loader 0.3s ease-out;
  }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = fullScreenLoaderStyles;
  document.head.appendChild(style);
}

export default function FullScreenLoader({ title = "Loading…", subtitle }) {
  useEffect(() => {
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="app-green-gradient text-on-background font-body-md antialiased overflow-hidden flex h-screen w-full min-w-0">
      <div className="flex-1 flex items-center justify-center p-6 min-w-0">
        <div className="w-full max-w-xl fullscreen-loader-container">
          <PageLoader title={title} subtitle={subtitle ?? "Please wait"} />
        </div>
      </div>
    </div>
  );
}
