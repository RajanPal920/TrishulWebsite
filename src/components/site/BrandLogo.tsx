import React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

export function BrandLogo({ className = "", priority = false, style }: BrandLogoProps) {
  return (
    <img
      src="/trishul-logo-transparent.png?v=2"
      onError={(e) => {
        const target = e.currentTarget;
        if (!target.dataset["fallback"]) {
          target.dataset["fallback"] = "true";
          target.src = "/trishul-logo.png?v=2";
        }
      }}
      alt="Trishul Metals & Alloys — Sourcing & Procurement Solutions"
      width={423}
      height={143}
      fetchPriority={priority ? "high" : "auto"}
      style={style}
      className={cn("h-auto w-auto object-contain select-none transition-transform duration-200", className)}
    />
  );
}
