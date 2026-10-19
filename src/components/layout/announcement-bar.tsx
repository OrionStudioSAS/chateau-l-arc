import { getBandeau } from "@/lib/api/content";
import { i18n } from "@/lib/i18n/serveur";

/**
 * Bandeau d'information en tête de site.
 * Contenu piloté depuis /admin ; masqué si désactivé ou si le message est vide.
 */
export async function AnnouncementBar() {
  const [bandeau, { tr, lien }] = await Promise.all([getBandeau(), i18n()]);

  if (!bandeau.actif || bandeau.message.trim() === "") return null;

  return (
    <aside
      aria-label={tr("Information du club")}
      className="bg-club-950 px-5 py-2.5 text-center text-[13px] text-sable-100 sm:text-sm"
    >
      <p className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span>{tr(bandeau.message)}</span>
        {bandeau.lien ? (
          <a
            href={lien(bandeau.lien.href)}
            className="font-semibold text-or-400 underline-offset-4 hover:underline"
          >
            {tr(bandeau.lien.label)} <span aria-hidden="true">→</span>
          </a>
        ) : null}
      </p>
    </aside>
  );
}
