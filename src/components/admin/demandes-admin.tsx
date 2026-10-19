"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import {
  assigner,
  changerStatut,
  marquerLue,
  type ResultatDemande,
} from "@/app/(admin)/admin/(tableau-de-bord)/demandes/actions";
import { IconeAdmin } from "@/components/admin/icone-admin";
import { cn } from "@/lib/cn";
import {
  brouillonReponse,
  initiales,
  nomCompte,
  statutsDemande,
  typesDemande,
  type Demande,
  type StatutDemande,
  type TypeDemande,
} from "@/lib/demandes";

const tons = {
  vert: "bg-club-600/12 text-club-800",
  bleu: "bg-sky-500/12 text-sky-800",
  or: "bg-or-400/20 text-or-700",
  gris: "bg-neutral-200/70 text-neutral-700",
};

const paris = { timeZone: "Europe/Paris" } as const;
const heure = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", ...paris });
const jourCourt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", ...paris });
const cleJour = new Intl.DateTimeFormat("fr-CA", paris);

/** « 10:24 » aujourd'hui, « Hier », sinon « 9 oct. ». */
function quand(iso: string, maintenant: string, long = false): string {
  const date = new Date(iso);
  const jour = cleJour.format(date);
  const aujourdhui = cleJour.format(new Date(maintenant));
  const hier = cleJour.format(new Date(Date.parse(maintenant) - 86_400_000));
  const h = heure.format(date);
  if (jour === aujourdhui) return long ? `aujourd'hui ${h}` : h;
  if (jour === hier) return long ? `hier ${h}` : "Hier";
  return long ? `${jourCourt.format(date)} ${h}` : jourCourt.format(date);
}

/** « 3 h 40 », « 2 j 4 h », « 25 min ». */
function duree(ms: number): string {
  const minutes = Math.max(1, Math.round(ms / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `${heures} h ${String(minutes % 60).padStart(2, "0")}`;
  return `${Math.floor(heures / 24)} j ${heures % 24} h`;
}

/** « 06 12 34 56 78 » → « 06 •• •• •• 78 ». */
const masquer = (telephone: string) => {
  const chiffres = telephone.replace(/\D/g, "");
  return chiffres.length < 6 ? telephone : `${chiffres.slice(0, 2)} •• •• •• ${chiffres.slice(-2)}`;
};

function Pastille({ demande }: { demande: Demande }) {
  return (
    <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[12px] font-medium", tons[typesDemande[demande.type].ton])}>
      {demande.etiquette}
    </span>
  );
}

function Avatar({ demande, grand }: { demande: Demande; grand?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 font-semibold text-neutral-700",
        grand ? "size-10 text-[13px]" : "size-8 text-[11px]",
      )}
    >
      {initiales(demande)}
    </span>
  );
}

/** Menu déroulant à libellé intégré (« Assignée à  Tout le monde »). */
function Select({ libelle, valeur, onChange, options }: {
  libelle?: string;
  valeur: string;
  onChange: (valeur: string) => void;
  options: { valeur: string; libelle: string }[];
}) {
  return (
    <label className="relative inline-flex h-9 items-center rounded-lg border border-neutral-200 bg-white text-[14px] transition-colors focus-within:border-club-600 hover:border-neutral-300">
      {libelle ? <span className="pl-3 text-neutral-400">{libelle}</span> : null}
      <select
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        aria-label={libelle}
        className={cn("h-full appearance-none bg-transparent pr-8 text-neutral-800 outline-none", libelle ? "pl-1.5" : "pl-3")}
      >
        {options.map((o) => (
          <option key={o.valeur} value={o.valeur}>{o.libelle}</option>
        ))}
      </select>
      <IconeAdmin nom="chevronHaut" className="pointer-events-none absolute right-2.5 size-3.5 rotate-180 text-neutral-400" />
    </label>
  );
}

/**
 * Écran « Demandes » (maquette) : les demandes de la page Contact, à traiter,
 * en cours ou traitées ; filtre par type et par personne assignée, détail à
 * droite avec un brouillon de réponse à copier.
 */
export function DemandesAdmin({
  demandes: initiales_,
  comptes,
  moi,
  maintenant,
  indisponible,
}: {
  demandes: Demande[];
  comptes: string[];
  moi: string;
  maintenant: string;
  indisponible: boolean;
}) {
  const [demandes, setDemandes] = useState(initiales_);
  const [onglet, setOnglet] = useState<StatutDemande>("a-traiter");
  const [type, setType] = useState<TypeDemande | "tous">("tous");
  const [assignee, setAssignee] = useState<string>("tous");
  const [choisie, setChoisie] = useState<string | null>(null);
  const [telephoneVisible, setTelephoneVisible] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null);
  const [, demarrer] = useTransition();
  const router = useRouter();
  const minuteur = useRef<number | undefined>(undefined);

  const afficher = (ok: boolean, texte: string) => {
    setMessage({ ok, texte });
    window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(() => setMessage(null), 3500);
  };

  const compte = (statut: StatutDemande) => demandes.filter((d) => d.statut === statut).length;

  const visibles = useMemo(
    () =>
      demandes.filter(
        (d) =>
          d.statut === onglet &&
          (type === "tous" || d.type === type) &&
          (assignee === "tous" || (assignee === "personne" ? !d.assignee : d.assignee === assignee)),
      ),
    [demandes, onglet, type, assignee],
  );

  const demande = visibles.find((d) => d.id === choisie) ?? visibles[0] ?? null;

  // Délai moyen entre réception et traitement, sur les demandes traitées.
  const delai = useMemo(() => {
    const traitees = demandes.filter((d) => d.traiteeLe);
    if (!traitees.length) return null;
    const total = traitees.reduce((s, d) => s + (Date.parse(d.traiteeLe!) - Date.parse(d.recueLe)), 0);
    return duree(total / traitees.length);
  }, [demandes]);

  /** Applique une action serveur, avec mise à jour immédiate de l'écran. */
  const executer = (action: Promise<ResultatDemande>, succes?: string) => {
    demarrer(async () => {
      const resultat = await action;
      if (resultat.ok) {
        setDemandes((liste) => liste.map((d) => (d.id === resultat.demande.id ? resultat.demande : d)));
        if (succes) afficher(true, succes);
        // Compteur « à traiter » du menu, rendu par le serveur.
        router.refresh();
      } else {
        afficher(false, resultat.message);
      }
    });
  };

  // Ouverture : la demande n'est plus « nouvelle ».
  const demandeId = demande?.id;
  const nonLue = demande ? !demande.lueLe : false;
  useEffect(() => {
    if (!demandeId || !nonLue) return;
    const minuteurLecture = window.setTimeout(() => {
      setDemandes((liste) => liste.map((d) => (d.id === demandeId ? { ...d, lueLe: new Date().toISOString() } : d)));
      void marquerLue(demandeId);
    }, 800);
    return () => window.clearTimeout(minuteurLecture);
  }, [demandeId, nonLue]);

  const ouvrir = (id: string) => {
    setChoisie(id);
    setTelephoneVisible(false);
  };

  const brouillon = demande ? brouillonReponse(demande) : "";
  const copier = async () => {
    try {
      await navigator.clipboard.writeText(brouillon);
      afficher(true, "Réponse copiée : collez-la dans votre messagerie.");
    } catch {
      afficher(false, "Copie impossible : sélectionnez le texte à la main.");
    }
  };

  const optionsComptes = [
    { valeur: "", libelle: "Personne" },
    ...comptes.map((email) => ({ valeur: email, libelle: email === moi ? `${nomCompte(email)} (moi)` : nomCompte(email) })),
  ];

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight text-neutral-900">Demandes</h1>
          <p className="mt-1 text-[14px] text-neutral-500">
            Les messages envoyés via les formulaires du site. Aucune fiche joueur n&apos;est créée ni conservée ici.
          </p>
        </div>
        <Link href="/admin/pages/contact" className="rounded-lg px-3 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100">
          Formulaires du site
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Statut" className="flex rounded-lg border border-neutral-200 bg-white p-0.5">
          {statutsDemande.map((s) => (
            <button
              key={s.cle}
              type="button"
              role="tab"
              aria-selected={onglet === s.cle}
              onClick={() => setOnglet(s.cle)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[14px] transition-colors",
                onglet === s.cle ? "border border-neutral-200 bg-white font-medium text-neutral-900 shadow-sm" : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              {s.libelle}
              <span className="text-[12px] text-neutral-400">{compte(s.cle)}</span>
            </button>
          ))}
        </div>
        <Select
          valeur={type}
          onChange={(v) => setType(v as TypeDemande | "tous")}
          options={[
            { valeur: "tous", libelle: "Tous les types" },
            ...(Object.keys(typesDemande) as TypeDemande[]).map((cle) => ({ valeur: cle, libelle: typesDemande[cle].libelle })),
          ]}
        />
        <Select
          libelle="Assignée à"
          valeur={assignee}
          onChange={setAssignee}
          options={[
            { valeur: "tous", libelle: "Tout le monde" },
            { valeur: moi, libelle: "Moi" },
            { valeur: "personne", libelle: "Personne" },
            ...comptes.filter((e) => e !== moi).map((email) => ({ valeur: email, libelle: nomCompte(email) })),
          ]}
        />
        {delai ? <p className="ml-auto text-[13px] text-neutral-500">Délai de réponse moyen : {delai}</p> : null}
      </div>

      {indisponible ? (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-[14px] text-amber-900">
          Les demandes sont momentanément illisibles (base de données injoignable). Réessayez dans un instant.
        </p>
      ) : null}

      <div className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <ul className="overflow-hidden rounded-xl border border-neutral-200 bg-white" aria-label="Demandes">
          {visibles.length === 0 ? (
            <li className="px-5 py-10 text-center text-[14px] text-neutral-500">
              {demandes.length === 0 ? "Aucune demande reçue pour l'instant." : "Aucune demande ici."}
            </li>
          ) : (
            visibles.map((d) => {
              const active = demande?.id === d.id;
              return (
                <li key={d.id} className="border-b border-neutral-100 last:border-0">
                  <button
                    type="button"
                    onClick={() => ouvrir(d.id)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "flex w-full gap-3 border-l-2 px-4 py-4 text-left transition-colors",
                      active ? "border-or-500 bg-neutral-50" : "border-transparent hover:bg-neutral-50",
                    )}
                  >
                    <Avatar demande={d} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        {!d.lueLe ? <span aria-label="Nouvelle" className="size-1.5 shrink-0 rounded-full bg-or-500" /> : null}
                        <span className={cn("truncate text-[14px] text-neutral-900", !d.lueLe && "font-semibold")}>
                          {d.prenom} {d.nom}
                        </span>
                        <span className="ml-auto shrink-0 font-mono text-[12px] text-neutral-400">{quand(d.recueLe, maintenant)}</span>
                      </span>
                      <span className="mt-1 flex items-center gap-2">
                        <Pastille demande={d} />
                        <span className="truncate text-[13px] text-neutral-800">{d.objet}</span>
                      </span>
                      {d.message ? <span className="mt-1 block truncate text-[13px] text-neutral-500">{d.message}</span> : null}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        {demande ? (
          <article className="min-w-0 rounded-xl border border-neutral-200 bg-white">
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar demande={demande} grand />
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="text-[16px] font-semibold text-neutral-900">{demande.prenom} {demande.nom}</span>
                    <Pastille demande={demande} />
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-neutral-600">
                    <a href={`mailto:${demande.email}`} className="flex items-center gap-1.5 hover:text-neutral-900">
                      <IconeAdmin nom="courrier" className="size-3.5 text-neutral-400" />
                      {demande.email}
                    </a>
                    {demande.telephone ? (
                      telephoneVisible ? (
                        <a href={`tel:${demande.telephone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-1.5 hover:text-neutral-900">
                          <IconeAdmin nom="telephone" className="size-3.5 text-neutral-400" />
                          {demande.telephone}
                        </a>
                      ) : (
                        <button type="button" onClick={() => setTelephoneVisible(true)} title="Afficher le numéro" className="flex items-center gap-1.5 hover:text-neutral-900">
                          <IconeAdmin nom="telephone" className="size-3.5 text-neutral-400" />
                          {masquer(demande.telephone)}
                        </button>
                      )
                    ) : null}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                  libelle="Assignée à"
                  valeur={demande.assignee ?? ""}
                  onChange={(email) => executer(assigner(demande.id, email || null))}
                  options={optionsComptes}
                />
                <Select
                  valeur={demande.statut}
                  onChange={(statut) => executer(changerStatut(demande.id, statut as StatutDemande))}
                  options={statutsDemande.map((s) => ({ valeur: s.cle, libelle: s.libelle }))}
                />
              </div>
            </header>

            <div className="space-y-5 px-5 py-5">
              <div>
                <h2 className="text-[18px] font-semibold text-neutral-900">{demande.objet}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-neutral-500">
                  <IconeAdmin nom="page" className="size-3.5" />
                  {typesDemande[demande.type].formulaire} · {quand(demande.recueLe, maintenant, true)}
                  {demande.newsletter ? " · souhaite recevoir la lettre du club" : ""}
                </p>
              </div>

              {demande.message ? (
                <p className="whitespace-pre-line text-[14px] leading-relaxed text-neutral-700">{demande.message}</p>
              ) : (
                <p className="text-[14px] italic text-neutral-400">Pas de message.</p>
              )}

              {demande.details.length ? (
                <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 sm:grid-cols-4">
                  {demande.details.map((ligne) => (
                    <div key={ligne.libelle} className="border-b border-r border-neutral-200 px-3.5 py-3 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(4n)]:border-r-0">
                      <dt className="text-[12px] text-neutral-500">{ligne.libelle}</dt>
                      <dd className="mt-0.5 text-[14px] font-medium text-neutral-900">{ligne.valeur}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              <div className="overflow-hidden rounded-lg border border-neutral-200">
                <div className="px-4 py-3.5">
                  <p className="flex items-center gap-2 text-[13px] font-medium text-or-700">
                    <IconeAdmin nom="etoile" className="size-4" />
                    Brouillon de réponse suggéré
                  </p>
                  <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-neutral-700">{brouillon}</p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-200 bg-neutral-50 px-4 py-2.5">
                  <a
                    href={`mailto:${demande.email}?subject=${encodeURIComponent(`Votre demande : ${demande.objet}`)}&body=${encodeURIComponent(brouillon)}`}
                    className="rounded-lg px-3 py-1.5 text-[14px] text-neutral-700 hover:bg-neutral-200/60"
                  >
                    Répondre par e-mail
                  </a>
                  {demande.statut !== "traitee" ? (
                    <button
                      type="button"
                      onClick={() => executer(changerStatut(demande.id, "traitee"), "Demande marquée comme traitée.")}
                      className="rounded-lg px-3 py-1.5 text-[14px] text-neutral-700 hover:bg-neutral-200/60"
                    >
                      Marquer comme traitée
                    </button>
                  ) : null}
                  <button type="button" onClick={copier} className="rounded-lg bg-club-950 px-3.5 py-1.5 text-[14px] font-medium text-white hover:bg-club-800">
                    Copier cette réponse
                  </button>
                </div>
              </div>
            </div>
          </article>
        ) : null}
      </div>

      {message ? (
        <p
          role="status"
          className={cn(
            "fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-lg px-4 py-2.5 text-[14px] text-white shadow-lg lg:left-[calc(50%+120px)]",
            message.ok ? "bg-club-800" : "bg-red-700",
          )}
        >
          {message.texte}
        </p>
      ) : null}
    </>
  );
}
