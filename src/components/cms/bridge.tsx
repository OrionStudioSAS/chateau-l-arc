"use client";

import { useEffect } from "react";

export function CmsBridge() {
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("edit")) return;
    if (typeof window === "undefined" || window === window.parent) return;

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "cms:field-update") {
        const el = document.querySelector(`[data-cms-path="${CSS.escape(e.data.path)}"]`);
        if (el) el.textContent = e.data.value;
      }
    };

    window.addEventListener("message", handleMessage);

    const style = document.createElement("style");
    style.textContent = `
      [data-cms-path] {
        transition: outline 0.15s ease, box-shadow 0.15s ease;
        cursor: pointer !important;
      }
      [data-cms-path]:hover {
        outline: 2px solid rgba(59, 130, 246, 0.6);
        outline-offset: 4px;
        box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.08);
        border-radius: 4px;
      }
      [data-cms-path].cms-active {
        outline: 2px solid rgba(59, 130, 246, 0.9);
        outline-offset: 4px;
        box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.15);
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);

    window.parent.postMessage({ type: "cms:ready" }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
      style.remove();
    };
  }, []);

  return null;
}
