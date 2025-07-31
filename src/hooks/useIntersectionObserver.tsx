import { useCallback, useEffect, useRef } from "react";

export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
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
          if (entries[0].isIntersecting) {
            savedCallback.current();
          }
        }, options);
        observer.current.observe(node);
      }
    },
    [options]
  );

  return ref;
}
