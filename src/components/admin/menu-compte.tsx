"use client";

import { useEffect, useRef, useState } from "react";

import { IconeAdmin } from "@/components/admin/icone-admin";

/** « p.laurent@golf.fr » → « P. Laurent » ; « accueil@… » → « Accueil ». */
function nomAffiche(email: string): string {
  const parties = email.split("@")[0].split(/[._-]+/).filter(Boolean);
  return parties
    .map((partie, index) => {
      const majuscule = partie.charAt(0).toUpperCase() + partie.slice(1);
      return partie.length === 1 && index < parties.length - 1 ? `${majuscule}.` : majuscule;
    })
    .join(" ");
}

/** Compte connecté, en pied de barre latérale, avec le menu de déconnexion. */
export function MenuCompte({
  email,
  deconnexion,
}: {
  email: string;
  deconnexion: React.ReactNode;
}) {
  const [ouvert, setOuvert] = useState(false);
  const zone = useRef<HTMLDivElement>(null);
  const nom = nomAffiche(email);
  const initiales = nom
    .split(" ")
    .map((mot) => mot.charAt(0))
    .join("")
    .slice(0, 2);

  useEffect(() => {
    if (!ouvert) return;
    const fermer = (evenement: MouseEvent | KeyboardEvent) => {
      if (evenement instanceof KeyboardEvent ? evenement.key === "Escape" : !zone.current?.contains(evenement.target as Node)) {
        setOuvert(false);
      }
    };
    document.addEventListener("mousedown", fermer);
    document.addEventListener("keydown", fermer);
    return () => {
      document.removeEventListener("mousedown", fermer);
      document.removeEventListener("keydown", fermer);
    };
  }, [ouvert]);

  return (
    <div ref={zone} className="relative flex items-center gap-3 px-1">
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-or-500 text-[11px] font-semibold text-white"
      >
        {initiales}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium leading-tight text-neutral-900">
          {nom}
        </span>
        <span className="block truncate text-[12px] text-neutral-500" title={email}>
          {email}
        </span>
      </span>
      <button
        type="button"
        aria-label="Options du compte"
        aria-expanded={ouvert}
        onClick={() => setOuvert((valeur) => !valeur)}
        className="rounded-md p-1 text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-800"
      >
        <IconeAdmin nom="points" className="size-5" />
      </button>

      {ouvert ? (
        <div className="absolute bottom-full right-0 z-10 mb-2 w-48 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg">
          {deconnexion}
        </div>
      ) : null}
    </div>
  );
}
