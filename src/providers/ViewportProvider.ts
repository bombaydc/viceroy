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

    setCSSVariables();

    const resizeObserver = new ResizeObserver(setCSSVariables);
    resizeObserver.observe(document.documentElement);

    window.addEventListener("resize", setCSSVariables);
    window.addEventListener("orientationchange", setCSSVariables);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", setCSSVariables);
      window.removeEventListener("orientationchange", setCSSVariables);
    };
  }, []);

  return null;
};

export default ViewportProvider;
