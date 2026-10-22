import { Editable } from "@/components/cms/editable";
import { SommaireLegal } from "@/components/sections/legal/sommaire-legal";
import { Container } from "@/components/ui/container";
import { Lien as Link } from "@/components/ui/lien";
import { Surtitre } from "@/components/ui/surtitre";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { i18n } from "@/lib/i18n/serveur";
import { JsonLd, jsonLdFilAriane } from "@/lib/seo";

/**
 * Gabarit des pages légales (maquettes « Politique de confidentialité » et
 * « Mentions légales & Crédits ») : en-tête sable, sommaire collant et encart
 * « Une question ? » à gauche, rubriques numérotées à droite. Les textes
 * viennent de constants.ts (Pages › …) ; chaque `cms` est un chemin de
 * l'éditeur visuel.
 */

const traits = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const pictos = {
  courrier: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  surPlace: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 7h6M9 11h6M10 21v-4h4v4" />
    </>
  ),
  arobase: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" />
    </>
  ),
  horloge: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  telephone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  ),
  personne: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  serveur: (
    <>
      <rect x="4" y="4" width="16" height="7" rx="1.5" />
      <rect x="4" y="13" width="16" height="7" rx="1.5" />
      <path d="M8 7.5h.01M8 16.5h.01" />
    </>
  ),
  repere: (
    <>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  bouclier: (
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4" />
  ),
};
export type PictoLegal = keyof typeof pictos;

export function Picto({
  nom,
  className = "size-4",
}: {
  nom: PictoLegal;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      {...traits}
    >
      {pictos[nom]}
    </svg>
  );
}

/** Texte en paragraphes (lignes vides), modifiable dans l'éditeur visuel. */
export function Paragraphes({
  texte,
  cms,
  className,
}: {
  texte: string;
  cms: string;
  className?: string;
}) {
  return (
    <Editable
      path={cms}
      as="div"
      className={cn(
        "space-y-4 whitespace-pre-line text-[14px] leading-[1.75] text-encre/75",
        className,
      )}
    >
      {texte.trim()}
    </Editable>
  );
}

/** Une adresse e-mail dans un texte devient un lien. */
function avecLiens(texte: string) {
  const morceaux = texte.split(/([\w.+-]+@[\w-]+\.[\w.-]+)/);
  return morceaux.map((m, i) =>
    i % 2 ? (
      <a
        key={i}
        href={`mailto:${m}`}
        className="underline-offset-2 hover:underline"
      >
        {m}
      </a>
    ) : (
      m
    ),
  );
}

/** Trois moyens de contact : courrier, sur place, e-mail. */
export function CartesContact({
  cartes,
  cms,
}: {
  cartes: readonly { titre: string; texte: string }[];
  cms: string;
}) {
  const icones: PictoLegal[] = ["courrier", "surPlace", "arobase"];
  return (
    <ul className="mt-5 grid gap-2 sm:grid-cols-3">
      {cartes.map((carte, i) => (
        <li key={i} className="bg-sable-100 p-4">
          <span className="flex size-7 items-center justify-center rounded-full bg-white text-club-950">
            <Picto nom={icones[i] ?? "courrier"} className="size-3.5" />
          </span>
          <Editable
            path={`${cms}.${i}.titre`}
            as="p"
            className="mt-3 text-[13px] font-semibold text-club-950"
          >
            {carte.titre}
          </Editable>
          <Editable
            path={`${cms}.${i}.texte`}
            as="p"
            className="mt-1.5 text-[12px] leading-relaxed text-encre/60"
          >
            {avecLiens(carte.texte)}
          </Editable>
        </li>
      ))}
    </ul>
  );
}

/** Encadré sable à filet or. */
export function Encart({
  picto,
  cms,
  children,
}: {
  picto: PictoLegal;
  cms: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 flex items-start gap-3 border-l-2 border-or-500 bg-sable-100 px-4 py-3.5">
      <Picto nom={picto} className="mt-0.5 size-4 text-or-600" />
      <Editable
        path={cms}
        as="p"
        className="text-[13px] leading-relaxed text-encre/75"
      >
        {children}
      </Editable>
    </div>
  );
}

/** Liste à puces or. */
export function ListePuces({
  elements,
  cms,
}: {
  elements: readonly string[];
  cms: string;
}) {
  return (
    <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-encre/75">
      {elements.map((element, i) => (
        <li key={i} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-or-500"
          />
          <Editable path={`${cms}.${i}`}>{element}</Editable>
        </li>
      ))}
    </ul>
  );
}

/** Rubrique numérotée (« 01 »), ancre du sommaire. */
export function Rubrique({
  id,
  numero,
  titre,
  cms,
  children,
}: {
  id: string;
  numero: number;
  titre: string;
  cms: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-encre/10 pt-8 first:border-0 first:pt-0"
    >
      <p className="text-[11px] font-semibold tracking-[0.12em] text-or-600">
        {String(numero).padStart(2, "0")}
      </p>
      <Editable
        path={cms}
        as="h2"
        className="mt-2 font-butler text-[26px] font-medium leading-tight text-club-950 sm:text-[30px]"
      >
        {titre}
      </Editable>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Sous-rubrique (« 3.1 · Droit d'accès… »). */
export function SousRubrique({
  id,
  numero,
  titre,
  cms,
}: {
  id: string;
  numero: string;
  titre: string;
  cms: string;
}) {
  return (
    <h3
      id={id}
      className="mt-8 scroll-mt-28 font-butler text-[20px] font-medium text-club-950"
    >
      {numero} · <Editable path={cms}>{titre}</Editable>
    </h3>
  );
}

export async function PageLegale({
  titre,
  surtitre,
  texte,
  miseAJour,
  cms,
  rubriques,
  children,
}: {
  titre: string;
  surtitre: string;
  texte: string;
  miseAJour: string;
  /** Chemins de l'éditeur visuel des champs de l'en-tête. */
  cms: { titre: string; surtitre: string; texte: string; miseAJour: string };
  rubriques: { id: string; libelle: string }[];
  children: React.ReactNode;
}) {
  const { tr, lien } = await i18n();
  const etapes = [{ label: tr("Accueil"), href: lien("/") }, { label: titre }];

  return (
    <>
      <JsonLd donnees={jsonLdFilAriane(etapes)} />
      <section className="bg-sable-100">
        <Container className="pb-14 pt-8 sm:pb-16">
          <nav
            aria-label={tr("Fil d'Ariane")}
            className="text-[12px] text-encre/50"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-club-950"
                >
                  {tr("Accueil")}
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="font-medium text-club-950">
                {titre}
              </li>
            </ol>
          </nav>
          <Editable path={cms.surtitre} as="div" className="mt-6">
            <Surtitre
              aligne="gauche"
              className="text-[11px] font-semibold text-or-600"
            >
              {surtitre}
            </Surtitre>
          </Editable>
          <Editable
            path={cms.titre}
            as="h1"
            className="mt-4 font-butler text-[40px] font-medium leading-[1.05] text-club-950 sm:text-[56px]"
          >
            {titre}
          </Editable>
          <Editable
            path={cms.texte}
            as="p"
            className="mt-5 max-w-xl text-[15px] leading-relaxed text-encre/70"
          >
            {texte}
          </Editable>
          <p className="mt-6 flex items-center gap-2 text-[12px] text-encre/45">
            <Picto nom="horloge" className="size-3.5" />
            <span>
              {tr("Dernière mise à jour :")} <Editable path={cms.miseAJour}>{miseAJour}</Editable>
            </span>
          </p>
        </Container>
      </section>

      <div className="bg-white">
        <Container className="py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <SommaireLegal rubriques={rubriques} />
              <div className="mt-8 hidden bg-club-950 p-5 text-white lg:block">
                <p className="text-[14px] font-semibold">
                  {tr("Une question ?")}
                </p>
                <p className="mt-1 text-[12px] text-white/60">
                  {tr("Contactez l'accueil du golf.")}
                </p>
                <a
                  href={site.contact.telephoneLien}
                  className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-or-400 hover:underline"
                >
                  <Picto nom="telephone" className="size-3.5" />
                  {site.contact.telephone}
                </a>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="mt-2 flex items-center gap-2 break-all text-[12px] text-or-400 hover:underline"
                >
                  <Picto nom="courrier" className="size-3.5" />
                  {site.contact.email}
                </a>
              </div>
            </aside>
            <div className="max-w-[42rem] space-y-12">{children}</div>
          </div>
        </Container>
      </div>
    </>
  );
}
