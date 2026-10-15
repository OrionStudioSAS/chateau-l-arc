import Link from "next/link";
import type { Metadata } from "next";

import {
  Evolution,
  formatNombre,
  LienBouton,
  Panneau,
  Pastille,
  Recapitulatif,
} from "@/components/admin/accueil/blocs";
import { PerformanceSite } from "@/components/admin/accueil/performance";
import { Recommandations, type Recommandation } from "@/components/admin/accueil/recommandations";
import { IconeAdmin } from "@/components/admin/icone-admin";
import { equipeOrion } from "@/config/admin";
import { site } from "@/config/site";
import {
  bornes,
  dateLongue,
  estPeriode,
  libelleIntervalle,
  periodes,
  ymd,
} from "@/lib/analytics/periodes";
import { analyticsConfigure, getStatistiques } from "@/lib/analytics/statistiques";
import { derniereModification } from "@/lib/contenu/depot";
import { lireContenu } from "@/lib/contenu/stockage";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { valeurStatut } from "@/lib/statut";

export const metadata: Metadata = { title: { absolute: "Accueil · Back-office" } };
export const instant = false;

const SIX_MOIS_MS = 182 * 86_400_000;

const libellesGraphique = {
  hour: "Visites par heure",
  day: "Visites par jour",
  month: "Visites par mois",
} as const;

/** Accueil du back-office (maquette « Accueil »). */
export default async function Page({ searchParams }: PageProps<"/admin">) {
  const { periode: brut } = await searchParams;
  const periode = estPeriode(brut) ? brut : "7j";
  const [statut, popup, competitions, majTarifs] = await Promise.all([
    lireContenu("statut"),
    lireContenu("popup"),
    lireContenu("competitions"),
    derniereModification("src/lib/tarifs.ts"),
  ]);
  const stats = await getStatistiques(periode, popup.actif ? popup.version : null);
  const maintenant = new Date();
  const aujourdhui = ymd(maintenant);
  const tiret = "—";

  const tauxPopup =
    stats && stats.popupAffichagesPeriode > 0
      ? (stats.popupClics.valeur / stats.popupAffichagesPeriode) * 100
      : null;

  const sansResultats = competitions.filter(
    (c) => c.statut === "publie" && (c.dateFin ?? c.dateDebut) < aujourdhui && !c.resultatsPublies,
  );

  const recommandations: Recommandation[] = [
    ...(analyticsConfigure
      ? []
      : [
          {
            id: "suivi",
            icone: "prise" as const,
            titre: "Activez le suivi des visites",
            texte: "Visiteurs, appels et inscriptions s'afficheront ici dès que le stockage est branché.",
            action: { libelle: "Voir les intégrations", href: "/admin/integrations" },
          },
        ]),
    ...(majTarifs && maintenant.getTime() - new Date(majTarifs).getTime() > SIX_MOIS_MS
      ? [
          {
            id: `tarifs-${majTarifs.slice(0, 10)}`,
            icone: "etiquette" as const,
            titre: "Votre page Tarifs n'a pas été mise à jour depuis 6 mois",
            texte: "Vérifiez les tarifs de la saison avant l'ouverture des abonnements.",
            action: { libelle: "Mettre à jour", href: "/admin/tarifs" },
          },
        ]
      : []),
    ...sansResultats.slice(0, 2).map((c) => ({
      id: `resultats-${c.id}`,
      icone: "trophee" as const,
      titre: `Publiez les résultats de « ${c.nom} »`,
      texte: "La compétition est terminée : les joueurs attendent le classement.",
      action: { libelle: "Publier les résultats", href: "/admin/competitions" },
    })),
    ...(popup.actif && popup.fin && popup.fin < aujourdhui
      ? [
          {
            id: `popup-${popup.version}`,
            icone: "megaphone" as const,
            titre: "Votre pop-up n'est plus affichée",
            texte: `Sa période s'est terminée le ${formatDate(popup.fin)}. Prolongez-la ou préparez la suivante.`,
            action: { libelle: "Modifier la pop-up", href: "/admin/popup-marketing" },
          },
        ]
      : []),
    {
      id: "orion-forms",
      icone: "formulaire",
      titre: "Recevez les demandes de séminaires directement ici",
      texte: "Orion Forms remplace l'e-mail par un formulaire suivi dans Demandes.",
      action: { libelle: "Découvrir Orion Forms", href: "/admin/orion-forms" },
      promotion: true,
    },
  ];

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-neutral-900">
            Bonjour {site.shortName} Golf Club
          </h1>
          <p className="mt-1 text-[14px] text-neutral-500">
            {dateLongue(maintenant)} · {periodes[periode].resume}
          </p>
        </div>
        <nav aria-label="Période" className="flex rounded-lg bg-neutral-100 p-1">
          {Object.entries(periodes).map(([cle, p]) => (
            <Link
              key={cle}
              href={`/admin?periode=${cle}`}
              aria-current={cle === periode ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-[13px] text-neutral-600",
                cle === periode && "bg-white font-medium text-neutral-900 shadow-sm",
              )}
            >
              {p.libelle}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 xl:grid-cols-4">
        <Recapitulatif
          libelle="Visiteurs sur le site"
          valeur={stats ? formatNombre(stats.visiteurs.valeur) : tiret}
          badge={stats ? <Evolution {...stats.visiteurs} mode="pourcent" /> : null}
          pied={periodes[periode].resume}
          serie={stats?.visiteurs.serie}
        />
        <Recapitulatif
          libelle="Clics sur les Inscriptions"
          valeur={stats ? formatNombre(stats.inscriptions.valeur) : tiret}
          badge={stats ? <Evolution {...stats.inscriptions} mode="absolu" /> : null}
          pied="Toutes compétitions"
          serie={stats?.inscriptions.serie}
        />
        <Recapitulatif
          libelle="Clics sur la pop-up"
          valeur={stats ? formatNombre(stats.popupClics.valeur) : tiret}
          badge={
            tauxPopup !== null ? (
              <Pastille ton="gris">{tauxPopup.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %</Pastille>
            ) : null
          }
          pied={popup.actif ? popup.titre : "Aucune pop-up active"}
          serie={stats?.popupClics.serie}
          tonSerie="gris"
        />
        <Recapitulatif
          libelle="Appels depuis le site"
          valeur={stats ? formatNombre(stats.appels.valeur) : tiret}
          badge={stats ? <Evolution {...stats.appels} mode="absolu" /> : null}
          pied="Bouton « Nous appeler »"
          serie={stats?.appels.serie}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <PerformanceSite
            stats={stats}
            intervalle={libelleIntervalle(periode, bornes(periode, maintenant))}
            libelleGraphique={libellesGraphique[periodes[periode].unite]}
          />
          <Recommandations liste={recommandations} />
        </div>
        <div className="space-y-6">
          <Panneau
            titre="Le site en ce moment"
            sousTitre="Ce que voient vos visiteurs"
            action={
              <Link href="/admin/statut" className="flex items-center gap-1.5 text-[14px] text-neutral-700">
                <IconeAdmin nom="crayon" className="size-4" /> Modifier
              </Link>
            }
          >
            <ul className="space-y-3 px-5 py-4 sm:px-6">
              {statut.installations.map((i) => (
                <li key={i.cle} className="flex justify-between text-[14px]">
                  <span className="text-neutral-600">{i.libelle}</span>
                  <span className="flex items-center gap-2 text-neutral-900">
                    <span className={cn("size-1.5 rounded-full", i.actif ? "bg-emerald-500" : "bg-red-500")} />
                    {valeurStatut(i)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-neutral-200 px-5 py-4 text-[14px] sm:px-6">
              <p className="flex items-center gap-2 text-[13px] text-neutral-600">
                Bandeau{" "}
                <Pastille ton={statut.bandeau.actif ? "vert" : "gris"} point>
                  {statut.bandeau.actif ? "Affiché" : "Masqué"}
                </Pastille>
              </p>
              <p className="mt-2 text-neutral-900">{statut.bandeau.message || "Aucun message"}</p>
            </div>
            <div className="border-t border-neutral-200 px-5 py-4 text-[14px] sm:px-6">
              <p className="flex items-center gap-2 text-[13px] text-neutral-600">
                Pop-up{" "}
                <Pastille ton={popup.actif ? "vert" : "gris"} point>
                  {popup.actif ? "Active" : "Désactivée"}
                </Pastille>
              </p>
              <p className="mt-2 text-neutral-900">{popup.titre}</p>
              <p className="mt-1 text-[13px] text-neutral-500">
                {popup.debut && popup.fin ? `Du ${formatDate(popup.debut)} au ${formatDate(popup.fin)}` : null}
                {stats
                  ? ` · ${formatNombre(stats.popupAffichages)} affichage${stats.popupAffichages > 1 ? "s" : ""}`
                  : null}
              </p>
            </div>
          </Panneau>

          <Panneau titre="Votre équipe Orion Studio">
            {equipeOrion.map((membre) => (
              <div key={membre.nom} className="border-b border-neutral-200 px-5 py-4 last:border-0 sm:px-6">
                <p className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-club-800 text-[13px] font-semibold text-white">
                    {membre.initiales}
                  </span>
                  <span>
                    <span className="block text-[14px] font-semibold">{membre.nom} · Orion Studio</span>
                    <span className="block text-[13px] text-neutral-500">Une question, une nouvelle page, une idée ?</span>
                  </span>
                </p>
                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <LienBouton href={membre.visio} icone="camera" externe>Demander une visio</LienBouton>
                  <LienBouton href={membre.ecrire} icone="courrier" externe>Écrire</LienBouton>
                </div>
              </div>
            ))}
          </Panneau>
        </div>
      </div>
    </>
  );
}
