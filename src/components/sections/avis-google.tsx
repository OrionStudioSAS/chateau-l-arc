import { Editable } from "@/components/cms/editable";
import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { lireAvisGoogle } from "@/lib/avis-google";
import { cn } from "@/lib/cn";
import { i18n } from "@/lib/i18n/serveur";

const SECTION = "Accueil · Avis Google";

/** « G » de Google, exigé pour l'attribution des avis. */
function LogoGoogle({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className={cn("shrink-0", className)}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/** Cinq étoiles, remplies selon la note (au dixième près). */
function Etoiles({ note, className }: { note: number; className?: string }) {
  return (
    <span className={cn("flex gap-0.5", className)} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => {
        const part = Math.max(0, Math.min(1, note - i));
        return (
          <span key={i} className="relative size-[1em]">
            <svg viewBox="0 0 20 20" className="absolute inset-0 size-full text-encre/15">
              <path fill="currentColor" d="m10 1.5 2.6 5.5 6 .7-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.7l6-.7z" />
            </svg>
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${part * 100}%` }}>
              <svg viewBox="0 0 20 20" className="size-[1em] text-or-500">
                <path fill="currentColor" d="m10 1.5 2.6 5.5 6 .7-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.7l6-.7z" />
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

/**
 * « Ce qu'en disent nos golfeurs » (accueil) : note et avis de la fiche Google
 * du golf (cf. lib/avis-google), sans widget ni cookie. Masquée sans clé
 * Google ou si Google ne répond pas.
 */
export async function AvisGoogle() {
  const { T, tr, langue, locale } = await i18n();
  const fiche = await lireAvisGoogle(langue);
  if (!fiche || fiche.note === null) return null;

  const avis = fiche.avis;
  const note = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(fiche.note);
  const nombre = new Intl.NumberFormat(locale).format(fiche.nombre);

  return (
    <section className="border-t border-encre/10 bg-sable-50 py-16 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
        <div>
          <Editable path={`${SECTION}.ACCUEIL_AVIS_SURTITRE`} as="div">
            <Surtitre aligne="gauche" className="text-or-600">
              {T.ACCUEIL_AVIS_SURTITRE}
            </Surtitre>
          </Editable>
          <Editable path={`${SECTION}.ACCUEIL_AVIS_TITRE`} as="h2" className="mt-5 font-butler text-[34px] font-medium leading-[1.1] text-club-950 sm:text-[44px]">
            {T.ACCUEIL_AVIS_TITRE}
          </Editable>

          <div className="mt-8 flex items-end gap-4">
            <p className="font-butler text-[64px] font-medium leading-none text-club-950">{note}</p>
            <div className="pb-1.5">
              <Etoiles note={fiche.note} className="text-[18px]" />
              <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-encre/60">
                <LogoGoogle className="size-3.5" />
                <span>
                  {nombre} {tr("avis sur Google")}
                </span>
              </p>
            </div>
          </div>
          <p className="sr-only">
            {tr("Note moyenne")} : {note} / 5
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {fiche.lienAvis ? (
              <a
                href={fiche.lienAvis}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-club-950 px-5 py-3 text-[13px] font-semibold text-sable-50 transition-colors hover:bg-club-800"
              >
                {tr("Voir tous les avis")} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {fiche.lienDonnerAvis ? (
              <a
                href={fiche.lienDonnerAvis}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-club-950/25 bg-white px-5 py-3 text-[13px] font-semibold text-club-950 transition-colors hover:bg-sable-50"
              >
                {tr("Donner mon avis")}
              </a>
            ) : null}
          </div>
          {fiche.exemple ? (
            <p className="mt-6 rounded-sm bg-amber-100 px-3 py-2 text-[12px] text-amber-900">
              Aperçu de développement : avis d&apos;exemple, la clé Google n&apos;est pas configurée.
            </p>
          ) : null}
        </div>

        {avis.length ? (
          <ul className="sans-barre -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
            {avis.map((a) => (
              <li key={a.id} className="flex w-[300px] shrink-0 snap-start flex-col rounded-sm border border-encre/10 bg-white p-6 sm:w-[340px]">
                <div className="flex items-center justify-between gap-3">
                  <Etoiles note={a.note} className="text-[15px]" />
                  <LogoGoogle className="size-4" />
                </div>
                <p className="mt-4 line-clamp-6 flex-1 text-[14px] leading-relaxed text-encre/80">{a.texte}</p>
                {a.lien ? (
                  <a href={a.lien} target="_blank" rel="noopener noreferrer" className="mt-3 text-[12px] font-semibold text-club-950 underline-offset-4 hover:underline">
                    {tr("Lire sur Google")} <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                <div className="mt-5 flex items-center gap-3 border-t border-encre/10 pt-4">
                  {a.photo ? (
                    // Photo de profil servie par Google (attribution de l'auteur).
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.photo} alt="" width={36} height={36} loading="lazy" referrerPolicy="no-referrer" className="size-9 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-full bg-sable-100 text-[12px] font-semibold text-club-950">
                      {initiales(a.auteur)}
                    </span>
                  )}
                  <div className="min-w-0">
                    {a.auteurUrl ? (
                      <a href={a.auteurUrl} target="_blank" rel="noopener noreferrer" className="block truncate text-[14px] font-medium text-club-950 hover:underline">
                        {a.auteur}
                      </a>
                    ) : (
                      <p className="truncate text-[14px] font-medium text-club-950">{a.auteur}</p>
                    )}
                    {a.quand ? <p className="text-[12px] text-encre/50">{a.quand}</p> : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
