"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";

import { publierPage } from "@/app/(admin)/admin/(tableau-de-bord)/pages/actions";
import { classeChamp } from "@/components/admin/competitions/champs";
import { IconeAdmin } from "@/components/admin/icone-admin";
import type { PageCms } from "@/config/pages-cms";
import { estImage, type ChampCms, type MiseAJourCms, type SectionCms } from "@/lib/cms/constantes";
import { cn } from "@/lib/cn";

type Valeur = ChampCms["valeur"];
const PREFIXE_FICHIER = "fichier:";

/** Réduit une image à 2400 px de large au plus (JPEG) : envoi léger, rendu net. */
async function reduire(fichier: File): Promise<File> {
  const image = await createImageBitmap(fichier);
  const echelle = Math.min(1, 2400 / image.width);
  const toile = document.createElement("canvas");
  toile.width = Math.round(image.width * echelle);
  toile.height = Math.round(image.height * echelle);
  toile.getContext("2d")?.drawImage(image, 0, 0, toile.width, toile.height);
  const blob = await new Promise<Blob | null>((ok) => toile.toBlob(ok, "image/jpeg", 0.85));
  if (!blob) throw new Error("Image illisible");
  return new File([blob], fichier.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
}

/** « Section.NOM » ou « Section.NOM.2.titre » → morceaux. */
function decouper(chemin: string) {
  const [section, nom, index, cle] = chemin.split(".");
  return { section, nom, index: index === undefined ? null : Number(index), cle: cle ?? null };
}

function ChampImage({
  valeur,
  apercu,
  onChoisir,
}: {
  valeur: string;
  apercu: string;
  onChoisir: (fichier: File) => void;
}) {
  const champ = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={apercu} alt="" className="h-12 w-16 rounded object-cover" />
      <p className="min-w-0 flex-1 truncate text-[12px] text-neutral-500">
        {valeur.startsWith(PREFIXE_FICHIER) ? "Nouvelle image" : valeur.split("/").pop()}
      </p>
      <input
        ref={champ}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Choisir une image"
        onChange={(e) => {
          const fichier = e.target.files?.[0];
          if (fichier) onChoisir(fichier);
          e.target.value = "";
        }}
      />
      <button type="button" onClick={() => champ.current?.click()} className="rounded-md px-2.5 py-1.5 text-[13px] font-medium text-neutral-700 hover:bg-neutral-200/60">
        Remplacer
      </button>
    </div>
  );
}

function ChampTexte({
  id,
  valeur,
  actif,
  onChange,
  onFocus,
}: {
  id: string;
  valeur: string;
  actif: boolean;
  onChange: (v: string) => void;
  onFocus: () => void;
}) {
  const long = valeur.length > 70 || valeur.includes("\n");
  const commun = cn(classeChamp, actif && "border-or-500 ring-2 ring-or-500/20");
  return long ? (
    <textarea id={id} value={valeur} onFocus={onFocus} onChange={(e) => onChange(e.target.value)} rows={Math.min(8, Math.ceil(valeur.length / 45) + 1)} className={cn(commun, "resize-y leading-relaxed")} />
  ) : (
    <input id={id} value={valeur} onFocus={onFocus} onChange={(e) => onChange(e.target.value)} className={commun} />
  );
}

/**
 * Éditeur visuel d'une page (rubrique « Pages ») : la page s'affiche dans un
 * aperçu (iframe, ?edit) ; un clic sur un texte ou une image ouvre le champ
 * correspondant, chaque saisie s'applique en direct dans l'aperçu. La
 * publication modifie src/constants.ts : le design (CSS) n'est jamais touché.
 */
export function EditeurVisuel({ page, sections }: { page: PageCms; sections: SectionCms[] }) {
  const champs = useMemo(
    () => new Map(sections.flatMap((s) => s.champs.map((c) => [c.nom, { ...c, section: s.nom }]))),
    [sections],
  );
  const [publies, setPublies] = useState<Record<string, Valeur>>(() =>
    Object.fromEntries([...champs.values()].map((c) => [c.nom, c.valeur])),
  );
  const [brouillon, setBrouillon] = useState<Record<string, Valeur>>(publies);
  const [fichiers, setFichiers] = useState<Record<string, { fichier: File; url: string }>>({});
  const [presents, setPresents] = useState<string[] | null>(null);
  const [actif, setActif] = useState<string | null>(null);
  const [appareil, setAppareil] = useState<"ordinateur" | "mobile">("ordinateur");
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null);
  const [enCours, demarrer] = useTransition();
  const iframe = useRef<HTMLIFrameElement>(null);
  const panneau = useRef<HTMLDivElement>(null);

  const envoyer = useCallback((donnees: Record<string, unknown>) => {
    iframe.current?.contentWindow?.postMessage(donnees, window.location.origin);
  }, []);

  // URL locale des images choisies, lisible sans attendre le rendu suivant.
  const urlsLocales = useRef<Record<string, string>>({});

  /** URL affichable d'une valeur d'image (fichier choisi ou image du site). */
  const urlImage = useCallback((valeur: string) => urlsLocales.current[valeur] ?? valeur, []);

  /** Pousse dans l'aperçu toutes les valeurs d'un champ (texte ou éléments de liste). */
  const pousser = useCallback(
    (nom: string, valeur: Valeur, section: string) => {
      if (typeof valeur === "string") {
        envoyer({ type: "cms:field-update", path: `${section}.${nom}`, value: estImage(valeur) || valeur.startsWith(PREFIXE_FICHIER) ? urlImage(valeur) : valeur });
      } else if (Array.isArray(valeur)) {
        valeur.forEach((element, i) => {
          if (typeof element === "string") {
            envoyer({
              type: "cms:field-update",
              path: `${section}.${nom}.${i}`,
              value: estImage(element) || element.startsWith(PREFIXE_FICHIER) ? urlImage(element) : element,
            });
          } else {
            for (const [cle, v] of Object.entries(element)) {
              envoyer({
                type: "cms:field-update",
                path: `${section}.${nom}.${i}.${cle}`,
                value: estImage(v) || v.startsWith(PREFIXE_FICHIER) ? urlImage(v) : v,
              });
            }
          }
        });
      }
    },
    [envoyer, urlImage],
  );

  // Messages de l'aperçu : zones présentes, clics.
  useEffect(() => {
    const surMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== iframe.current?.contentWindow) return;
      if (e.data?.type === "cms:ready") {
        setPresents(e.data.chemins ?? []);
        // Aperçu (re)chargé : on y remet la saisie en cours.
        for (const [nom, valeur] of Object.entries(brouillon)) {
          const champ = champs.get(nom);
          if (champ && JSON.stringify(valeur) !== JSON.stringify(champ.valeur)) pousser(nom, valeur, champ.section);
        }
      }
      if (e.data?.type === "cms:field-click") {
        setActif(e.data.path);
        envoyer({ type: "cms:focus", path: e.data.path });
        window.setTimeout(() => {
          const el = panneau.current?.querySelector<HTMLElement>(`[data-champ="${CSS.escape(e.data.path)}"]`);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
          el?.querySelector<HTMLElement>("input:not([type=file]), textarea")?.focus({ preventScroll: true });
        }, 50);
      }
    };
    window.addEventListener("message", surMessage);
    return () => window.removeEventListener("message", surMessage);
  }, [brouillon, champs, envoyer, pousser]);

  // Sections visibles sur la page, dans l'ordre de l'aperçu.
  const sectionsPage = useMemo(() => {
    if (!presents) return [];
    const ordre: string[] = [];
    for (const chemin of presents) {
      const { section } = decouper(chemin);
      if (!ordre.includes(section)) ordre.push(section);
    }
    return ordre
      .map((nom) => sections.find((s) => s.nom === nom))
      .filter((s): s is SectionCms => Boolean(s))
      .map((s) => ({
        ...s,
        // Seuls les champs réellement affichés sur cette page.
        champs: s.champs.filter((c) => presents.some((p) => decouper(p).section === s.nom && decouper(p).nom === c.nom)),
      }));
  }, [presents, sections]);

  const modifier = (nom: string, valeur: Valeur) => {
    const champ = champs.get(nom);
    if (!champ) return;
    setBrouillon((b) => ({ ...b, [nom]: valeur }));
    pousser(nom, valeur, champ.section);
  };

  /** Image choisie pour un champ : réduite, gardée en mémoire, montrée dans l'aperçu. */
  const remplacerImage = async (fichier: File, cleFichier: string, appliquer: (marqueur: string) => void) => {
    try {
      const reduit = await reduire(fichier);
      const url = URL.createObjectURL(reduit);
      const marqueur = `${PREFIXE_FICHIER}${cleFichier}`;
      urlsLocales.current[marqueur] = url;
      setFichiers((f) => ({ ...f, [marqueur]: { fichier: reduit, url } }));
      appliquer(marqueur);
    } catch {
      afficher(false, "Cette image est illisible. Essayez un JPEG ou un PNG.");
    }
  };

  const modifies = [...champs.keys()].filter((nom) => JSON.stringify(brouillon[nom]) !== JSON.stringify(publies[nom]));

  const afficher = (ok: boolean, texte: string) => {
    setMessage({ ok, texte });
    window.setTimeout(() => setMessage(null), 6000);
  };

  const annuler = () => {
    for (const nom of modifies) {
      const champ = champs.get(nom);
      if (champ) pousser(nom, publies[nom], champ.section);
    }
    setBrouillon(publies);
    setFichiers({});
  };

  const publier = useCallback(() => {
    if (modifies.length === 0 || enCours) return;
    const mises = modifies.map((nom) => ({ nom, type: champs.get(nom)!.type, valeur: brouillon[nom] }) as MiseAJourCms);
    const donnees = new FormData();
    donnees.set("page", page.titre);
    donnees.set("mises", JSON.stringify(mises));
    const utilises = JSON.stringify(mises);
    for (const [marqueur, { fichier }] of Object.entries(fichiers)) {
      if (utilises.includes(marqueur)) donnees.set(marqueur, fichier);
    }

    demarrer(async () => {
      const resultat = await publierPage(donnees);
      if (resultat.ok) setPublies(brouillon);
      afficher(resultat.ok, resultat.message);
    });
  }, [modifies, enCours, champs, brouillon, fichiers, page.titre]);

  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        publier();
      }
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [publier]);

  /** Vignette d'un champ image dans le panneau (rendu : lit l'état, pas le ref). */
  const apercuImage = (valeur: string) => fichiers[valeur]?.url ?? valeur;

  const focaliser = (chemin: string) => {
    setActif(chemin);
    envoyer({ type: "cms:focus", path: chemin });
  };

  const rendreValeur = (section: string, champ: ChampCms) => {
    const chemin = `${section}.${champ.nom}`;
    const valeur = brouillon[champ.nom];

    if (champ.type === "texte") {
      const texte = valeur as string;
      return (
        <div data-champ={chemin} key={champ.nom}>
          <label htmlFor={chemin} className="mb-1.5 block text-[13px] font-medium text-neutral-700">{champ.libelle}</label>
          {estImage(champ.valeur) ? (
            <ChampImage
              valeur={texte}
              apercu={apercuImage(texte)}
              onChoisir={(f) => remplacerImage(f, champ.nom, (m) => modifier(champ.nom, m))}
            />
          ) : (
            <ChampTexte id={chemin} valeur={texte} actif={actif === chemin} onFocus={() => focaliser(chemin)} onChange={(v) => modifier(champ.nom, v)} />
          )}
        </div>
      );
    }

    if (champ.type === "liste") {
      const liste = valeur as string[];
      return (
        <div data-champ={chemin} key={champ.nom}>
          <p className="mb-1.5 text-[13px] font-medium text-neutral-700">{champ.libelle}</p>
          <div className="space-y-2">
            {liste.map((element, i) =>
              estImage(champ.valeur[i] ?? "") ? (
                <div key={i} data-champ={`${chemin}.${i}`}>
                  <ChampImage
                    valeur={element}
                    apercu={apercuImage(element)}
                    onChoisir={(f) =>
                      remplacerImage(f, `${champ.nom}-${i}`, (m) => modifier(champ.nom, liste.map((x, j) => (j === i ? m : x))))
                    }
                  />
                </div>
              ) : (
              <div key={i} data-champ={`${chemin}.${i}`}>
                <ChampTexte
                  id={`${chemin}.${i}`}
                  valeur={element}
                  actif={actif === `${chemin}.${i}`}
                  onFocus={() => focaliser(`${chemin}.${i}`)}
                  onChange={(v) => modifier(champ.nom, liste.map((x, j) => (j === i ? v : x)))}
                />
              </div>
              ),
            )}
          </div>
        </div>
      );
    }

    const objets = valeur as Record<string, string>[];
    return (
      <div data-champ={chemin} key={champ.nom}>
        <p className="mb-1.5 text-[13px] font-medium text-neutral-700">{champ.libelle}</p>
        <div className="space-y-3">
          {objets.map((objet, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-neutral-200 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Élément {i + 1}</p>
              {champ.cles.map((cle) => {
                const sousChemin = `${chemin}.${i}.${cle}`;
                const v = objet[cle] ?? "";
                const maj = (nouvelle: string) =>
                  modifier(champ.nom, objets.map((o, j) => (j === i ? { ...o, [cle]: nouvelle } : o)));
                return (
                  <div key={cle} data-champ={sousChemin}>
                    <label htmlFor={sousChemin} className="mb-1 block text-[12px] text-neutral-500">{cle.charAt(0).toUpperCase() + cle.slice(1)}</label>
                    {estImage(champ.valeur[i]?.[cle] ?? "") ? (
                      <ChampImage valeur={v} apercu={apercuImage(v)} onChoisir={(f) => remplacerImage(f, `${champ.nom}-${i}-${cle}`, maj)} />
                    ) : (
                      <ChampTexte id={sousChemin} valeur={v} actif={actif === sousChemin} onFocus={() => focaliser(sousChemin)} onChange={maj} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-14 z-20 flex flex-col bg-white lg:bottom-2 lg:left-[248px] lg:right-2 lg:top-[61px] lg:flex-row lg:rounded-b-xl">
      <div className="flex min-h-[45vh] flex-1 flex-col bg-neutral-100 lg:min-h-0 lg:rounded-bl-xl">
        <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-2">
          <Link href="/admin/pages" className="flex items-center gap-1 text-[14px] text-neutral-600 hover:text-neutral-900">
            <IconeAdmin nom="retour" className="size-4" />
            Pages
          </Link>
          <p className="truncate text-[14px] font-medium text-neutral-900">{page.titre}</p>
          <div className="flex items-center gap-2">
            <div role="radiogroup" aria-label="Appareil" className="flex rounded-lg bg-neutral-100 p-0.5">
              {(["ordinateur", "mobile"] as const).map((a) => (
                <button key={a} type="button" role="radio" aria-checked={appareil === a} aria-label={a === "ordinateur" ? "Ordinateur" : "Mobile"} onClick={() => setAppareil(a)} className={cn("rounded-md px-2 py-1", appareil === a ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500")}>
                  <IconeAdmin nom={a} className="size-4" />
                </button>
              ))}
            </div>
            <a href={page.chemin} target="_blank" rel="noopener" aria-label="Ouvrir la page en ligne" className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
              <IconeAdmin nom="fleche" className="size-4" />
            </a>
          </div>
        </div>
        <div className="flex flex-1 justify-center overflow-hidden p-3">
          <iframe
            ref={iframe}
            src={`${page.chemin}?edit`}
            title={`Aperçu modifiable : ${page.titre}`}
            className={cn(
              "h-full rounded-lg border border-neutral-200 bg-white shadow-sm transition-[width]",
              appareil === "ordinateur" ? "w-full" : "w-[390px]",
            )}
          />
        </div>
      </div>

      <aside ref={panneau} className="flex w-full flex-col border-t border-neutral-200 lg:w-[380px] lg:border-l lg:border-t-0">
        <header className="border-b border-neutral-200 px-5 py-3.5">
          <h1 className="text-[15px] font-semibold text-neutral-900">Contenus de la page</h1>
          <p className="mt-0.5 text-[13px] text-neutral-500">Cliquez sur un texte ou une image dans l&apos;aperçu.</p>
        </header>
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4 pb-28">
          {presents === null ? (
            <p className="text-[14px] text-neutral-500">Chargement de l&apos;aperçu…</p>
          ) : sectionsPage.length === 0 ? (
            <p className="rounded-lg bg-neutral-50 px-4 py-3 text-[14px] text-neutral-600">
              Aucun contenu modifiable sur cette page pour l&apos;instant. Demandez-le à l&apos;équipe Orion.
            </p>
          ) : (
            sectionsPage.map((section) => (
              <section key={section.nom}>
                <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-neutral-500">
                  {section.nom.split(" · ").pop()}
                </h2>
                <div className="space-y-4">{section.champs.map((c) => rendreValeur(section.nom, c))}</div>
              </section>
            ))
          )}
        </div>
      </aside>

      {modifies.length > 0 ? (
        <div role="region" aria-label="Modifications non publiées" className="fixed inset-x-3 bottom-4 z-40 mx-auto flex max-w-xl flex-wrap items-center gap-x-4 gap-y-3 rounded-xl bg-neutral-900 px-4 py-3 text-white shadow-2xl sm:inset-x-6 lg:left-[256px]">
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-or-400" />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium">
              {modifies.length} modification{modifies.length > 1 ? "s" : ""} non publiée{modifies.length > 1 ? "s" : ""}
            </p>
            <p className="truncate text-[12px] text-white/60">
              {modifies.map((nom) => champs.get(nom)?.libelle).join(" · ")}
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={annuler} disabled={enCours} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[14px] hover:bg-white/10 disabled:opacity-50">
              Annuler
            </button>
            <button type="button" onClick={publier} disabled={enCours} className="flex items-center gap-2 rounded-lg bg-or-500 px-3 py-1.5 text-[14px] font-medium hover:bg-or-600 disabled:opacity-60">
              {enCours ? "Publication…" : "Publier"}
              <span aria-hidden="true" className="hidden gap-0.5 sm:flex">
                <kbd className="rounded bg-white/20 px-1 font-sans text-[11px]">⌘</kbd>
                <kbd className="rounded bg-white/20 px-1 font-sans text-[11px]">↵</kbd>
              </span>
            </button>
          </div>
        </div>
      ) : null}

      {message ? (
        <p role="status" className={cn("fixed left-1/2 z-50 max-w-md -translate-x-1/2 rounded-lg px-4 py-2.5 text-center text-[14px] text-white shadow-lg lg:left-[calc(50%+120px)]", message.ok ? "bg-club-800" : "bg-red-700", modifies.length > 0 ? "bottom-24" : "bottom-4")}>
          {message.texte}
        </p>
      ) : null}
    </div>
  );
}
