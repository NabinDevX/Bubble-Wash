import { useEffect } from "react";
import Lenis from "lenis";

export default function useLenisScroll({ wrapperRef, contentRef, enabled }) {
  useEffect(() => {
    if (enabled === false) return;
    const wrapper = wrapperRef?.current;
    const content = contentRef?.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      syncTouch: true,
    });

    let rafId = 0;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [contentRef, enabled, wrapperRef]);
}
