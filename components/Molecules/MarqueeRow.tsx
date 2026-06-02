"use client";

import { memo } from "react";
import Marquee from "react-fast-marquee";
import { MarqueeTile } from "./MarqueeTile";

type MarqueeItem = { domain: string; bg: string };

export const MarqueeRow = memo(function MarqueeRow({
  items,
  reverse = false,
}: {
  items: MarqueeItem[];
  reverse?: boolean;
}) {
  return (
    <div className="marquee-row">
      <Marquee
        speed={45}
        gradient={false}
        pauseOnHover
        loop={0}
        autoFill
        direction={reverse ? "right" : "left"}
      >
        {items.map((item, i) => (
          <div key={`${item.domain}-${i}`} style={{ marginRight: "14px" }}>
            <MarqueeTile domain={item.domain} bg={item.bg} />
          </div>
        ))}
      </Marquee>
    </div>
  );
});
