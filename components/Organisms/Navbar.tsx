"use client";

import { memo } from "react";
import Link from "next/link";
import { SearchIcon } from "@/components/Atom/SearchIcon";
import type { SearchStrategy, SearchStatus } from "@/types/logo";

interface NavbarProps {
  query: string;
  strategy: SearchStrategy;
  status: SearchStatus;
  onQueryChange: (q: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  onStrategyChange: (s: SearchStrategy) => void;
  onQuickSearch: (q: string) => void;
  isResultsView: boolean;
}

export const Navbar = memo(function Navbar({
  query,
  strategy,
  status,
  onQueryChange,
  onSubmit,
  onClear,
  onStrategyChange,
  onQuickSearch,
  isResultsView,
}: NavbarProps) {
  return (
    <nav className="navbar flex w-full justify-between">
      {/* Brand */}
      <Link
        href="/"
        className="nav-brand"
        onClick={onClear}
        aria-label="LogoSearch home"
      >
        <div className="nav-brand-icon">L</div>
        <span className="nav-brand-name">LogoSearch</span>
      </Link>

      {/* Search */}
      {isResultsView && (
        <form onSubmit={onSubmit} className="nav-search-form" role="search">
          <div className="nav-search-wrapper">
            <SearchIcon className="nav-search-icon" size={15} />
            <input
              id="logo-search-input"
              type="search"
              className="nav-search-input"
              placeholder="Search brand logos, companies…"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              autoComplete="off"
              aria-label="Search for a brand logo"
            />

            <button
              type="submit"
              className="nav-search-btn"
              disabled={status === "loading" || !query.trim()}
              id="search-submit-btn"
              aria-label="Search"
            >
              <SearchIcon size={15} />
            </button>
          </div>
        </form>
      )}

      {/* Tabs */}
      {isResultsView && (
        <div className="nav-tabs" role="tablist">
          {(["Suggest", "Match"] as const).map((tab) => {
            const val = tab.toLowerCase() as SearchStrategy;
            return (
              <button
                key={tab}
                className={`nav-tab ${strategy === val ? "active" : ""}`}
                role="tab"
                aria-selected={strategy === val}
                id={`tab-${val}`}
                onClick={() => onStrategyChange(val)}
              >
                {tab}
              </button>
            );
          })}
        </div>
      )}

      {/* Right */}
      <div className="nav-right">
        <button className="nav-login">API Docs</button>
        <button className="nav-cta" onClick={() => onQuickSearch("Stripe")}>
          Try it Free
        </button>
      </div>
    </nav>
  );
});
