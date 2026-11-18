interface BrandLogoProps {
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ className = "", priority = false }: BrandLogoProps) {
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
      className={`h-auto object-contain select-none transition-transform duration-200 ${className}`}
    />
  );
}
