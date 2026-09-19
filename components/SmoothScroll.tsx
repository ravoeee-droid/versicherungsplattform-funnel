"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.085, duration: 1.15, smoothWheel: true, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
