import { Editable } from "@/components/cms/editable";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { lireAvisGoogle, type AvisGoogle as Avis } from "@/lib/avis-google";
import { cn } from "@/lib/cn";
import { i18n } from "@/lib/i18n/serveur";

const SECTION = "Accueil · Avis Google";
/** Avis affichés à côté de la note (maquette : trois cartes). */
const NOMBRE_AVIS = 3;

/** Cinq étoiles, remplies selon la note (au dixième près). */
function Etoiles({ note, className }: { note: number; className?: string }) {
  const etoile = "m10 1.5 2.6 5.5 6 .7-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.7l6-.7z";
  return (
    <span className={cn("flex gap-1", className)} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => {
        const part = Math.max(0, Math.min(1, note - i));
        return (
          <span key={i} className="relative size-[1em]">
            <svg viewBox="0 0 20 20" className="absolute inset-0 size-full text-current opacity-25">
              <path fill="currentColor" d={etoile} />
            </svg>
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${part * 100}%` }}>
              <svg viewBox="0 0 20 20" className="size-[1em]">
                <path fill="currentColor" d={etoile} />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}

const initiales = (nom: string) =>
  nom
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

function CarteAvis({ avis, date }: { avis: Avis; date: string }) {
  return (
    <li className="flex flex-col border border-sable-300/70 bg-white p-8">
      <Etoiles note={avis.note} className="text-[15px] text-or-500" />
      <blockquote className="mt-6 line-clamp-[8] flex-1 font-butler text-[20px] italic leading-[1.5] text-club-950">
        « {avis.texte} »
      </blockquote>
      <div className="mt-8 flex items-center gap-3">
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sable-100 text-[13px] font-semibold text-club-950">
          {initiales(avis.auteur)}
        </span>
        <div className="min-w-0">
          {avis.auteurUrl ? (
            <a href={avis.auteurUrl} target="_blank" rel="noopener noreferrer" className="block truncate text-[14px] font-semibold text-club-950 hover:underline">
              {avis.auteur}
            </a>
          ) : (
            <p className="truncate text-[14px] font-semibold text-club-950">{avis.auteur}</p>
          )}
          {date ? <p className="text-[12px] text-encre/50">{date}</p> : null}
        </div>
      </div>
    </li>
  );
}

/**
 * « Ce qu'en disent les joueurs » (accueil, maquette) : note de la fiche
 * Google du golf à gauche, trois avis en cartes (cf. lib/avis-google), sans
 * widget ni cookie. Masquée sans clé Google ou si Google ne répond pas.
 */
export async function AvisGoogle() {
  const { T, tr, langue, locale } = await i18n();
  const fiche = await lireAvisGoogle(langue);
  if (!fiche || fiche.note === null) return null;

  const note = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(fiche.note);
  const nombre = new Intl.NumberFormat(locale).format(fiche.nombre);
  const moisAnnee = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "Europe/Paris" });
  const dateDe = (a: Avis) => (a.publieLe ? moisAnnee.format(new Date(a.publieLe)) : a.quand);
  const avis = fiche.avis.slice(0, NOMBRE_AVIS);

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <Editable path={`${SECTION}.ACCUEIL_AVIS_SURTITRE`} as="div">
          <Surtitre aligne="gauche" className="font-semibold text-or-600">
            {T.ACCUEIL_AVIS_SURTITRE}
          </Surtitre>
        </Editable>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <Editable path={`${SECTION}.ACCUEIL_AVIS_TITRE`} as="h2" className="font-butler text-[38px] font-medium leading-[1.1] text-club-950 sm:text-[52px]">
            {T.ACCUEIL_AVIS_TITRE}
          </Editable>
          {fiche.exemple ? (
            <p className="mb-2 rounded-full border border-or-500 px-3 py-1 text-[12px] text-or-600">
              Contenu d&apos;exemple · flux Google à connecter
            </p>
          ) : null}
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-[minmax(0,1.15fr)_repeat(3,minmax(0,1fr))]">
          <li className="flex flex-col bg-club-950 p-8 text-white md:col-span-2 xl:col-span-1 xl:p-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-or-400">{tr("Avis Google")}</p>
            <p className="mt-8 flex items-baseline gap-3">
              <span className="font-butler text-[80px] font-medium leading-none">{note}</span>
              <span className="text-[18px] text-white/60">/ 5</span>
            </p>
            <Etoiles note={fiche.note} className="mt-3 text-[17px] text-or-500" />
            <p className="mt-5 max-w-xs flex-1 text-[14px] leading-relaxed text-white/75">
              {tr("Note moyenne sur")} {nombre} {tr("avis, synchronisée automatiquement avec Google.")}
            </p>
            {fiche.lienAvis ? (
              <a
                href={fiche.lienAvis}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 self-start text-[14px] font-semibold text-or-400 underline-offset-4 hover:underline"
              >
                {tr("Lire tous les avis")} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </li>
          {avis.map((a) => (
            <CarteAvis key={a.id} avis={a} date={dateDe(a)} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
