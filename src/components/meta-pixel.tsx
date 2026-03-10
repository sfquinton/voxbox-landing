"use client";

import { useEffect } from "react";

const META_PIXEL_ID = "232948958848613";

declare global {
  interface Window {
    fbq: CallableFunction & {
      callMethod?: CallableFunction;
      queue: unknown[];
      loaded: boolean;
      version: string;
      push: CallableFunction;
    };
    _fbq: typeof window.fbq;
  }
}

export default function MetaPixel() {
  useEffect(() => {
    if (window.fbq && window.fbq.loaded) return;

    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
      } else {
        fbq.queue.push(args);
      }
    } as unknown as Window["fbq"];
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = fbq;

    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);

    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
  }, []);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
