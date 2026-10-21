"use client";

import { Lien as Link } from "@/components/ui/lien";
import { useEffect, useRef, useState, useTransition } from "react";

import { envoyerDemande, type EnvoiDemande, type ResultatEnvoi } from "@/app/[lang]/contact/actions";
import { Editable, useModeEdition } from "@/components/cms/editable";
import { Container } from "@/components/ui/container";
import type { TypeDemande } from "@/lib/demandes";
import { cn } from "@/lib/cn";
import * as FR from "@/constants";
import { useI18n } from "@/lib/i18n/client";

/** Données chiffrées, issues des mêmes sources que les pages Tarifs et Académie. */
export type OffresContact = {
  abonnements: { id: string; libelle: string; prix: number }[];
  remise: number;
  prestige: { titre: string; prix: number; description: string }[];
  juniors: { titre: string; prix: number; rythme: string; description: string }[];
  enseignants: string[];
};

const SECTIONS = {
  choix: "Contact · Choix de la demande",
  adhesion: "Contact · Devenir membre",
  cours: "Contact · Cours & stages",
  evenement: "Contact · Séminaire & privatisation",
  autre: "Contact · Autre question",
  envoi: "Contact · Coordonnées et envoi",
  merci: "Contact · Confirmation",
} as const;

const ORDRE: TypeDemande[] = ["adhesion", "cours", "evenement", "autre"];

const enumerer = (valeurs: string[]) =>
  valeurs.length <= 1 ? valeurs.join("") : `${valeurs.slice(0, -1).join(", ")} & ${valeurs.at(-1)}`;
const minuscule = (texte: string) => texte.charAt(0).toLowerCase() + texte.slice(1);
const majuscule = (texte: string) => texte.charAt(0).toUpperCase() + texte.slice(1);

/** Libellé affiché (traduit) → libellé français, pour la demande reçue par le club. */
function versFrancais(valeur: string, traduits: readonly string[], francais: readonly string[]): string {
  const i = traduits.indexOf(valeur);
  return i === -1 ? valeur : (francais[i] ?? valeur);
}

/* ─── Petits éléments du formulaire ─────────────────────────────────── */

function Picto({ d, className }: { d: React.ReactNode; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={cn("size-4 shrink-0", className)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  );
}

const pictos = {
  adhesion: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
  cours: <path d="M2 9l10-5 10 5-10 5L2 9Zm4 2.5V16c2 2 10 2 12 0v-4.5" />,
  evenement: <><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  autre: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17h.01" /></>,
  fleche: <path d="M7 17 17 7M9 7h8v8" />,
  coche: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  telephone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  cadenas: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  calendrier: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4m8-4v4" /></>,
};

function Etape({ numero, titre, texte, chemin, cheminTexte, children }: {
  numero: number;
  titre: string;
  texte?: string;
  chemin: string;
  cheminTexte?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-b border-encre/10 pb-8 pt-8 first:pt-0">
      <legend className="sr-only">{titre}</legend>
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-club-950 text-[12px] font-semibold text-sable-50">
          {numero}
        </span>
        <div>
          <Editable path={chemin} as="h3" className="font-butler text-[24px] font-medium leading-tight text-club-950">
            {titre}
          </Editable>
          {texte ? (
            <Editable path={cheminTexte ?? ""} as="p" className="mt-0.5 text-[12px] text-encre/50">
              {texte}
            </Editable>
          ) : null}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

/** Carte à choix unique (formule, type d'événement). */
function CarteChoix({ actif, onClick, titre, prix, texte, chemins }: {
  actif: boolean;
  onClick: () => void;
  titre: string;
  prix?: string;
  texte?: string;
  chemins?: { titre?: string; prix?: string; texte?: string };
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={actif}
      onClick={onClick}
      className={cn(
        "flex h-full flex-col items-start rounded-sm border p-4 text-left transition-colors",
        actif ? "border-club-950/50 bg-sable-50 ring-1 ring-club-950/20" : "border-encre/15 bg-white hover:border-encre/35",
      )}
    >
      <span className="flex items-center gap-2 text-[13px] font-semibold text-club-950">
        <span aria-hidden="true" className={cn("flex size-3.5 items-center justify-center rounded-full border", actif ? "border-club-950" : "border-encre/30")}>
          {actif ? <span className="size-1.5 rounded-full bg-club-950" /> : null}
        </span>
        <Editable path={chemins?.titre ?? ""}>{titre}</Editable>
      </span>
      {prix ? (
        <Editable path={chemins?.prix ?? ""} className="mt-2 font-butler text-[20px] leading-none text-club-950">
          {prix}
        </Editable>
      ) : null}
      {texte ? (
        <Editable path={chemins?.texte ?? ""} className="mt-1.5 text-[12px] leading-snug text-encre/55">
          {texte}
        </Editable>
      ) : null}
    </button>
  );
}

/** Choix en pastilles (un ou plusieurs). */
function Puces({ options, valeurs, onChange, multiple, chemin, label }: {
  options: readonly string[];
  valeurs: string[];
  onChange: (valeurs: string[]) => void;
  multiple?: boolean;
  /** « Section.CONSTANTE » : chaque pastille est modifiable dans l'éditeur. */
  chemin: string;
  label: string;
}) {
  return (
    <div role={multiple ? "group" : "radiogroup"} aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option, index) => {
        const actif = valeurs.includes(option);
        return (
          <button
            key={index}
            type="button"
            role={multiple ? "checkbox" : "radio"}
            aria-checked={actif}
            onClick={() =>
              onChange(multiple ? (actif ? valeurs.filter((v) => v !== option) : [...valeurs, option]) : [option])
            }
            className={cn(
              "flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] transition-colors",
              actif ? "border-club-950 bg-club-950 text-sable-50" : "border-encre/15 text-encre/75 hover:border-encre/35",
            )}
          >
            {actif ? <Picto d={pictos.coche} className="size-3.5" /> : null}
            <Editable path={`${chemin}.${index}`}>{option}</Editable>
          </button>
        );
      })}
    </div>
  );
}

/** Deux options côte à côte (règlement, public). */
function Segment({ options, valeur, onChange, chemins, label }: {
  options: readonly string[];
  valeur: number;
  onChange: (index: number) => void;
  chemins?: string[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-1 rounded-sm bg-sable-100 p-1">
      {options.map((option, index) => (
        <button
          key={index}
          type="button"
          role="radio"
          aria-checked={valeur === index}
          onClick={() => onChange(index)}
          className={cn(
            "min-h-10 rounded-sm px-3 text-[13px] transition-colors",
            valeur === index ? "bg-white font-semibold text-club-950 shadow-sm" : "text-encre/65 hover:text-encre",
          )}
        >
          <Editable path={chemins?.[index] ?? ""}>{option}</Editable>
        </button>
      ))}
    </div>
  );
}

const classeChamp =
  "h-11 w-full rounded-sm border border-encre/15 bg-white px-3.5 text-[14px] text-encre outline-none transition-colors placeholder:text-encre/35 focus:border-club-950";

function Champ({ id, label, requis, children, aide }: {
  id: string;
  label: string;
  requis?: boolean;
  aide?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[12px] font-medium text-encre/70">
        {label}
        {requis ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {aide ? <div className="mt-1.5 text-[11px] text-encre/45">{aide}</div> : null}
    </div>
  );
}

/* ─── Formulaire ───────────────────────────────────────────────────── */

type Recap = { titre: string; lignes: [string, string][] };

/**
 * Page Contact : choix de la demande, formulaire propre à chacune, résumé
 * en direct et confirmation. Les demandes arrivent dans le back-office
 * (Demandes) ; tous les textes se modifient dans Pages › Contact.
 */
export function FormulaireContact({ offres }: { offres: OffresContact }) {
  const { T, tr, euros, langue, locale } = useI18n();
  const edition = useModeEdition();
  const [type, setType] = useState<TypeDemande>("adhesion");
  const [resultat, setResultat] = useState<Extract<ResultatEnvoi, { ok: true }> | null>(null);
  const [apercuMerci, setApercuMerci] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();
  const ouvertLe = useRef(0);
  const haut = useRef<HTMLDivElement>(null);

  // Adhésion
  const [abonnement, setAbonnement] = useState(offres.abonnements[1]?.id ?? offres.abonnements[0]?.id ?? "");
  const [reglement, setReglement] = useState(0);
  const [index, setIndex] = useState("");
  const [licence, setLicence] = useState("");
  const [deja, setDeja] = useState<string[]>([]);
  // Cours
  const [publicCours, setPublicCours] = useState(0);
  const [formuleCours, setFormuleCours] = useState(offres.prestige[1]?.titre ?? "");
  const [niveau, setNiveau] = useState<string[]>([T.CONTACT_COURS_NIVEAUX[0]]);
  const [jours, setJours] = useState<string[]>([]);
  const [debut, setDebut] = useState("");
  const [enseignant, setEnseignant] = useState("");
  const [mois, setMois] = useState<{ cle: string; libelle: string }[]>([]);
  // Événement
  const [evenement, setEvenement] = useState(T.CONTACT_EVENEMENT_TYPES[0].titre);
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState(20);
  const [moment, setMoment] = useState<string[]>([T.CONTACT_EVENEMENT_MOMENTS[0]]);
  const [prestations, setPrestations] = useState<string[]>([]);
  const [budget, setBudget] = useState(T.CONTACT_EVENEMENT_BUDGETS[0]);
  const [facturation, setFacturation] = useState(0);
  const [societe, setSociete] = useState("");
  const [fonction, setFonction] = useState("");
  // Autre
  const [sujet, setSujet] = useState<string[]>([]);
  // Coordonnées
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");
  const [consentement, setConsentement] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [piege, setPiege] = useState("");

  useEffect(() => {
    ouvertLe.current = Date.now();
    // Mois de début proposés : calculés ici, la page étant prérendue.
    const format = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
    const maintenant = new Date();
    const liste = Array.from({ length: 8 }, (_, i) => {
      const d = new Date(maintenant.getFullYear(), maintenant.getMonth() + i, 1);
      const libelle = format.format(d);
      return { cle: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, libelle: libelle.charAt(0).toUpperCase() + libelle.slice(1) };
    });
    const minuteur = window.setTimeout(() => setMois(liste), 0);
    return () => window.clearTimeout(minuteur);
  }, [locale]);

  const enfant = publicCours === 1;
  const formulesCours = enfant
    ? offres.juniors.map((f) => ({ cle: f.titre, titre: tr(f.titre), prix: `${euros(f.prix)} / ${tr("an")}`, texte: tr(f.description), rythme: tr(f.rythme) }))
    : [
        ...offres.prestige.map((f) => ({ cle: f.titre, titre: tr(f.titre), prix: `${euros(f.prix)} / ${tr("mois")}`, texte: tr(f.description), rythme: tr("1 h par jour, 6 pers. max") })),
        ...T.CONTACT_COURS_SUR_DEMANDE.map((f, i) => ({ ...f, cle: ["Initiation découverte", "Cours individuel"][i] ?? f.titre, rythme: tr("À convenir") })),
      ];
  const joursCours = enfant ? T.CONTACT_COURS_JOURS_ENFANTS : T.CONTACT_COURS_JOURS_ADULTES;

  const choisirPublic = (i: number) => {
    setPublicCours(i);
    setFormuleCours(i === 1 ? offres.juniors[0]?.titre ?? "" : offres.prestige[1]?.titre ?? "");
    setJours([]);
  };

  /* Résumé de la colonne de droite. */
  const abo = offres.abonnements.find((a) => a.id === abonnement);
  const formule = formulesCours.find((f) => f.cle === formuleCours);
  const recap: Recap =
    type === "adhesion"
      ? {
          // Ordre des mots propre à chaque langue : « Abonnement couple », « Couple membership ».
          titre: abo ? majuscule(tr("Abonnement {formule}").replace("{formule}", minuscule(tr(abo.libelle)))) : tr("Abonnement"),
          lignes: [
            [tr("Formule"), abo ? tr(abo.libelle) : "—"],
            [tr("Tarif annuel"), abo ? euros(abo.prix) : "—"],
            [tr("En comptant"), abo ? euros(Math.round(abo.prix * (1 - offres.remise))) : "—"],
            [tr("Règlement"), reglement === 0 ? tr("Comptant") : tr("En plusieurs fois")],
          ],
        }
      : type === "cours"
        ? {
            titre: formule?.titre || tr("Cours & stages"),
            lignes: [
              [tr("Public"), `${enfant ? tr("Enfant") : tr("Adulte")}${niveau[0] ? ` · ${minuscule(niveau[0])}` : ""}`],
              [tr("Tarif"), formule?.prix ?? "—"],
              [tr("Rythme"), formule?.rythme ?? "—"],
              [tr("Jours"), enumerer(jours) || tr("À convenir")],
            ],
          }
        : type === "evenement"
          ? {
              titre: `${evenement} · ${participants} ${participants > 1 ? tr("personnes") : tr("personne")}`,
              lignes: [
                [tr("Date"), date ? new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`)) : tr("À définir")],
                [tr("Format"), moment[0] ?? "—"],
                [tr("Prestations"), enumerer(prestations) || "—"],
                ...(facturation === 0 && societe ? [[tr("Société"), societe] as [string, string]] : []),
              ],
            }
          : { titre: sujet[0] ?? tr("Votre question"), lignes: [[tr("Sujet"), sujet[0] ?? "—"]] };

  const textes = {
    adhesion: { bouton: T.CONTACT_ADHESION_BOUTON, suite: T.CONTACT_ADHESION_SUITE, equipe: T.CONTACT_ADHESION_EQUIPE, equipeTexte: T.CONTACT_ADHESION_EQUIPE_TEXTE, prefixe: "CONTACT_ADHESION" },
    cours: { bouton: T.CONTACT_COURS_BOUTON, suite: T.CONTACT_COURS_SUITE, equipe: T.CONTACT_COURS_EQUIPE, equipeTexte: T.CONTACT_COURS_EQUIPE_TEXTE, prefixe: "CONTACT_COURS" },
    evenement: { bouton: T.CONTACT_EVENEMENT_BOUTON, suite: T.CONTACT_EVENEMENT_SUITE, equipe: T.CONTACT_EVENEMENT_EQUIPE, equipeTexte: T.CONTACT_EVENEMENT_EQUIPE_TEXTE, prefixe: "CONTACT_EVENEMENT" },
    autre: { bouton: T.CONTACT_AUTRE_BOUTON, suite: T.CONTACT_AUTRE_SUITE, equipe: T.CONTACT_AUTRE_EQUIPE, equipeTexte: T.CONTACT_AUTRE_EQUIPE_TEXTE, prefixe: "CONTACT_AUTRE" },
  }[type];
  const sectionType = SECTIONS[type];

  const envoyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (edition) return;
    setErreur(null);
    const fr = (valeur: string, cle: keyof typeof FR) =>
      versFrancais(valeur, T[cle] as unknown as string[], FR[cle] as unknown as string[]);
    const titresEvenements = T.CONTACT_EVENEMENT_TYPES.map((t) => t.titre);
    const champs: EnvoiDemande["champs"] =
      type === "adhesion"
        ? { formule: abonnement, reglement: reglement === 0 ? "comptant" : "plusieurs", index, licence, deja: fr(deja[0] ?? "", "CONTACT_ADHESION_DEJA_CHOIX") }
        : type === "cours"
          ? {
              public: enfant ? "enfant" : "adulte",
              formule: formuleCours,
              niveau: fr(niveau[0] ?? "", "CONTACT_COURS_NIVEAUX"),
              jours: jours.map((j) => fr(j, enfant ? "CONTACT_COURS_JOURS_ENFANTS" : "CONTACT_COURS_JOURS_ADULTES")),
              debut,
              enseignant,
            }
          : type === "evenement"
            ? {
                evenement: versFrancais(evenement, titresEvenements, FR.CONTACT_EVENEMENT_TYPES.map((t) => t.titre)),
                date,
                participants,
                moment: fr(moment[0] ?? "", "CONTACT_EVENEMENT_MOMENTS"),
                prestations: prestations.map((p) => fr(p, "CONTACT_EVENEMENT_PRESTATIONS")),
                budget: fr(budget, "CONTACT_EVENEMENT_BUDGETS"),
                facturation: facturation === 0 ? "Société" : "Particulier",
                societe: facturation === 0 ? societe : "",
                fonction,
              }
            : { sujet: fr(sujet[0] ?? "", "CONTACT_AUTRE_SUJETS") };

    demarrer(async () => {
      const reponse = await envoyerDemande({
        type, champs, prenom, nom, email, telephone, message, consentement, newsletter, piege,
        duree: Date.now() - ouvertLe.current,
        langue,
      });
      if (reponse.ok) {
        setResultat(reponse);
        haut.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        setErreur(reponse.message);
      }
    });
  };

  /* ─── Confirmation ─── */
  const merci =
    resultat ??
    (edition && apercuMerci
      ? { ok: true as const, prenom: "Claire", email: "claire.dubois@mail.fr", equipe: "la direction du club", recapitulatif: [{ libelle: "Demande", valeur: "Devenir membre" }, { libelle: "Formule", valeur: "Abonnement couple · 3 732 €" }, { libelle: "Envoyée le", valeur: "12 octobre 2026 à 9h12" }] }
      : null);

  const remplir = (gabarit: string, valeurs: Record<string, string>) =>
    gabarit.replace(/\{(\w+)\}/g, (tout, cle: string) => valeurs[cle] ?? tout);

  const basculeApercu = edition ? (
    <button
      type="button"
      onClick={() => setApercuMerci((v) => !v)}
      className="fixed bottom-4 left-4 z-50 rounded-full bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white shadow-lg"
    >
      {apercuMerci ? "Revenir au formulaire" : "Voir la page de confirmation"}
    </button>
  ) : null;

  if (merci) {
    return (
      <section ref={haut} className="scroll-mt-24 bg-white py-16 lg:py-24">
        {basculeApercu}
        <Container className="max-w-3xl text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-club-950 text-sable-50">
            <Picto d={pictos.coche} className="size-6" />
          </span>
          <Editable path={`${SECTIONS.merci}.CONTACT_MERCI_TITRE`} as="h2" className="mt-6 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[42px]">
            {remplir(T.CONTACT_MERCI_TITRE, { prenom: merci.prenom })}
          </Editable>
          <Editable path={`${SECTIONS.merci}.CONTACT_MERCI_TEXTE`} as="p" className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-encre/65">
            {remplir(T.CONTACT_MERCI_TEXTE, { equipe: merci.equipe, email: merci.email })}
          </Editable>

          <div className="mx-auto mt-8 max-w-md rounded-sm bg-sable-100 p-6 text-left">
            <Editable path={`${SECTIONS.merci}.CONTACT_MERCI_RECAP`} as="p" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-or-600">
              {T.CONTACT_MERCI_RECAP}
            </Editable>
            <dl className="mt-3 divide-y divide-encre/10 text-[13px]">
              {merci.recapitulatif.map((ligne) => (
                <div key={ligne.libelle} className="flex justify-between gap-6 py-2.5">
                  <dt className="text-encre/55">{ligne.libelle}</dt>
                  <dd className="text-right font-semibold text-club-950">{ligne.valeur}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-sm bg-club-950 px-5 py-3 text-[14px] font-semibold text-sable-50 hover:bg-club-800">
              <Editable path={`${SECTIONS.merci}.CONTACT_MERCI_BOUTON_1`}>{T.CONTACT_MERCI_BOUTON_1}</Editable>
            </Link>
            <Link href="/le-parcours" className="rounded-sm border border-club-950/25 px-5 py-3 text-[14px] font-semibold text-club-950 hover:border-club-950">
              <Editable path={`${SECTIONS.merci}.CONTACT_MERCI_BOUTON_2`}>{T.CONTACT_MERCI_BOUTON_2}</Editable>
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  /* ─── Formulaire ─── */
  let etape = 0;
  const numero = () => ++etape;

  return (
    <section ref={haut} id="formulaire" className="scroll-mt-24 bg-white py-14 lg:py-20">
      {basculeApercu}
      <Container>
        <Editable path={`${SECTIONS.choix}.CONTACT_CHOIX_TITRE`} as="h2" className="font-butler text-[32px] font-medium leading-tight text-club-950 sm:text-[40px]">
          {T.CONTACT_CHOIX_TITRE}
        </Editable>

        <div role="radiogroup" aria-label={tr("Type de demande")} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ORDRE.map((cle, i) => {
            const choix = T.CONTACT_CHOIX[i];
            if (!choix) return null;
            const actif = type === cle;
            return (
              <button
                key={cle}
                type="button"
                role="radio"
                aria-checked={actif}
                onClick={() => {
                  setType(cle);
                  setErreur(null);
                }}
                className={cn(
                  "relative flex items-start gap-3 rounded-sm border p-5 text-left transition-colors",
                  actif ? "border-club-950 bg-club-950 text-sable-50" : "border-encre/12 bg-white text-club-950 hover:border-encre/35",
                )}
              >
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", actif ? "bg-white/10" : "bg-sable-100")}>
                  <Picto d={pictos[cle]} />
                </span>
                <span className="min-w-0 flex-1">
                  <Editable path={`${SECTIONS.choix}.CONTACT_CHOIX.${i}.titre`} className="block font-butler text-[19px] leading-tight">
                    {choix.titre}
                  </Editable>
                  <Editable path={`${SECTIONS.choix}.CONTACT_CHOIX.${i}.texte`} className={cn("mt-1.5 block text-[12px] leading-snug", actif ? "text-sable-50/70" : "text-encre/55")}>
                    {choix.texte}
                  </Editable>
                </span>
                <span aria-hidden="true" className={cn("absolute right-3 top-3", actif ? "flex size-5 items-center justify-center rounded-full bg-or-500 text-white" : "text-encre/35")}>
                  <Picto d={actif ? pictos.coche : pictos.fleche} className="size-3.5" />
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          <form onSubmit={envoyer} noValidate aria-label={tr("Votre demande")}>
            {type === "adhesion" ? (
              <>
                <Etape numero={numero()} titre={T.CONTACT_ADHESION_ETAPE_1} texte={T.CONTACT_ADHESION_ETAPE_1_TEXTE} chemin={`${sectionType}.CONTACT_ADHESION_ETAPE_1`} cheminTexte={`${sectionType}.CONTACT_ADHESION_ETAPE_1_TEXTE`}>
                  <div role="radiogroup" aria-label={tr("Formule")} className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {offres.abonnements.map((a) => (
                      <CarteChoix key={a.id} actif={abonnement === a.id} onClick={() => setAbonnement(a.id)} titre={tr(a.libelle)} prix={euros(a.prix)} />
                    ))}
                  </div>
                  <Editable path={`${sectionType}.CONTACT_ADHESION_REGLEMENT`} as="p" className="mb-2 mt-6 text-[12px] font-medium text-encre/70">
                    {T.CONTACT_ADHESION_REGLEMENT}
                  </Editable>
                  <Segment
                    label={T.CONTACT_ADHESION_REGLEMENT}
                    options={[`${tr("Comptant")} · −${Math.round(offres.remise * 100)} %`, tr("En plusieurs fois")]}
                    valeur={reglement}
                    onChange={setReglement}
                  />
                </Etape>

                <Etape numero={numero()} titre={T.CONTACT_ADHESION_ETAPE_2} chemin={`${sectionType}.CONTACT_ADHESION_ETAPE_2`}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Champ id="index" label={tr("Index")} aide={<Editable path={`${sectionType}.CONTACT_ADHESION_INDEX_AIDE`}>{T.CONTACT_ADHESION_INDEX_AIDE}</Editable>}>
                      <input id="index" value={index} onChange={(e) => setIndex(e.target.value)} inputMode="decimal" maxLength={20} placeholder="ex. 24,5" className={classeChamp} />
                    </Champ>
                    <Champ id="licence" label={tr("N° de licence FFGolf")}>
                      <input id="licence" value={licence} onChange={(e) => setLicence(e.target.value)} maxLength={30} placeholder={tr("Facultatif")} className={classeChamp} />
                    </Champ>
                  </div>
                  <Editable path={`${sectionType}.CONTACT_ADHESION_DEJA`} as="p" className="mb-2 mt-5 text-[12px] font-medium text-encre/70">
                    {T.CONTACT_ADHESION_DEJA}
                  </Editable>
                  <Puces label={T.CONTACT_ADHESION_DEJA} options={T.CONTACT_ADHESION_DEJA_CHOIX} valeurs={deja} onChange={setDeja} chemin={`${sectionType}.CONTACT_ADHESION_DEJA_CHOIX`} />
                </Etape>
              </>
            ) : null}

            {type === "cours" ? (
              <>
                <Etape numero={numero()} titre={T.CONTACT_COURS_ETAPE_1} chemin={`${sectionType}.CONTACT_COURS_ETAPE_1`}>
                  <Segment
                    label={T.CONTACT_COURS_ETAPE_1}
                    options={T.CONTACT_COURS_PUBLICS}
                    valeur={publicCours}
                    onChange={choisirPublic}
                    chemins={T.CONTACT_COURS_PUBLICS.map((_, i) => `${sectionType}.CONTACT_COURS_PUBLICS.${i}`)}
                  />
                </Etape>

                <Etape numero={numero()} titre={T.CONTACT_COURS_ETAPE_2} texte={T.CONTACT_COURS_ETAPE_2_TEXTE} chemin={`${sectionType}.CONTACT_COURS_ETAPE_2`} cheminTexte={`${sectionType}.CONTACT_COURS_ETAPE_2_TEXTE`}>
                  <div role="radiogroup" aria-label={tr("Formule")} className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {formulesCours.map((f, i) => {
                      const surDemande = !enfant && i >= offres.prestige.length ? i - offres.prestige.length : -1;
                      const chemin = `${sectionType}.CONTACT_COURS_SUR_DEMANDE.${surDemande}`;
                      return (
                        <CarteChoix
                          key={f.cle}
                          actif={formuleCours === f.cle}
                          onClick={() => setFormuleCours(f.cle)}
                          titre={f.titre}
                          prix={f.prix}
                          texte={f.texte}
                          chemins={surDemande >= 0 ? { titre: `${chemin}.titre`, prix: `${chemin}.prix`, texte: `${chemin}.texte` } : undefined}
                        />
                      );
                    })}
                  </div>
                  {!enfant ? (
                    <Editable path={`${sectionType}.CONTACT_COURS_NOTE`} as="p" className="mt-3 text-[11px] text-encre/50">
                      {T.CONTACT_COURS_NOTE}
                    </Editable>
                  ) : null}
                </Etape>

                <Etape numero={numero()} titre={T.CONTACT_COURS_ETAPE_3} chemin={`${sectionType}.CONTACT_COURS_ETAPE_3`}>
                  <p className="mb-2 text-[12px] font-medium text-encre/70">{tr("Niveau")}</p>
                  <Puces label={tr("Niveau")} options={T.CONTACT_COURS_NIVEAUX} valeurs={niveau} onChange={setNiveau} chemin={`${sectionType}.CONTACT_COURS_NIVEAUX`} />
                  <p className="mb-2 mt-5 text-[12px] font-medium text-encre/70">{tr("Jours de cours")}</p>
                  <Puces
                    label={tr("Jours de cours")}
                    multiple
                    options={joursCours}
                    valeurs={jours}
                    onChange={setJours}
                    chemin={`${sectionType}.${enfant ? "CONTACT_COURS_JOURS_ENFANTS" : "CONTACT_COURS_JOURS_ADULTES"}`}
                  />
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Champ id="debut" label={tr("Début souhaité")}>
                      <select id="debut" value={debut} onChange={(e) => setDebut(e.target.value)} className={classeChamp}>
                        <option value="">{tr("Dès que possible")}</option>
                        {mois.map((m) => (
                          <option key={m.cle} value={m.cle}>{m.libelle}</option>
                        ))}
                      </select>
                    </Champ>
                    <Champ id="enseignant" label={tr("Enseignant")}>
                      <select id="enseignant" value={enseignant} onChange={(e) => setEnseignant(e.target.value)} className={classeChamp}>
                        <option value="">{tr("Pas de préférence")}</option>
                        {offres.enseignants.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </Champ>
                  </div>
                </Etape>
              </>
            ) : null}

            {type === "evenement" ? (
              <>
                <Etape numero={numero()} titre={T.CONTACT_EVENEMENT_ETAPE_1} chemin={`${sectionType}.CONTACT_EVENEMENT_ETAPE_1`}>
                  <div role="radiogroup" aria-label={tr("Type d'événement")} className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {T.CONTACT_EVENEMENT_TYPES.map((t, i) => (
                      <CarteChoix
                        key={i}
                        actif={evenement === t.titre}
                        onClick={() => setEvenement(t.titre)}
                        titre={t.titre}
                        texte={t.texte}
                        chemins={{ titre: `${sectionType}.CONTACT_EVENEMENT_TYPES.${i}.titre`, texte: `${sectionType}.CONTACT_EVENEMENT_TYPES.${i}.texte` }}
                      />
                    ))}
                  </div>
                </Etape>

                <Etape numero={numero()} titre={T.CONTACT_EVENEMENT_ETAPE_2} chemin={`${sectionType}.CONTACT_EVENEMENT_ETAPE_2`}>
                  <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
                    <Champ id="date" label={tr("Date souhaitée")} aide={<Editable path={`${sectionType}.CONTACT_EVENEMENT_DATE_AIDE`}>{T.CONTACT_EVENEMENT_DATE_AIDE}</Editable>}>
                      <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={classeChamp} />
                    </Champ>
                    <Champ id="participants" label={tr("Nombre de participants")} requis>
                      <div className="flex h-11 items-center rounded-sm border border-encre/15">
                        <button type="button" aria-label={tr("Un participant de moins")} onClick={() => setParticipants((n) => Math.max(1, n - 1))} className="h-full px-3.5 text-[18px] text-encre/60 hover:text-encre">−</button>
                        <input
                          id="participants"
                          inputMode="numeric"
                          value={participants}
                          onChange={(e) => setParticipants(Math.max(1, Math.min(2000, Number(e.target.value.replace(/\D/g, "")) || 1)))}
                          className="w-full min-w-0 bg-transparent text-center text-[15px] font-semibold text-club-950 outline-none"
                        />
                        <button type="button" aria-label={tr("Un participant de plus")} onClick={() => setParticipants((n) => Math.min(2000, n + 1))} className="h-full px-3.5 text-[18px] text-encre/60 hover:text-encre">+</button>
                      </div>
                    </Champ>
                  </div>
                  <p className="mb-2 mt-5 text-[12px] font-medium text-encre/70">{tr("Moment")}</p>
                  <Puces label={tr("Moment")} options={T.CONTACT_EVENEMENT_MOMENTS} valeurs={moment} onChange={setMoment} chemin={`${sectionType}.CONTACT_EVENEMENT_MOMENTS`} />
                </Etape>

                <Etape numero={numero()} titre={T.CONTACT_EVENEMENT_ETAPE_3} texte={T.CONTACT_EVENEMENT_ETAPE_3_TEXTE} chemin={`${sectionType}.CONTACT_EVENEMENT_ETAPE_3`} cheminTexte={`${sectionType}.CONTACT_EVENEMENT_ETAPE_3_TEXTE`}>
                  <Puces label={tr("Prestations")} multiple options={T.CONTACT_EVENEMENT_PRESTATIONS} valeurs={prestations} onChange={setPrestations} chemin={`${sectionType}.CONTACT_EVENEMENT_PRESTATIONS`} />
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Champ id="budget" label={tr("Budget indicatif")}>
                      <select id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={classeChamp}>
                        {T.CONTACT_EVENEMENT_BUDGETS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </Champ>
                    <Champ id="facturation" label={tr("Facture au nom de")}>
                      <select id="facturation" value={facturation} onChange={(e) => setFacturation(Number(e.target.value))} className={classeChamp}>
                        <option value={0}>{tr("Société")}</option>
                        <option value={1}>{tr("Particulier")}</option>
                      </select>
                    </Champ>
                  </div>
                </Etape>
              </>
            ) : null}

            {type === "autre" ? (
              <Etape numero={numero()} titre={T.CONTACT_AUTRE_ETAPE_1} chemin={`${sectionType}.CONTACT_AUTRE_ETAPE_1`}>
                <Puces label={tr("Sujet")} options={T.CONTACT_AUTRE_SUJETS} valeurs={sujet} onChange={setSujet} chemin={`${sectionType}.CONTACT_AUTRE_SUJETS`} />
              </Etape>
            ) : null}

            <Etape numero={numero()} titre={T.CONTACT_COORDONNEES_TITRE} chemin={`${SECTIONS.envoi}.CONTACT_COORDONNEES_TITRE`}>
              <div className="grid gap-4 sm:grid-cols-2">
                {type === "evenement" && facturation === 0 ? (
                  <>
                    <Champ id="societe" label={tr("Société")} requis>
                      <input id="societe" value={societe} onChange={(e) => setSociete(e.target.value)} maxLength={80} autoComplete="organization" className={classeChamp} />
                    </Champ>
                    <Champ id="fonction" label={tr("Fonction")}>
                      <input id="fonction" value={fonction} onChange={(e) => setFonction(e.target.value)} maxLength={60} autoComplete="organization-title" className={classeChamp} />
                    </Champ>
                  </>
                ) : null}
                <Champ id="prenom" label={tr("Prénom")} requis>
                  <input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} maxLength={60} autoComplete="given-name" required className={classeChamp} />
                </Champ>
                <Champ id="nom" label={tr("Nom")} requis>
                  <input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} maxLength={60} autoComplete="family-name" required className={classeChamp} />
                </Champ>
                <Champ id="email" label={tr("E-mail")} requis>
                  <div className="relative">
                    <Picto d={pictos.mail} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-encre/35" />
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} autoComplete="email" required className={cn(classeChamp, "pl-9")} />
                  </div>
                </Champ>
                <Champ id="telephone" label={tr("Téléphone")}>
                  <div className="relative">
                    <Picto d={pictos.telephone} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-encre/35" />
                    <input id="telephone" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} maxLength={30} autoComplete="tel" className={cn(classeChamp, "pl-9")} />
                  </div>
                </Champ>
                <div className="sm:col-span-2">
                  <Champ id="message" label={tr("Votre message")} requis={type === "autre"}>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={2000}
                      rows={4}
                      placeholder={T.CONTACT_MESSAGE_EXEMPLE}
                      className={cn(classeChamp, "h-auto resize-y py-3")}
                    />
                  </Champ>
                </div>
              </div>

              {/* Champ piège : invisible pour les visiteurs, rempli par les robots. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
                <label htmlFor="site-web">Site web</label>
                <input id="site-web" tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} />
              </div>
            </Etape>

            <div className="space-y-2.5 pt-6 text-[13px] text-encre/75">
              <label className="flex items-start gap-2.5">
                <input type="checkbox" checked={consentement} onChange={(e) => setConsentement(e.target.checked)} className="mt-0.5 size-4 accent-club-950" />
                <span>
                  <Editable path={`${SECTIONS.envoi}.CONTACT_CONSENTEMENT`}>{T.CONTACT_CONSENTEMENT}</Editable> <span aria-hidden="true">*</span>
                </span>
              </label>
              <label className="flex items-start gap-2.5">
                <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="mt-0.5 size-4 accent-club-950" />
                <Editable path={`${SECTIONS.envoi}.CONTACT_NEWSLETTER`}>{T.CONTACT_NEWSLETTER}</Editable>
              </label>
            </div>

            {erreur ? (
              <p role="alert" className="mt-5 rounded-sm bg-red-50 px-4 py-3 text-[13px] text-red-800">
                {erreur}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button
                type="submit"
                disabled={enCours}
                className="flex items-center gap-2 rounded-sm bg-or-500 px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-or-600 disabled:opacity-60"
              >
                {enCours ? tr("Envoi…") : <Editable path={`${sectionType}.${textes.prefixe}_BOUTON`}>{textes.bouton}</Editable>}
                <span aria-hidden="true">→</span>
              </button>
              <p className="flex items-center gap-1.5 text-[12px] text-encre/45">
                <Picto d={pictos.cadenas} className="size-3.5" />
                <Editable path={`${SECTIONS.envoi}.CONTACT_RASSURANCE`}>{T.CONTACT_RASSURANCE}</Editable>
              </p>
            </div>
          </form>

          <aside aria-label={tr("Résumé de votre demande")} className="rounded-sm bg-club-950 p-6 text-sable-50 shadow-[0_12px_30px_rgba(16,24,40,0.18)] lg:sticky lg:top-28">
            <Editable path={`${SECTIONS.envoi}.CONTACT_RECAP_SURTITRE`} as="p" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-or-400">
              {T.CONTACT_RECAP_SURTITRE}
            </Editable>
            <p className="mt-3 font-butler text-[26px] leading-tight">{recap.titre}</p>
            <dl className="mt-4 divide-y divide-white/10 text-[13px]">
              {recap.lignes.map(([libelle, valeur]) => (
                <div key={libelle} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-sable-50/55">{libelle}</dt>
                  <dd className="text-right font-semibold">{valeur}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 rounded-sm bg-white/5 p-4">
              <Editable path={`${SECTIONS.envoi}.CONTACT_SUITE_TITRE`} as="p" className="text-[12px] font-semibold text-or-400">
                {T.CONTACT_SUITE_TITRE}
              </Editable>
              <ol className="mt-3 space-y-2.5 text-[12px] leading-snug text-sable-50/80">
                {textes.suite.map((ligne, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center rounded-full border border-or-400/60 text-[10px] text-or-400">
                      {i + 1}
                    </span>
                    <Editable path={`${sectionType}.${textes.prefixe}_SUITE.${i}`}>{ligne}</Editable>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-or-500 text-white">
                <Picto d={pictos[type]} />
              </span>
              <span className="min-w-0">
                <Editable path={`${sectionType}.${textes.prefixe}_EQUIPE`} className="block text-[13px] font-semibold">
                  {textes.equipe}
                </Editable>
                <Editable path={`${sectionType}.${textes.prefixe}_EQUIPE_TEXTE`} className="block text-[11px] text-sable-50/55">
                  {textes.equipeTexte}
                </Editable>
              </span>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
