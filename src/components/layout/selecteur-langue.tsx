"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { cheminLocal } from "@/lib/i18n/chemins";
import { useI18n } from "@/lib/i18n/client";
import { languesPubliees, type Langue } from "@/lib/i18n/langues";

/** Bandes des drapeaux simples (verticales ou horizontales), de gauche à droite / haut en bas. */
const bandes: Record<string, { sens: "v" | "h"; couleurs: string[] }> = {
  fr: { sens: "v", couleurs: ["#0055A4", "#FFFFFF", "#EF4135"] },
  it: { sens: "v", couleurs: ["#009246", "#FFFFFF", "#CE2B37"] },
  de: { sens: "h", couleurs: ["#000000", "#DD0000", "#FFCE00"] },
  nl: { sens: "h", couleurs: ["#AE1C28", "#FFFFFF", "#21468B"] },
  ru: { sens: "h", couleurs: ["#FFFFFF", "#0039A6", "#D52B1E"] },
  es: { sens: "h", couleurs: ["#AA151B", "#F1BF00", "#F1BF00", "#AA151B"] },
};

/** Drapeau rond de la langue (Union Jack pour l'anglais) ; à défaut, son code. */
export function Drapeau({ code, className }: { code: Langue; className?: string }) {
  const simple = bandes[code];
  const clip = `rond-${useId()}`;
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={cn("shrink-0 rounded-full", className)}>
      <defs>
        <clipPath id={clip}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {code === "en" ? (
          <>
            <rect width="24" height="24" fill="#012169" />
            <path d="M0 0 24 24M24 0 0 24" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M0 0 24 24M24 0 0 24" stroke="#C8102E" strokeWidth="1.6" />
            <path d="M12 0v24M0 12h24" stroke="#FFFFFF" strokeWidth="7" />
            <path d="M12 0v24M0 12h24" stroke="#C8102E" strokeWidth="4" />
          </>
        ) : simple ? (
          simple.couleurs.map((couleur, i) => {
            const taille = 24 / simple.couleurs.length;
            return simple.sens === "v" ? (
              <rect key={i} x={i * taille} width={taille + 0.2} height="24" fill={couleur} />
            ) : (
              <rect key={i} y={i * taille} width="24" height={taille + 0.2} fill={couleur} />
            );
          })
        ) : (
          <>
            <rect width="24" height="24" fill="#F3EEE4" />
            <text x="12" y="15.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1B2A22">
              {code.toUpperCase()}
            </text>
          </>
        )}
      </g>
    </svg>
  );
}

/**
 * Pastille ronde de l'en-tête (maquette) : drapeau de la langue affichée ;
 * au clic, les autres langues publiées, vers la même page traduite.
 */
export function SelecteurLangue({ chemin, transparent }: { chemin: string; transparent: boolean }) {
  const { langue, tr } = useI18n();
  const [ouvert, setOuvert] = useState(false);
  const zone = useRef<HTMLDivElement>(null);
  const courante = languesPubliees.find((l) => l.code === langue) ?? languesPubliees[0];

  useEffect(() => {
    if (!ouvert) return;
    const surClic = (e: MouseEvent) => {
      if (!zone.current?.contains(e.target as Node)) setOuvert(false);
    };
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    document.addEventListener("mousedown", surClic);
    document.addEventListener("keydown", surTouche);
    return () => {
      document.removeEventListener("mousedown", surClic);
      document.removeEventListener("keydown", surTouche);
    };
  }, [ouvert]);

  if (languesPubliees.length < 2 || !courante) return null;

  return (
    <div ref={zone} className="relative hidden lg:block">
      <button
        type="button"
        aria-expanded={ouvert}
        aria-controls="choix-langue"
        aria-label={`${tr("Langue")} : ${courante.natif}`}
        onClick={() => setOuvert((v) => !v)}
        className={cn(
          "flex size-9 items-center justify-center rounded-full border transition-colors",
          transparent ? "border-white/40 hover:bg-white/10" : "border-club-950/20 hover:bg-sable-50",
        )}
      >
        <Drapeau code={courante.code} className="size-[22px] ring-1 ring-black/10" />
      </button>

      {ouvert ? (
        <ul
          id="choix-langue"
          className="absolute right-0 top-full z-10 mt-2 min-w-44 overflow-hidden rounded-lg border border-club-950/10 bg-white py-1 text-encre shadow-[0_18px_40px_rgba(16,24,40,0.18)]"
        >
          {languesPubliees.map((l) => (
            <li key={l.code}>
              <a
                href={cheminLocal(chemin, l.code)}
                hrefLang={l.code}
                lang={l.code}
                aria-current={l.code === langue ? "true" : undefined}
                onClick={() => setOuvert(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 text-[14px] transition-colors hover:bg-sable-50",
                  l.code === langue && "font-semibold",
                )}
              >
                <Drapeau code={l.code} className="size-5 ring-1 ring-black/10" />
                {l.natif}
                {l.code === langue ? (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-auto size-4 text-club-800" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m5 12 5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
