import { useCallback, useEffect, useRef } from 'react';

// [코드 11] IntersectionObserver custom hook
export type IntersectHandler = (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;

export const useIntersect = (onIntersect: IntersectHandler, options?: IntersectionObserverInit) => {
  console.log('useIntersect');
  const ref = useRef<HTMLDivElement>(null);
  const callback = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) onIntersect(entry, observer);
      });
    },
    [onIntersect]
  );

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(callback, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options, callback]);

  return ref;
};