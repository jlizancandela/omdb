import { useCallback, useEffect, useRef } from "react";

const emptyOptions: IntersectionObserverInit = {};

export function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = emptyOptions
) {
  const observer = useRef<IntersectionObserver | null>(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      if (node) {
        observer.current = new IntersectionObserver((entries) => {
          const entry = entries[0];
          if (entry) {
            savedCallback.current(entry);
          }
        }, options);
        observer.current.observe(node);
      }
    },
    [options]
  );

  return ref;
}
