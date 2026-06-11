import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '../lib/lenis';

/** Scroll to top on route (pathname) change; hash links are handled per-page. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    if (!hash) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash]);
  
  return null;
}
