import { useEffect, useRef, useState } from 'react';

/**
 * usePullToRefresh — pull down to refresh, mobile-style.
 * Returns { pulling, pullDistance } for UI feedback.
 */
export function usePullToRefresh(onRefresh: () => Promise<void> | void) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const refreshing = useRef(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0 && !refreshing.current) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY !== 0 || refreshing.current || startY.current === 0) return;
      const distance = e.touches[0].clientY - startY.current;
      if (distance > 0 && distance < 150) {
        setPullDistance(distance);
        if (distance > 60) setPulling(true);
      }
    };

    const handleTouchEnd = async () => {
      if (pulling && !refreshing.current) {
        refreshing.current = true;
        setPulling(false);
        try {
          await onRefresh();
        } finally {
          refreshing.current = false;
          setPullDistance(0);
          startY.current = 0;
        }
      } else {
        setPullDistance(0);
        setPulling(false);
        startY.current = 0;
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pulling, onRefresh]);

  return { pulling, pullDistance, refreshing: refreshing.current };
}
