"use client";

import { useId, useRef, useState } from "react";

import { IconeAdmin } from "@/components/admin/icone-admin";
import { cn } from "@/lib/cn";

export const classeChamp =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[14px] text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-club-600 focus:ring-2 focus:ring-club-600/15";

/** Libellé, astérisque d'obligation, mention « Facultatif » et aide sous le champ. */
export function Champ({
  libelle,
  requis,
  facultatif,
  aide,
  className,
  children,
}: {
  libelle: string;
  requis?: boolean;
  facultatif?: boolean;
  aide?: string;
  className?: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-medium text-neutral-700">
          {libelle}
          {requis ? <span className="ml-0.5 text-red-600">*</span> : null}
        </label>
        {facultatif ? <span className="text-[12px] text-neutral-400">Facultatif</span> : null}
      </div>
      {children(id)}
      {aide ? <p className="mt-1.5 text-[12px] text-neutral-500">{aide}</p> : null}
    </div>
  );
}

export function Segments<T extends string>({
  valeur,
  options,
  onChange,
  libelle,
  className,
}: {
  valeur: T;
  options: { valeur: T; libelle: string }[];
  onChange: (valeur: T) => void;
  libelle: string;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={libelle} className={cn("flex rounded-lg bg-neutral-100 p-0.5", className)}>
      {options.map((option) => (
        <button
          key={option.valeur}
          type="button"
          role="radio"
          aria-checked={option.valeur === valeur}
          onClick={() => onChange(option.valeur)}
          className={cn(
            "flex-1 whitespace-nowrap rounded-md px-3 py-[7px] text-[14px] transition-colors",
            option.valeur === valeur
              ? "bg-white font-medium text-neutral-900 shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
              : "text-neutral-500 hover:text-neutral-800",
          )}
        >
          {option.libelle}
        </button>
      ))}
    </div>
  );
}

/** Interrupteur dans un encadré, avec titre et explication (maquette « Présentation »). */
export function Interrupteur({
  titre,
  texte,
  actif,
  onChange,
}: {
  titre: string;
  texte: string;
  actif: boolean;
  onChange: (actif: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-neutral-200 px-4 py-3">
      <span>
        <span className="block text-[14px] font-medium text-neutral-900">{titre}</span>
        <span className="mt-0.5 block text-[13px] text-neutral-500">{texte}</span>
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          type="checkbox"
          role="switch"
          checked={actif}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="h-5 w-9 rounded-full bg-neutral-300 transition-colors peer-checked:bg-club-800 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-club-600"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4"
        />
      </span>
    </label>
  );
}

/** Saisie d'étiquettes (catégories) : Entrée ou virgule ajoute, suggestions proposées. */
export function Etiquettes({
  id,
  valeurs,
  suggestions,
  onChange,
}: {
  id: string;
  valeurs: string[];
  suggestions: string[];
  onChange: (valeurs: string[]) => void;
}) {
  const [saisie, setSaisie] = useState("");
  const [ouvert, setOuvert] = useState(false);
  const champ = useRef<HTMLInputElement>(null);
  const proposees = suggestions.filter(
    (s) => !valeurs.includes(s) && s.toLowerCase().includes(saisie.trim().toLowerCase()),
  );

  const ajouter = (valeur: string) => {
    const propre = valeur.trim();
    if (propre && !valeurs.includes(propre)) onChange([...valeurs, propre]);
    setSaisie("");
  };

  return (
    <div className="relative">
      <div
        onClick={() => champ.current?.focus()}
        className="flex min-h-[38px] flex-wrap items-center gap-1.5 rounded-lg border border-neutral-200 bg-white py-1 pl-1.5 pr-8 focus-within:border-club-600 focus-within:ring-2 focus-within:ring-club-600/15"
      >
        {valeurs.map((valeur) => (
          <span
            key={valeur}
            className="inline-flex items-center gap-1 rounded-md bg-neutral-100 py-0.5 pl-2 pr-1 text-[13px] font-medium text-neutral-800"
          >
            {valeur}
            <button
              type="button"
              aria-label={`Retirer ${valeur}`}
              onClick={() => onChange(valeurs.filter((v) => v !== valeur))}
              className="rounded p-0.5 text-neutral-400 hover:text-neutral-700"
            >
              <IconeAdmin nom="fermer" className="size-3" />
            </button>
          </span>
        ))}
        <input
          ref={champ}
          id={id}
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          onFocus={() => setOuvert(true)}
          onBlur={() => window.setTimeout(() => setOuvert(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              ajouter(saisie);
            } else if (e.key === "Backspace" && !saisie && valeurs.length) {
              onChange(valeurs.slice(0, -1));
            }
          }}
          placeholder="Ajouter…"
          className="min-w-24 flex-1 bg-transparent px-1 py-1 text-[14px] outline-none placeholder:text-neutral-400"
        />
      </div>
      <IconeAdmin
        nom="chevronHaut"
        className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 rotate-180 text-neutral-400"
      />
      {ouvert && proposees.length > 0 ? (
        <ul className="absolute inset-x-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-1 shadow-lg">
          {proposees.map((s) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => ajouter(s)}
                className="w-full rounded-md px-2.5 py-1.5 text-left text-[14px] hover:bg-neutral-100"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * Éditeur de description : texte simple enrichi façon Markdown (**gras**,
 * *italique*, listes « - », titres « ### », liens [texte](url)), rendu sur le
 * site par TexteRiche. La barre d'outils insère la syntaxe autour de la sélection.
 */
export function EditeurTexte({
  id,
  valeur,
  onChange,
}: {
  id: string;
  valeur: string;
  onChange: (valeur: string) => void;
}) {
  const zone = useRef<HTMLTextAreaElement>(null);

  const entourer = (avant: string, apres = avant) => {
    const el = zone.current;
    if (!el) return;
    const { selectionStart: debut, selectionEnd: fin } = el;
    const choisi = valeur.slice(debut, fin) || "texte";
    onChange(valeur.slice(0, debut) + avant + choisi + apres + valeur.slice(fin));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(debut + avant.length, debut + avant.length + choisi.length);
    });
  };

  /** Préfixe (ou retire) chaque ligne sélectionnée : listes et titres. */
  const prefixer = (prefixe: string) => {
    const el = zone.current;
    if (!el) return;
    const debut = valeur.lastIndexOf("\n", el.selectionStart - 1) + 1;
    const finLigne = valeur.indexOf("\n", el.selectionEnd);
    const fin = finLigne === -1 ? valeur.length : finLigne;
    const lignes = valeur
      .slice(debut, fin)
      .split("\n")
      .map((ligne) => {
        const nue = ligne.replace(/^(### |- )/, "");
        return ligne.startsWith(prefixe) ? nue : prefixe + nue;
      });
    onChange(valeur.slice(0, debut) + lignes.join("\n") + valeur.slice(fin));
    requestAnimationFrame(() => el.focus());
  };

  const bouton = "rounded p-1.5 text-neutral-600 hover:bg-neutral-200/70";

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 focus-within:border-club-600 focus-within:ring-2 focus-within:ring-club-600/15">
      <div className="flex items-center gap-0.5 border-b border-neutral-200 bg-neutral-50 px-1.5 py-1">
        <select
          aria-label="Style du paragraphe"
          value=""
          onChange={(e) => {
            if (e.target.value) prefixer(e.target.value === "titre" ? "### " : "");
          }}
          className="mr-1 rounded bg-transparent px-1.5 py-1 text-[13px] font-medium text-neutral-700 outline-none hover:bg-neutral-200/70"
        >
          <option value="">Paragraphe</option>
          <option value="titre">Titre</option>
        </select>
        <button type="button" aria-label="Gras" onClick={() => entourer("**")} className={cn(bouton, "font-bold")}>
          <span className="block size-4 text-center text-[14px] leading-4">B</span>
        </button>
        <button type="button" aria-label="Italique" onClick={() => entourer("*")} className={cn(bouton, "italic")}>
          <span className="block size-4 text-center font-serif text-[15px] leading-4">I</span>
        </button>
        <button type="button" aria-label="Liste à puces" onClick={() => prefixer("- ")} className={bouton}>
          <IconeAdmin nom="liste" className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Lien"
          onClick={() => {
            const url = window.prompt("Adresse du lien (https://…, /une-page, mailto:…)");
            if (url) entourer("[", `](${url.trim()})`);
          }}
          className={bouton}
        >
          <IconeAdmin nom="lien" className="size-4" />
        </button>
      </div>
      <textarea
        ref={zone}
        id={id}
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        maxLength={3000}
        placeholder="Formule, déroulé de la journée, remise des prix…"
        className="block w-full resize-y px-3 py-2.5 text-[14px] leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-400"
      />
    </div>
  );
}
