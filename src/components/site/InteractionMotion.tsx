import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState, type PointerEvent, type ReactNode } from "react";

export function useHydrationSafeReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduceMotion;
}

export function MagneticAction({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useHydrationSafeReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 320, damping: 24, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 320, damping: 24, mass: 0.35 });

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const followPointer = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
    const relativeY = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);
    rawX.set(Math.max(-12, Math.min(12, relativeX * 12)));
    rawY.set(Math.max(-12, Math.min(12, relativeY * 12)));
  };

  return (
    <motion.span
      className={`magnetic-action inline-flex max-w-full ${className}`}
      {...(reduceMotion ? {} : { style: { x, y } })}
      onPointerMove={followPointer}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </motion.span>
  );
}

export function ResultTransition({ transitionKey, children }: { transitionKey: string; children: ReactNode }) {
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <motion.div
      key={transitionKey}
      initial={reduceMotion ? false : { opacity: 0.35, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function MotionDisclosure({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      {...(reduceMotion ? {} : { exit: { height: 0, opacity: 0 } })}
      transition={{ duration: reduceMotion ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function MotionListItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <motion.div
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      {...(reduceMotion ? {} : { exit: { opacity: 0, y: -6, height: 0 } })}
      transition={{ duration: reduceMotion ? 0.01 : 0.26, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={className}>{children}</div>
    </motion.div>
  );
}