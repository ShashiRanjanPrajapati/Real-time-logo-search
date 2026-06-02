import { memo } from "react";
import { LogoCard } from "@/components/Molecules/LogoCard";
import { SkeletonGrid } from "@/components/Molecules/SkeletonGrid";
import { EmptyState } from "@/components/Molecules/EmptyState";
import type { LogoResult, SearchStrategy, SearchStatus } from "@/types/logo";

interface ResultsSectionProps {
  status: SearchStatus;
  query: string;
  results: LogoResult[];
  strategy: SearchStrategy;
  onStrategyChange: (s: SearchStrategy) => void;
  onQuickSearch: (q: string) => void;
  onToast: (msg: string) => void;
}

export const ResultsSection = memo(function ResultsSection({
  status,
  query,
  results,
  strategy,
  onStrategyChange,
  onQuickSearch,
  onToast,
}: ResultsSectionProps) {
  return (
    <div className="results-page">
      {/* Header row */}
      <div className="results-header">
        <h2 className="results-title">
          {status === "loading"
            ? "Searching…"
            : status === "success"
            ? <>Results for <span>&ldquo;{query}&rdquo;</span> — {results.length} found</>
            : null}
        </h2>

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
      </div>

      {status === "loading" && <SkeletonGrid count={12} />}

      {status === "success" && (
        <div className="logo-grid" role="list" aria-label="Logo results">
          {results.map((r, i) => (
            <LogoCard key={r.domain} result={r} index={i} onToast={onToast} />
          ))}
        </div>
      )}

      {(status === "empty" || status === "error") && (
        <EmptyState type={status} query={query} onQuickSearch={onQuickSearch} />
      )}
    </div>
  );
});
