import { memo } from "react";
import { SearchIcon } from "@/components/Atom/SearchIcon";
import { QUICK_SEARCHES } from "@/config/constants";
import type { SearchStatus } from "@/types/logo";

interface HeroSectionProps {
  query: string;
  status: SearchStatus;
  onQueryChange: (q: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  onQuickSearch: (q: string) => void;
}

export const HeroSection = memo(function HeroSection({
  query,
  status,
  onQueryChange,
  onSubmit,
  onClear,
  onQuickSearch,
}: HeroSectionProps) {
  return (
    <>
      <section className="hero h-[80vh] flex flex-col justify-center items-center">
        {/* Social proof */}
        <div className="hero-social-proof">
          <div className="hero-avatars" aria-hidden>
            <div className="hero-avatar">🧑</div>
            <div className="hero-avatar">👩</div>
            <div className="hero-avatar">🧑‍💻</div>
          </div>
          <p className="hero-proof-text">
            Trusted by over <strong>100,000+</strong> developers worldwide
          </p>
        </div>

        <h1 className="text-[50px] font-semibold leading-15">
          Brand Logo Search
          <br />
          from <span className="text-[#F5C518]">Real Companies</span>
        </h1>
        <p className="hero-subtitle pb-6!">
          Find high-quality logos for any brand instantly. Copy CDN URLs, <br />{" "}
          visit company sites, and integrate logos directly into your projects.
        </p>

        {/* Centered Search Bar */}
        <form
          onSubmit={onSubmit}
          className="w-full max-w-[540px] mt-4 mx-auto relative"
          role="search"
        >
          <div className="group w-full flex items-center bg-[#1c1c1c] border border-white/8 rounded-full px-4! gap-2.5 h-12 transition-all duration-200 hover:border-white/16 hover:bg-[#222222] focus-within:border-[#f5c518]/50">
            <input
              id="hero-search-input"
              type="search"
              className="flex-1 bg-transparent border-none outline-none text-[0.95rem] text-white caret-[#f5c518] min-w-0 placeholder-[#555]"
              placeholder="Search brand logos, companies…"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              autoComplete="off"
              aria-label="Search for a brand logo"
              autoFocus
            />
            {query && (
              <button
                type="button"
                className="bg-none border-none cursor-pointer text-[#555] text-[0.8rem] px-1.5 py-0.5 rounded-full flex items-center transition-colors hover:text-[#aaa]"
                onClick={onClear}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="bg-none border-none cursor-pointer text-[#888] flex items-center p-1.5 border-l border-white/8 ml-1 transition-colors hover:text-[#f5c518] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              disabled={status === "loading" || !query.trim()}
              id="hero-search-submit-btn"
              aria-label="Search"
            >
              <SearchIcon size={18} />
            </button>
          </div>
        </form>

        {/* Popular Quick-searches below Search Bar */}
        <div className="flex items-center justify-center flex-wrap gap-2 mt-10!">
          <span className="text-[0.8rem] text-[#555] font-semibold mr-1">
            Popular:
          </span>
          {QUICK_SEARCHES.map((q) => (
            <button
              key={q.label}
              className="px-3! py-1.5! rounded-full border border-white/6 bg-[#1a1a1a] text-[12px] font-medium text-[#888] cursor-pointer transition-all hover:border-[#f5c518]/30 hover:text-[#f5c518] hover:bg-[#f5c518]/4 hover:translate-y-[-0.5px] flex items-center gap-1.25"
              onClick={() => onQuickSearch(q.label)}
              id={`hero-quick-${q.label.toLowerCase()}`}
            >
              {q.emoji} {q.label}
            </button>
          ))}
        </div>
      </section>

      {/* Marquee */}
      {/* <section
        className="marquee-section mt-10!"
        aria-label="Sample brand logos"
      >
        <MarqueeRow items={MARQUEE_ROW1} />
        <MarqueeRow items={MARQUEE_ROW2} reverse />
        <MarqueeRow items={MARQUEE_ROW3} />
      </section> */}
    </>
  );
});
