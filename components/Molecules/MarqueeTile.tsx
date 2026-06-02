"use client";

import { useState, memo } from "react";
import Image from "next/image";
import { PUBLISHABLE_KEY } from "@/config/constants";

export const MarqueeTile = memo(function MarqueeTile({
  domain,
  bg,
}: {
  domain: string;
  bg: string;
}) {
  const [err, setErr] = useState(false);
  // size=64 is perfect for our 52px marquee display, reducing payload size by 4x
  const logoUrl = `https://img.logo.dev/${domain}?token=${PUBLISHABLE_KEY}&size=64&format=png`;
  const letter = domain[0].toUpperCase();

  return (
    <div className="logo-tile" style={{ background: bg }}>
      {!err ? (
        <Image
          src={logoUrl}
          alt={domain}
          width={52}
          height={52}
          onError={() => setErr(true)}
          unoptimized
        />
      ) : (
        <div className="logo-tile-fallback">{letter}</div>
      )}
    </div>
  );
});
