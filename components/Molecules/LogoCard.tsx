"use client";

import { useState, useEffect, memo } from "react";
import Image from "next/image";
import { PUBLISHABLE_KEY } from "@/config/constants";
import type { LogoResult } from "@/types/logo";

export const LogoCard = memo(function LogoCard({
  result,
  index,
  onToast,
}: {
  result: LogoResult;
  index: number;
  onToast: (msg: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  // size=64 is perfect for our 46px layout, reducing payload size by 4x
  const logoUrl = `https://img.logo.dev/${result.domain}?token=${PUBLISHABLE_KEY}&size=64&format=png`;

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(logoUrl);
      setCopyState("copied");
      onToast("Logo URL copied!");
    } catch {
      onToast("Failed to copy");
    }
  };

  // Prevent memory leaks by cleaning up copy state timeout on unmount
  useEffect(() => {
    if (copyState === "copied") {
      const timer = setTimeout(() => setCopyState("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyState]);

  const handleVisit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://${result.domain}`, "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={`https://${result.domain}`}
      target="_blank"
      rel="noopener noreferrer"
      className="logo-card"
      style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
      aria-label={`${result.name} — ${result.domain}`}
    >
      <div className="logo-img-wrapper">
        {!imgError ? (
          <Image
            src={logoUrl}
            alt={`${result.name} logo`}
            className="logo-img"
            width={46}
            height={46}
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="logo-fallback">{result.name?.[0] ?? "?"}</div>
        )}
      </div>

      <div style={{ textAlign: "center", width: "100%" }}>
        <p className="logo-card-name">{result.name}</p>
        <p className="logo-card-domain">{result.domain}</p>
      </div>

      <div className="logo-card-actions">
        <button
          className={`action-btn ${copyState === "copied" ? "copied" : ""}`}
          onClick={handleCopyUrl}
          id={`copy-btn-${result.domain.replace(/\./g, "-")}`}
        >
          {copyState === "copied" ? "✓ Copied" : "⧉ Copy"}
        </button>
        <button className="action-btn" onClick={handleVisit}>
          ↗ Visit
        </button>
      </div>
    </a>
  );
});
