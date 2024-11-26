import { InfiniteQueryObserverResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

interface IntersectionObserverParams {
  threshold?: number;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<InfiniteQueryObserverResult>;
}
const useIntersectionObserver = ({
  threshold = 0.5,
  hasNextPage,
  fetchNextPage,
}: IntersectionObserverParams) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
    };

    if (!ref.current) return;

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, threshold, fetchNextPage, hasNextPage]);

  return { ref };
};

export default useIntersectionObserver;
