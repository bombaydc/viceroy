"use client";

import { useEffect } from "react";

const ViewportProvider = () => {
  useEffect(() => {
    const setCSSVariables = () => {
      const width = Math.floor(document.documentElement.getBoundingClientRect().width);
      const height = window.innerHeight;
      const root = document.documentElement;

      root.style.setProperty("--w-viewport", `${width}px`);
      root.style.setProperty("--h-viewport", `${height}px`);
    };

    setCSSVariables(); // set on mount

    const resizeObserver = new ResizeObserver(setCSSVariables);
    resizeObserver.observe(document.documentElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return null;
};

export default ViewportProvider;
