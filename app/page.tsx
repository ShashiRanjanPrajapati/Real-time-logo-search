"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Navbar } from "@/components/Organisms/Navbar";
import { HeroSection } from "@/components/Organisms/HeroSection";
import { ResultsSection } from "@/components/Organisms/ResultsSection";
import { Toast } from "@/components/Atom/Toast";
import type { LogoResult, SearchStrategy, SearchStatus } from "@/types/logo";

export default function Home() {
  const [query, setQuery] = useState("");
  const [strategy, setStrategy] = useState<SearchStrategy>("suggest");
  const [results, setResults] = useState<LogoResult[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cacheRef = useRef<Map<string, { results: LogoResult[]; status: SearchStatus }>>(new Map());

  // Keep a ref to the current strategy to avoid re-creating handlers when strategy changes
  const strategyRef = useRef<SearchStrategy>(strategy);
  useEffect(() => {
    strategyRef.current = strategy;
  }, [strategy]);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMsg(msg);
    setToastVisible(true);
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
      toastTimeoutRef.current = null;
    }, 2500);
  }, []);

  const search = useCallback(
    async (q: string, strat: SearchStrategy, immediate = false) => {
      // Clear any pending debounced search timer
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }

      const trimmed = q.trim();
      if (!trimmed) {
        // Abort any in-flight request if query is cleared
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        setResults([]);
        setStatus("idle");
        return;
      }

      // Check client-side cache first
      const cacheKey = `${trimmed.toLowerCase()}_${strat}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        // Abort any in-flight request as cache hit takes precedence
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        setResults(cached.results);
        setStatus(cached.status);
        return;
      }

      const executeFetch = async () => {
        // Abort previous request before firing new fetch
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setStatus("loading");
        try {
          const res = await fetch(
            `/api/logosearch?q=${encodeURIComponent(trimmed)}&strategy=${strat}`,
            { signal: controller.signal },
          );
          if (!res.ok) {
            setStatus("error");
            return;
          }
          const data: LogoResult[] = await res.json();
          const finalStatus: SearchStatus =
            !Array.isArray(data) || data.length === 0 ? "empty" : "success";
          const finalResults = Array.isArray(data) ? data : [];

          // Cache results
          cacheRef.current.set(cacheKey, { results: finalResults, status: finalStatus });

          setResults(finalResults);
          setStatus(finalStatus);
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            // Ignored, request was aborted intentionally
          } else {
            setStatus("error");
          }
        } finally {
          if (abortControllerRef.current === controller) {
            abortControllerRef.current = null;
          }
        }
      };

      if (immediate) {
        await executeFetch();
      } else {
        searchTimeoutRef.current = setTimeout(executeFetch, 350);
      }
    },
    [],
  );

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      search(newQuery, strategyRef.current, false);
    },
    [search],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      search(query, strategyRef.current, true);
    },
    [query, search],
  );

  const handleQuickSearch = useCallback(
    (q: string) => {
      setQuery(q);
      search(q, strategyRef.current, true);
    },
    [search],
  );

  const handleStrategyChange = useCallback(
    (s: SearchStrategy) => {
      setStrategy(s);
      if (query.trim()) {
        search(query, s, true);
      }
    },
    [query, search],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    search("", strategyRef.current, true);
  }, [search]);

  const handleSearchFocus = useCallback(() => {
    const input = document.getElementById("logo-search-input") as HTMLInputElement;
    input?.focus();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const isResultsView =
    status === "loading" || status === "success" || status === "empty" || status === "error";

  return (
    <>
      <Navbar
        query={query}
        strategy={strategy}
        status={status}
        onQueryChange={handleQueryChange}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onStrategyChange={handleStrategyChange}
        onQuickSearch={handleQuickSearch}
      />

      {!isResultsView && (
        <HeroSection
          onSearchFocus={handleSearchFocus}
          onQuickSearch={handleQuickSearch}
        />
      )}

      {isResultsView && (
        <ResultsSection
          status={status}
          query={query}
          results={results}
          strategy={strategy}
          onStrategyChange={handleStrategyChange}
          onQuickSearch={handleQuickSearch}
          onToast={showToast}
        />
      )}

      <Toast message={toastMsg} visible={toastVisible} />
    </>
  );
}
