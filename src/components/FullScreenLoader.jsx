import PageLoader from "./PageLoader.jsx";

export default function FullScreenLoader({ title }) {
  return (
    <div className="app-green-gradient text-on-background font-body-md antialiased overflow-hidden flex h-screen w-full">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <PageLoader title={title ?? "Loading…"} />
        </div>
      </div>
    </div>
  );
}
