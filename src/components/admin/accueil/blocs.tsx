import Link from "next/link";
import type { Route } from "next";

import { IconeAdmin } from "@/components/admin/icone-admin";
import { cn } from "@/lib/cn";

/** Carte blanche bordée de l'accueil, avec en-tête facultatif. */
export function Panneau({
  titre,
  sousTitre,
  action,
  className,
  children,
}: {
  titre?: string;
  sousTitre?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("overflow-hidden rounded-xl border border-neutral-200 bg-white", className)}>
      {titre ? (
        <header className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-neutral-900">{titre}</h2>
            {sousTitre ? <p className="mt-0.5 text-[13px] text-neutral-500">{sousTitre}</p> : null}
          </div>
          {action}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function Pastille({
  ton = "vert",
  point = false,
  children,
}: {
  ton?: "vert" | "gris" | "rouge" | "ambre";
  point?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[12px] font-medium leading-4",
        ton === "vert" && "bg-emerald-50 text-emerald-700",
        ton === "gris" && "bg-neutral-100 text-neutral-600",
        ton === "rouge" && "bg-red-50 text-red-700",
        ton === "ambre" && "bg-amber-50 text-amber-800",
      )}
    >
      {point ? (
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full",
            ton === "vert" && "bg-emerald-500",
            ton === "gris" && "bg-neutral-400",
            ton === "rouge" && "bg-red-500",
            ton === "ambre" && "bg-amber-500",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

const nombre = new Intl.NumberFormat("fr-FR");
export const formatNombre = (valeur: number) => nombre.format(valeur);

/** Évolution face à la période précédente : « +12 % » ou « +23 ». */
export function Evolution({
  valeur,
  precedent,
  mode,
}: {
  valeur: number;
  precedent: number;
  mode: "pourcent" | "absolu";
}) {
  if (mode === "pourcent" && precedent === 0) return null;
  const ecart =
    mode === "pourcent" ? Math.round(((valeur - precedent) / precedent) * 100) : valeur - precedent;
  if (ecart === 0 && valeur === 0) return null;

  const texte = `${ecart > 0 ? "+" : ecart < 0 ? "−" : "±"}${nombre.format(Math.abs(ecart))}${mode === "pourcent" ? " %" : ""}`;
  return (
    <Pastille ton={ecart < 0 ? "rouge" : "vert"}>
      <span className="sr-only">Évolution : </span>
      {texte}
    </Pastille>
  );
}

/** Courbe pleine miniature (cartes d'indicateurs). */
export function Sparkline({ valeurs, ton = "vert" }: { valeurs: number[]; ton?: "vert" | "gris" }) {
  const L = 84;
  const H = 30;
  const points = valeurs.length > 1 ? valeurs : [valeurs[0] ?? 0, valeurs[0] ?? 0];
  const max = Math.max(...points, 1);
  const coords = points.map((v, i) => [
    (i / (points.length - 1)) * L,
    H - 1 - (v / max) * (H - 4),
  ]);
  const trace = `M0,${H} ${coords.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(" ")} L${L},${H} Z`;

  return (
    <svg aria-hidden="true" viewBox={`0 0 ${L} ${H}`} className="h-[30px] w-[84px] shrink-0">
      <path d={trace} className={ton === "vert" ? "fill-emerald-600" : "fill-neutral-400"} />
    </svg>
  );
}

export function Recapitulatif({
  libelle,
  valeur,
  badge,
  pied,
  serie,
  tonSerie,
}: {
  libelle: string;
  valeur: string;
  badge?: React.ReactNode;
  pied: string;
  serie?: number[];
  tonSerie?: "vert" | "gris";
}) {
  return (
    <div className="flex min-w-0 flex-col p-5">
      <p className="text-[13px] text-neutral-600">{libelle}</p>
      <p className="mt-2 flex items-center gap-2.5">
        <span className="text-[28px] font-semibold leading-none tracking-tight text-neutral-900">
          {valeur}
        </span>
        {badge}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="truncate text-[13px] text-neutral-500">{pied}</p>
        {serie ? <Sparkline valeurs={serie} ton={tonSerie} /> : null}
      </div>
    </div>
  );
}

export function LienBouton({
  href,
  icone,
  children,
  externe = false,
}: {
  href: string;
  icone?: "camera" | "courrier" | "crayon";
  children: React.ReactNode;
  externe?: boolean;
}) {
  const classes =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[14px] font-medium text-neutral-800 transition-colors hover:bg-neutral-50";
  const contenu = (
    <>
      {icone ? <IconeAdmin nom={icone} className="size-4 text-neutral-600" /> : null}
      {children}
    </>
  );
  return externe ? (
    <a href={href} target="_blank" rel="noopener" className={classes}>
      {contenu}
    </a>
  ) : (
    <Link href={href as Route} className={classes}>
      {contenu}
    </Link>
  );
}
