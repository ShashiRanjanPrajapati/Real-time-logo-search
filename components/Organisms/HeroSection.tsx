import { memo } from "react";
import { MarqueeRow } from "@/components/Molecules/MarqueeRow";
import { MARQUEE_ROW1, MARQUEE_ROW2, MARQUEE_ROW3 } from "@/config/constants";

interface HeroSectionProps {
  onSearchFocus: () => void;
  onQuickSearch: (q: string) => void;
}

export const HeroSection = memo(function HeroSection({
  onSearchFocus,
  onQuickSearch,
}: HeroSectionProps) {
  return (
    <>
      <section className="hero pt-10!">
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

        <h1 className="text-[50px] font-bold leading-15">
          Brand Logo Search
          <br />
          from Real Companies
        </h1>
        <p className="hero-subtitle pb-6!">
          Find high-quality logos for any brand instantly. Copy CDN URLs, <br />{" "}
          visit company sites, and integrate logos directly into your projects.
        </p>

        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={onSearchFocus}
            id="hero-search-cta"
          >
            Search Logos
          </button>
          <button
            className="btn-secondary"
            onClick={() => onQuickSearch("Google")}
            id="hero-explore-cta"
          >
            Explore Brands
          </button>
        </div>
      </section>

      {/* Marquee */}
      <section
        className="marquee-section mt-10!"
        aria-label="Sample brand logos"
      >
        <MarqueeRow items={MARQUEE_ROW1} />
        <MarqueeRow items={MARQUEE_ROW2} reverse />
        <MarqueeRow items={MARQUEE_ROW3} />
      </section>
    </>
  );
});
