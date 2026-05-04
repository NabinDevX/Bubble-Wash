import React from "react";

export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-outline-variant/40 rounded-md ${className}`}
    ></div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-xl p-5 border border-outline-variant/30">
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="w-24 h-4 mb-2" />
      <Skeleton className="w-32 h-8" />
    </div>
  );
}

export function SkeletonTableRow({ columns = 6 }) {
  return (
    <tr className="border-t border-outline-variant/20">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Skeleton className="w-full h-4" />
        </td>
      ))}
    </tr>
  );
}
