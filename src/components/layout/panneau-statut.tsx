import type { Installation } from "@/lib/api/types";
import type { Meteo } from "@/lib/meteo";
import { valeurStatut } from "@/lib/statut";
import { cn } from "@/lib/cn";

type Picto = "drapeau" | "voiturette" | "cible" | "couverts";

/**
 * L'essentiel pour décider de venir jouer. La liste complète reste sur la
 * page « Informations sur le parcours ».
 */
const lignes: { cle: string; libelle: string; picto: Picto; pluriel?: boolean }[] = [
  { cle: "parcours", libelle: "Parcours 18 trous", picto: "drapeau" },
  { cle: "voiturette", libelle: "Voiturettes", picto: "voiturette", pluriel: true },
  { cle: "practice", libelle: "Practice", picto: "cible" },
  { cle: "restaurant", libelle: "Restaurant", picto: "couverts" },
];

const traits = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Pictogramme({ nom, className }: { nom: Picto | Meteo["picto"] | "vent"; className?: string }) {
  const chemins: Record<typeof nom, React.ReactNode> = {
    drapeau: <path d="M5 21V4m0 0h11l-2 4 2 4H5" />,
    voiturette: (
      <>
        <path d="M3 14h18l-2-6H7L5 14m0 0v3m14-3v3M9 8V5h8" />
        <circle cx="7.5" cy="17.5" r="1.5" />
        <circle cx="16.5" cy="17.5" r="1.5" />
      </>
    ),
    cible: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="0.5" />
      </>
    ),
    couverts: <path d="M7 3v8m-2-8v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1-3 4-3 7h3" />,
    soleil: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    nuage: <path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18Z" />,
    pluie: (
      <>
        <path d="M7 15h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 6.5 4.3 4.3 0 0 0 7 15Z" />
        <path d="M9 18l-1 3m5-3-1 3m5-3-1 3" />
      </>
    ),
    vent: <path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8" />,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={cn("size-4 shrink-0", className)} {...traits}>
      {chemins[nom]}
    </svg>
  );
}

const heureParis = new Intl.DateTimeFormat("fr-FR", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});
const jourParis = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: "Europe/Paris",
});
const dateParis = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" });

/**
 * « Mis à jour 6h42 » le jour même, « Mis à jour le 29 sept. » ensuite.
 * N'est rendu qu'à l'ouverture du panneau, donc côté navigateur : `new Date()`
 * y donne bien l'heure du visiteur.
 */
function libelleMiseAJour(installations: Installation[]): string | null {
  const derniere = installations.reduce<string | null>(
    (plusRecente, { majLe }) => (!plusRecente || majLe > plusRecente ? majLe : plusRecente),
    null,
  );
  if (!derniere) return null;

  const date = new Date(derniere);
  if (dateParis.format(date) === dateParis.format(new Date())) {
    return `Mis à jour ${heureParis.format(date).replace(":", "h")}`;
  }
  return `Mis à jour le ${jourParis.format(date)}`;
}

/** Libellé du bouton d'ouverture : l'état du parcours, ou un repli neutre. */
export function libelleBoutonStatut(installations: Installation[]) {
  const parcours = installations.find((installation) => installation.cle === "parcours");
  if (!parcours) return { texte: "Infos du jour", ouvert: null };
  return {
    texte: parcours.actif ? "Parcours ouvert" : "Parcours fermé",
    ouvert: parcours.actif,
  };
}

/** Pastille d'état, verte si ouvert ou autorisé, rouge sinon. */
export function PastilleStatut({ actif }: { actif: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block size-2 shrink-0 rounded-full", actif ? "bg-emerald-400" : "bg-red-500")}
    />
  );
}

export function PanneauStatut({
  installations,
  meteo,
}: {
  installations: Installation[];
  meteo: Meteo | null;
}) {
  const affichees = lignes.flatMap((ligne) => {
    const installation = installations.find((candidate) => candidate.cle === ligne.cle);
    if (!installation) return [];

    // « Autorisée » → « Autorisées » pour la ligne au pluriel, sauf précision libre.
    const precisionAffichee = installation.actif && installation.precision;
    const valeur =
      valeurStatut(installation) + (ligne.pluriel && !precisionAffichee ? "s" : "");

    return [{ ...ligne, actif: installation.actif, valeur }];
  });
  const miseAJour = libelleMiseAJour(installations);

  return (
    <div className="px-6 pb-5 pt-5">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-or-400">
        Aujourd&apos;hui au golf
      </p>

      {affichees.length === 0 ? (
        <p className="mt-4 text-[14px] text-white/70">
          Informations momentanément indisponibles.
        </p>
      ) : (
        <dl className="mt-4 space-y-3.5">
          {affichees.map((ligne) => (
            <div key={ligne.cle} className="flex items-center justify-between gap-6">
              <dt className="flex items-center gap-3 text-[14px] text-white/85">
                <Pictogramme nom={ligne.picto} className="text-white/80" />
                {ligne.libelle}
              </dt>
              <dd className="flex items-center gap-2.5 text-[14px] font-semibold text-white">
                <PastilleStatut actif={ligne.actif} />
                {ligne.valeur}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {meteo || miseAJour ? (
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/15 pt-4 text-[13px] text-white/85">
          {meteo ? (
            <>
              <span className="flex items-center gap-2">
                <Pictogramme nom={meteo.picto} className="text-or-400" />
                {meteo.temperature}&nbsp;°C · {meteo.ciel}
              </span>
              <span className="flex items-center gap-2">
                <Pictogramme nom="vent" className="text-white/70" />
                <span>
                  <span className="sr-only">Vent </span>
                  {meteo.vent}&nbsp;km/h
                </span>
              </span>
            </>
          ) : null}
          {miseAJour ? <span className="ml-auto text-white/50">{miseAJour}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
