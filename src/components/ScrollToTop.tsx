import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '../lib/lenis';

/** Scroll to top on route (pathname) change; hash links are handled per-page. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (!hash) {
      const resetScroll = () => {
        window.scrollTo(0, 0);
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;

        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        }
      };

      // 1. Scroll immediately
      resetScroll();

      // 2. Scroll on the next two animation frames (after React commits updates)
      const frameId = requestAnimationFrame(() => {
        resetScroll();
        requestAnimationFrame(resetScroll);
      });

      // 3. Scroll after a tiny timeout as a final safety net for slower updates
      const timerId = setTimeout(resetScroll, 50);

      return () => {
        cancelAnimationFrame(frameId);
        clearTimeout(timerId);
      };
    }
  }, [pathname, hash]);
  
  return null;
}

