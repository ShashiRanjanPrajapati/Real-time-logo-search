"use client";

import { memo, useState } from "react";
import { LogoCard } from "@/components/Molecules/LogoCard";
import { SkeletonGrid } from "@/components/Molecules/SkeletonGrid";
import { EmptyState } from "@/components/Molecules/EmptyState";
import type { LogoResult, SearchStrategy, SearchStatus } from "@/types/logo";

type ViewMode = "grid" | "list";

interface ResultsSectionProps {
  status: SearchStatus;
  query: string;
  results: LogoResult[];
  strategy: SearchStrategy;
  onStrategyChange: (s: SearchStrategy) => void;
  onQuickSearch: (q: string) => void;
  onToast: (msg: string) => void;
}

const GridIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" fill="currentColor" />
    <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" fill="currentColor" />
    <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" />
    <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" />
  </svg>
);

const ListIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <rect x="1" y="2" width="13" height="2.2" rx="1.1" fill="currentColor" />
    <rect x="1" y="6.4" width="13" height="2.2" rx="1.1" fill="currentColor" />
    <rect x="1" y="10.8" width="13" height="2.2" rx="1.1" fill="currentColor" />
  </svg>
);

export const ResultsSection = memo(function ResultsSection({
  status,
  query,
  results,
  strategy,
  onStrategyChange,
  onQuickSearch,
  onToast,
}: ResultsSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <div className="results-page">
      {/* Header row */}
      <div className="results-header">
        <h2 className="results-title">
          {status === "loading" ? (
            "Searching…"
          ) : status === "success" ? (
            <>
              Results for <span>&ldquo;{query}&rdquo;</span> — {results.length}{" "}
              found
            </>
          ) : null}
        </h2>

        <div className="results-controls">
          {/* Strategy toggle */}
          <div className="strategy-toggle" role="group" aria-label="Search mode">
            {(["suggest", "match"] as const).map((s) => (
              <button
                key={s}
                className={`strategy-option ${strategy === s ? "active" : ""}`}
                onClick={() => onStrategyChange(s)}
                id={`strategy-${s}`}
                aria-pressed={strategy === s}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              id="view-grid"
              aria-pressed={viewMode === "grid"}
              title="Grid view"
            >
              <GridIcon />
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              id="view-list"
              aria-pressed={viewMode === "list"}
              title="List view"
            >
              <ListIcon />
            </button>
          </div>
        </div>
      </div>

      {status === "loading" && <SkeletonGrid count={12} />}

      {status === "success" && (
        <div
          className={viewMode === "grid" ? "grid grid-cols-5 gap-4" : "logo-list"}
          role="list"
          aria-label="Logo results"
        >
          {results.map((r, i) => (
            <LogoCard
              key={r.domain}
              result={r}
              index={i}
              onToast={onToast}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {(status === "empty" || status === "error") && (
        <EmptyState type={status} query={query} onQuickSearch={onQuickSearch} />
      )}
    </div>
  );
});
