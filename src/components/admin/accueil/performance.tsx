import { Evolution, formatNombre, Panneau, Pastille } from "@/components/admin/accueil/blocs";
import { routesPubliques } from "@/config/site";
import type { Statistiques } from "@/lib/analytics/statistiques";
import { cn } from "@/lib/cn";

const titresPages = new Map<string, string>([
  ["/", "Accueil"],
  ...routesPubliques.map((route) => [route.href, route.label] as [string, string]),
]);

const COULEURS_SOURCES = ["bg-club-800", "bg-or-500", "bg-[#7f9a88]", "bg-neutral-300"];

function Chiffre({
  libelle,
  valeur,
  badge,
}: {
  libelle: string;
  valeur: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[13px] text-neutral-600">{libelle}</p>
      <p className="mt-2 flex items-center gap-2.5">
        <span className="text-[24px] font-semibold leading-none tracking-tight text-neutral-900">
          {valeur}
        </span>
        {badge}
      </p>
    </div>
  );
}

/** Bloc « Performance du site » de l'accueil. */
export function PerformanceSite({
  stats,
  indisponible,
  intervalle,
  libelleGraphique,
}: {
  stats: Statistiques | null;
  indisponible: string;
  intervalle: string;
  libelleGraphique: string;
}) {
  const tiret = "—";
  const max = Math.max(...(stats?.visites ?? [0]), 1);
  const nombreBarres = stats?.graduations.length ?? 0;
  // Au-delà de 12 barres, une étiquette sur cinq (plus la dernière) suffit.
  const etiquetteVisible = (i: number) =>
    nombreBarres <= 12 || i % 5 === 0 || i === nombreBarres - 1;

  return (
    <Panneau
      titre="Performance du site"
      sousTitre={intervalle}
      action={
        stats ? (
          <Pastille ton="vert" point>
            {formatNombre(stats.visiteursActifs)}{" "}
            {stats.visiteursActifs > 1 ? "visiteurs" : "visiteur"} en ce moment
          </Pastille>
        ) : null
      }
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-neutral-200 px-5 py-5 sm:px-6 md:grid-cols-4">
        <Chiffre
          libelle="Visiteurs"
          valeur={stats ? formatNombre(stats.visiteurs.valeur) : tiret}
          badge={stats ? <Evolution {...stats.visiteurs} mode="pourcent" /> : null}
        />
        <Chiffre
          libelle="Demandes reçues"
          valeur={stats ? formatNombre(stats.demandes.valeur) : tiret}
          badge={stats ? <Evolution {...stats.demandes} mode="absolu" /> : null}
        />
        <Chiffre
          libelle="Inscriptions en ligne"
          valeur={stats ? formatNombre(stats.inscriptions.valeur) : tiret}
          badge={stats ? <Evolution {...stats.inscriptions} mode="absolu" /> : null}
        />
        <Chiffre
          libelle="Appels depuis le site"
          valeur={stats ? formatNombre(stats.appels.valeur) : tiret}
          badge={stats ? <Evolution {...stats.appels} mode="absolu" /> : null}
        />
      </div>

      {stats ? (
        <div className="grid gap-8 px-5 py-5 sm:px-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <h3 className="text-[13px] font-medium text-neutral-800">{libelleGraphique}</h3>
            <div
              role="img"
              aria-label={`${libelleGraphique} : ${stats.graduations.map((g, i) => `${g.libelle} ${stats.visites[i]}`).join(", ")}`}
              className={cn("mt-4 flex h-[130px] items-end", nombreBarres > 12 ? "gap-[3px]" : "gap-2")}
            >
              {stats.visites.map((valeur, i) => (
                <div
                  key={stats.graduations[i].cle}
                  title={`${stats.graduations[i].libelle} : ${formatNombre(valeur)}`}
                  className={cn(
                    "min-h-[3px] flex-1 rounded-t-sm",
                    i === nombreBarres - 1 ? "bg-or-500" : "bg-[#4f7a62]",
                  )}
                  style={{ height: `${(valeur / max) * 100}%` }}
                />
              ))}
            </div>
            <div
              aria-hidden="true"
              className={cn("mt-2 flex", nombreBarres > 12 ? "gap-[3px]" : "gap-2")}
            >
              {stats.graduations.map((g, i) => (
                <span key={g.cle} className="flex-1 text-center text-[11px] text-neutral-500">
                  {etiquetteVisible(i) ? g.libelle : ""}
                </span>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="text-[13px] font-medium text-neutral-800">Sources de trafic</h3>
            <ul className="mt-4 space-y-4">
              {stats.sources.map((source, i) => (
                <li key={source.libelle}>
                  <p className="flex justify-between text-[13px] text-neutral-600">
                    {source.libelle}
                    <span className="font-mono text-neutral-900">{source.part} %</span>
                  </p>
                  <div className="mt-1.5 h-1 rounded-full bg-neutral-100">
                    <div
                      className={cn("h-full rounded-full", COULEURS_SOURCES[i])}
                      style={{ width: `${source.part}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-[13px] font-medium text-neutral-800">Pages les plus vues</h3>
            {stats.pages.length === 0 ? (
              <p className="mt-4 text-[13px] text-neutral-500">Pas encore de visite sur la période.</p>
            ) : (
              <ul className="mt-4 space-y-3.5">
                {stats.pages.map((page) => (
                  <li key={page.chemin} className="flex justify-between gap-3 text-[13px]">
                    <span className="truncate text-neutral-600" title={page.chemin}>
                      {titresPages.get(page.chemin) ?? page.chemin}
                    </span>
                    <span className="font-mono text-neutral-900">{formatNombre(page.vues)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <p className="px-5 py-6 text-[14px] text-neutral-500 sm:px-6">{indisponible}</p>
      )}
    </Panneau>
  );
}
