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
  const [downloadState, setDownloadState] = useState<"idle" | "downloading" | "success">("idle");

  // size=64 is perfect for our 46px layout, reducing payload size by 4x
  const logoUrl = `https://img.logo.dev/${result.domain}?token=${PUBLISHABLE_KEY}&size=64&format=png`;

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setDownloadState("downloading");
      onToast("Downloading logo...");

      const res = await fetch(`/api/logodownload?domain=${result.domain}&name=${encodeURIComponent(result.name)}`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-logo.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setDownloadState("success");
      onToast("Logo downloaded!");
    } catch {
      onToast("Failed to download");
      setDownloadState("idle");
    }
  };

  // Prevent memory leaks by cleaning up download state timeout on unmount
  useEffect(() => {
    if (downloadState === "success") {
      const timer = setTimeout(() => setDownloadState("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [downloadState]);

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
          className={`action-btn ${downloadState === "success" ? "copied" : ""}`}
          onClick={handleDownload}
          disabled={downloadState === "downloading"}
          id={`download-btn-${result.domain.replace(/\./g, "-")}`}
        >
          {downloadState === "downloading" ? (
            "⏳ Loading…"
          ) : downloadState === "success" ? (
            "✓ Downloaded"
          ) : (
            <>↓ Download</>
          )}
        </button>
        <button className="action-btn" onClick={handleVisit}>
          ↗ Visit
        </button>
      </div>
    </a>
  );
});
