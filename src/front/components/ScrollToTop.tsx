import React, { useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  children: ReactNode;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ children }) => {
  const { pathname } = useLocation();
  const prevPathRef = useRef<string>(pathname);

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      window.scrollTo(0, 0);
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollToTop;
