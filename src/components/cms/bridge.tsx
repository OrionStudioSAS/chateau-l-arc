"use client";

import { useEffect } from "react";

/**
 * Côté site, dans l'aperçu de l'éditeur visuel (?edit, dans une iframe) :
 * signale les zones modifiables, applique en direct les valeurs saisies,
 * met en évidence la zone active et neutralise la navigation.
 */
export function CmsBridge() {
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("edit")) return;
    if (window === window.parent) return;

    const zones = (path: string) =>
      document.querySelectorAll<HTMLElement>(`[data-cms-path="${CSS.escape(path)}"]`);

    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;

      if (e.data?.type === "cms:field-update") {
        zones(e.data.path).forEach((el) => {
          if (el.hasAttribute("data-cms-image")) {
            const img = el instanceof HTMLImageElement ? el : el.querySelector("img");
            if (img) {
              img.removeAttribute("srcset");
              img.src = e.data.value;
            }
          } else {
            el.textContent = e.data.value;
          }
        });
      }

      if (e.data?.type === "cms:focus") {
        document.querySelectorAll(".cms-active").forEach((el) => el.classList.remove("cms-active"));
        const cible = zones(e.data.path);
        cible.forEach((el) => el.classList.add("cms-active"));
        cible[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    // Aperçu : pas de navigation (liens, formulaires), seules les zones s'éditent.
    const bloquer = (e: Event) => {
      const cible = e.target as Element | null;
      if (cible?.closest("[data-cms-path]")) return;
      if (cible?.closest("a, button[type=submit], form")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener("click", bloquer, true);
    document.addEventListener("submit", bloquer, true);

    const style = document.createElement("style");
    style.textContent = `
      [data-cms-path] {
        transition: outline 0.15s ease, box-shadow 0.15s ease;
        cursor: pointer !important;
      }
      [data-cms-path]:hover {
        outline: 2px solid rgba(184, 148, 79, 0.7);
        outline-offset: 4px;
        border-radius: 4px;
      }
      [data-cms-path].cms-active {
        outline: 2px solid rgb(184, 148, 79);
        outline-offset: 4px;
        box-shadow: 0 0 0 6px rgba(184, 148, 79, 0.18);
        border-radius: 4px;
      }
      [data-cms-image]:hover, [data-cms-image].cms-active { outline-offset: -3px; }
    `;
    document.head.appendChild(style);

    // Les zones reçoivent leur attribut juste après l'hydratation : on attend un peu.
    const annonce = window.setTimeout(() => {
      const chemins = [
        ...new Set([...document.querySelectorAll("[data-cms-path]")].map((el) => el.getAttribute("data-cms-path"))),
      ];
      window.parent.postMessage({ type: "cms:ready", chemins }, window.location.origin);
    }, 400);

    return () => {
      window.clearTimeout(annonce);
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("click", bloquer, true);
      document.removeEventListener("submit", bloquer, true);
      style.remove();
    };
  }, []);

  return null;
}
