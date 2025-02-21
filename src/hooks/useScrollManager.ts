import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Store scroll positions for each path
const scrollPositions = new Map<string, number>();

export const useScrollManager = () => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef<string>(location.pathname);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;

    // Save scroll position for the previous path
    if (prevPath !== currentPath) {
      scrollPositions.set(prevPath, content.scrollTop);
    }

    // Restore scroll position for current path or scroll to top
    const savedPosition = scrollPositions.get(currentPath);
    if (savedPosition !== undefined) {
      content.scrollTop = savedPosition;
    } else {
      content.scrollTop = 0;
    }

    prevPathRef.current = currentPath;
  }, [location.pathname]);

  // Save scroll position while scrolling
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = () => {
      scrollPositions.set(location.pathname, content.scrollTop);
    };

    content.addEventListener('scroll', handleScroll);
    return () => {
      content.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return contentRef;
};