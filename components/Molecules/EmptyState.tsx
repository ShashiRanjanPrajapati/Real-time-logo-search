import { memo } from "react";
import { QUICK_SEARCHES } from "@/config/constants";

export const EmptyState = memo(function EmptyState({
  type,
  query,
  onQuickSearch,
}: {
  type: "idle" | "empty" | "error";
  query?: string;
  onQuickSearch: (q: string) => void;
}) {
  const config = {
    idle: {
      icon: "🔍",
      title: "Search for any brand",
      subtitle: "Type a brand name in the search bar above.",
    },
    empty: {
      icon: "🤷",
      title: `No results for "${query}"`,
      subtitle: "Try a different spelling or related brand name.",
    },
    error: {
      icon: "⚠️",
      title: "Something went wrong",
      subtitle: "Unable to reach the API. Check your connection and retry.",
    },
  };
  const c = config[type];

  return (
    <div className="state-container">
      <div className="state-icon">{c.icon}</div>
      <p className="state-title">{c.title}</p>
      <p className="state-subtitle">{c.subtitle}</p>
      {type === "idle" && (
        <div className="quick-picks">
          {QUICK_SEARCHES.map((q) => (
            <button
              key={q.label}
              className="quick-chip"
              onClick={() => onQuickSearch(q.label)}
              id={`quick-${q.label.toLowerCase()}`}
            >
              {q.emoji} {q.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
