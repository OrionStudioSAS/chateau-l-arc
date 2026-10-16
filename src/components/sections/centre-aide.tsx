"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/ui/container";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { recherchesFrequentes, type PictoTheme, type QuestionFaq, type ThemeFaq } from "@/lib/faq";
import { proprietesLien } from "@/lib/liens";

/** TODO : photo temporaire de la bannière (allée de pins au-dessus d'un fairway). */
const IMAGE_BANNIERE = "/images/parcours.png";

const chemins: Record<PictoTheme | "telephone" | "loupe" | "pouce", React.ReactNode> = {
  drapeau: <path d="M6 21V4m0 0h11l-2 4 2 4H6" />,
  calendrier: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4m8-4v4" />
    </>
  ),
  etiquette: <path d="M3 12V4h8l10 10-8 8L3 12Zm5-4h.01" />,
  membres: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6m2 9a6 6 0 0 0-3-5.2" />
    </>
  ),
  academie: <path d="M2 9l10-5 10 5-10 5L2 9Zm4 2.5V16c2 2 10 2 12 0v-4.5" />,
  trophee: <path d="M8 4h8v5a4 4 0 0 1-8 0V4Zm0 2H5a3 3 0 0 0 3 4m8-4h3a3 3 0 0 1-3 4m-4 3v4m-3 3h6" />,
  practice: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M12 12v9m-4 0h8" />
    </>
  ),
  couverts: <path d="M7 3v8m-2-8v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1-3 4-3 7h3" />,
  salle: <path d="M4 21V9l8-5 8 5v12M9 21v-6h6v6" />,
  repere: (
    <>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  telephone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  ),
  loupe: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.5-4.5" />
    </>
  ),
  pouce: <path d="M7 11v9H4v-9h3Zm0 0 4-7a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7" />,
};

function Picto({ nom, className }: { nom: keyof typeof chemins; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("size-4 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {chemins[nom]}
    </svg>
  );
}

/** Minuscules sans accents, pour une recherche tolérante (« acces » trouve « Accès »). */
const normaliser = (texte: string) =>
  texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** « Cette réponse vous a-t-elle aidé ? » — retour local, rien n'est enregistré. */
function RetourReponse() {
  const [retour, setRetour] = useState<"oui" | "non" | null>(null);

  if (retour) {
    return (
      <p className="mt-4 text-[12px] text-encre/50">
        {retour === "oui"
          ? "Merci pour votre retour !"
          : `Merci. N'hésitez pas à appeler l'accueil au ${site.contact.telephone}.`}
      </p>
    );
  }

  return (
    <p className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-encre/50">
      Cette réponse vous a-t-elle aidé ?
      {(["oui", "non"] as const).map((valeur) => (
        <button
          key={valeur}
          type="button"
          onClick={() => setRetour(valeur)}
          className="flex min-h-9 items-center gap-1.5 rounded-sm border border-encre/15 px-3 py-1.5 text-encre/70 sm:min-h-0 sm:px-2.5 sm:py-1 transition-colors hover:border-encre/35 hover:text-encre"
        >
          <Picto nom="pouce" className={cn("size-3.5", valeur === "non" && "rotate-180")} />
          {valeur === "oui" ? "Oui" : "Non"}
        </button>
      ))}
    </p>
  );
}

function Question({ item, ouverte, groupe }: { item: QuestionFaq; ouverte: boolean; groupe: string }) {
  return (
    <details name={groupe} open={ouverte} className="group border-b border-encre/10 py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] font-semibold text-club-950 [&::-webkit-details-marker]:hidden">
        {item.question}
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-encre/15 text-[15px] leading-none text-encre/60 transition-colors group-open:border-club-950 group-open:bg-club-950 group-open:text-sable-50"
        >
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <div className="mt-3 max-w-3xl">
        <p className="text-[14px] leading-relaxed text-encre/65">{item.reponse}</p>
        {item.lien ? (
          <p className="mt-3">
            <Link
              href={item.lien.href as Route}
              {...proprietesLien(item.lien.href)}
              className="text-[13px] font-semibold text-club-950 underline-offset-4 hover:underline"
            >
              {item.lien.label} <span aria-hidden="true">→</span>
            </Link>
          </p>
        ) : null}
        <RetourReponse />
      </div>
    </details>
  );
}

/**
 * Centre d'aide : bannière avec recherche, thèmes à gauche (le thème à
 * l'écran est mis en avant), questions en accordéon.
 */
export function CentreAide({ themes: tousLesThemes }: { themes: ThemeFaq[] }) {
  const [recherche, setRecherche] = useState("");
  const [themeActif, setThemeActif] = useState(tousLesThemes[0].id);

  // Pluriels simplifiés (« voiturettes » trouve « voiturette ») : on retire
  // le « s » final des mots de plus de trois lettres.
  const termes = useMemo(
    () =>
      normaliser(recherche)
        .split(/\s+/)
        .filter(Boolean)
        .map((terme) => (terme.length > 3 ? terme.replace(/s$/, "") : terme)),
    [recherche],
  );
  const themes = useMemo(
    () =>
      tousLesThemes
        .map((theme) => ({
          ...theme,
          questions: theme.questions.filter((item) => {
            if (termes.length === 0) return true;
            const texte = normaliser(`${theme.titre} ${item.question} ${item.reponse}`);
            return termes.every((terme) => texte.includes(terme));
          }),
        }))
        .filter((theme) => theme.questions.length > 0),
    [termes, tousLesThemes],
  );

  // Thème mis en avant dans la colonne : le dernier dont le titre a franchi
  // le haut de l'écran (sous l'en-tête).
  useEffect(() => {
    let demande = 0;
    const suivre = () => {
      demande = 0;
      const sections = tousLesThemes
        .map(({ id }) => document.getElementById(`theme-${id}`))
        .filter((section): section is HTMLElement => section !== null);
      const passees = sections.filter((section) => section.getBoundingClientRect().top <= 160);
      const courant = (passees.at(-1) ?? sections[0])?.id.replace("theme-", "");
      if (courant) setThemeActif(courant);
    };
    const surDefilement = () => {
      if (!demande) demande = window.requestAnimationFrame(suivre);
    };
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => {
      window.removeEventListener("scroll", surDefilement);
      if (demande) window.cancelAnimationFrame(demande);
    };
  }, [tousLesThemes]);

  const rechercher = (valeur: string) => {
    setRecherche(valeur);
    document.getElementById("questions")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Bannière : la recherche filtre les questions en direct. */}
      <section className="relative -mt-20 overflow-hidden bg-club-950 pb-14 pt-36 text-white sm:pb-16 sm:pt-40">
        <Image
          src={IMAGE_BANNIERE}
          alt=""
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover"
          data-parallax="0.2"
          data-parallax-echelle="1.15"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-club-950/60" />

        <nav aria-label="Fil d'Ariane" className="absolute inset-x-0 top-[88px] px-5 text-[13px] text-white/70 sm:px-8 xl:px-10">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="font-medium text-white">
              Questions fréquentes
            </li>
          </ol>
        </nav>

        <Container className="relative text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-or-400">
            Centre d&apos;aide
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-butler text-[38px] font-medium leading-[1.1] sm:text-[56px]">
            Comment pouvons-nous vous aider ?
          </h1>

          <form
            role="search"
            onSubmit={(evenement) => {
              evenement.preventDefault();
              rechercher(recherche);
            }}
            className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-sm bg-white p-1.5 text-encre shadow-lg"
          >
            <Picto nom="loupe" className="ml-3 size-5 text-encre/40" />
            <label htmlFor="recherche-faq" className="sr-only">
              Rechercher une question
            </label>
            <input
              id="recherche-faq"
              type="search"
              value={recherche}
              onChange={(evenement) => setRecherche(evenement.target.value)}
              placeholder="Rechercher : green fee, voiturette, cours enfant…"
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-[15px] outline-none placeholder:text-encre/40"
            />
            <button
              type="submit"
              className="rounded-sm bg-or-500 px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-or-600"
            >
              Rechercher
            </button>
          </form>

          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-[12px]">
            <span className="text-white/70">Recherches fréquentes :</span>
            {recherchesFrequentes.map((terme) => (
              <button
                key={terme}
                type="button"
                onClick={() => rechercher(terme)}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                {terme}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* `data-sans-revele` : pas d'apparition au défilement ici, elle
          masquerait les réponses dépliées et la colonne collante. */}
      <section id="questions" data-sans-revele className="scroll-mt-24 bg-white py-14 lg:py-20">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
          {/* Thèmes : colonne collante à partir de 1024 px. */}
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-encre/45">Thèmes</p>
            <ul className="sans-barre -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0 lg:block lg:space-y-1">
              {tousLesThemes.map((theme) => (
                <li key={theme.id} className="shrink-0">
                  <a
                    href={`#theme-${theme.id}`}
                    onClick={() => setRecherche("")}
                    className={cn(
                      "flex items-center gap-3 whitespace-nowrap rounded-sm px-3 py-2.5 text-[13px] transition-colors lg:whitespace-normal",
                      themeActif === theme.id
                        ? "bg-sable-100 font-semibold text-club-950 lg:border-l-2 lg:border-or-500"
                        : "text-encre/70 hover:bg-sable-50",
                    )}
                  >
                    <Picto nom={theme.picto} className="text-encre/50" />
                    <span className="flex-1">{theme.titre}</span>
                    <span className="hidden text-[11px] text-encre/40 lg:inline">{theme.questions.length}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 hidden rounded-sm bg-club-950 p-6 text-sable-50 lg:block">
              <p className="text-[14px] font-semibold">Besoin d&apos;une réponse rapide ?</p>
              <p className="mt-2 text-[13px] leading-relaxed text-sable-50/70">
                L&apos;accueil golf vous répond par téléphone.
              </p>
              <a
                href={site.contact.telephoneLien}
                className="mt-4 flex items-center gap-2 text-[15px] font-semibold text-or-400"
              >
                <Picto nom="telephone" />
                {site.contact.telephone}
              </a>
            </div>
          </aside>

          <div>
            {themes.length === 0 ? (
              <div className="rounded-sm bg-sable-100 p-8 text-center">
                <p className="text-[15px] text-club-950">
                  Aucune question ne correspond à « {recherche} ».
                </p>
                <p className="mt-2 text-[14px] text-encre/60">
                  L&apos;accueil vous répond au{" "}
                  <a href={site.contact.telephoneLien} className="font-semibold text-club-950 underline">
                    {site.contact.telephone}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setRecherche("")}
                  className="mt-5 text-[13px] font-semibold text-club-950 underline-offset-4 hover:underline"
                >
                  Voir toutes les questions
                </button>
              </div>
            ) : (
              // `key` : la liste repart de zéro à chaque recherche, pour que
              // les réponses trouvées s'affichent dépliées.
              <div key={recherche} className="space-y-14">
                {themes.map((theme) => (
                  <section key={theme.id} id={`theme-${theme.id}`} className="scroll-mt-28">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="flex items-center gap-3 font-butler text-[26px] font-medium text-club-950 sm:text-[30px]">
                        <span className="flex size-10 items-center justify-center rounded-full bg-sable-100 text-club-950">
                          <Picto nom={theme.picto} />
                        </span>
                        {theme.titre}
                      </h2>
                      <p className="shrink-0 text-[12px] text-encre/45">
                        {theme.questions.length} question{theme.questions.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="mt-3">
                      {theme.questions.map((item, index) => (
                        <Question
                          key={item.question}
                          item={item}
                          groupe={`faq-${theme.id}`}
                          ouverte={index === 0}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
