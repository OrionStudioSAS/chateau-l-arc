import type { Installation } from "@/lib/api/types";
import { parGroupe, valeurStatut } from "@/lib/statut";
import { cn } from "@/lib/cn";

/**
 * Liste complète de l'état des installations, groupée et séparée par des
 * filets, sur la page « Informations sur le parcours ». Le menu de l'en-tête
 * n'en reprend que l'essentiel (cf. PanneauStatut).
 */
export function ListeStatut({
  installations,
  className,
}: {
  installations: Installation[];
  className?: string;
}) {
  if (installations.length === 0) {
    return (
      <p className={cn("px-6 py-5 text-[13px] text-encre/60", className)}>
        Informations momentanément indisponibles.
      </p>
    );
  }

  return (
    <div className={cn("divide-y divide-encre/80", className)}>
      {parGroupe(installations).map((groupe) => (
        <dl key={groupe[0].groupe} className="py-2">
          {groupe.map((installation) => (
            <div
              key={installation.cle}
              className="flex items-center justify-between gap-6 px-6 py-3"
            >
              <dt className="text-[13px] font-bold uppercase text-encre">
                {installation.libelle}
              </dt>
              <dd
                className={cn(
                  "flex items-center gap-3 text-[13px] uppercase",
                  installation.type === "autorisation"
                    ? installation.actif
                      ? "text-club-600"
                      : "text-red-700"
                    : "text-encre/80",
                )}
              >
                {valeurStatut(installation)}
                {/* Les états d'ouverture portent une pastille, comme sur la maquette. */}
                {installation.type === "ouverture" ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block size-3 rounded-full ring-2",
                      installation.actif
                        ? "bg-emerald-500 ring-emerald-500/25"
                        : "bg-red-600 ring-red-600/25",
                    )}
                  />
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      ))}
    </div>
  );
}
