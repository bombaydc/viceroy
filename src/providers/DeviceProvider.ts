"use client";
import { useEffect } from "react";

const DeviceProvider: React.FC = () => {
  useEffect(() => {
    const detectDevice = () => {
      const ua = navigator.userAgent.toLowerCase();

      // Platform
      if (ua.includes("windows")) {
        document.body.classList.add("is-windows");
      }

      // Mobile / Touch
      if (/android|iphone|ipad|ipod|blackberry|windows phone/i.test(ua)) {
        document.body.classList.add("is-phone");
      }

      // Touch support
      if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add("using-touch");
      }
    };

    const handleMouseMove = () => {
      document.body.classList.add("using-mouse");
      document.body.classList.remove("using-keyboard");
    };

    const handleKeyDown = () => {
      document.body.classList.add("using-keyboard");
      document.body.classList.remove("using-mouse");
    };

    detectDevice();

    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
};

export default DeviceProvider;
