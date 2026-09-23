import { getBandeau } from "@/lib/api/content";

/**
 * Bandeau d'information en tête de site.
 * Contenu piloté depuis /admin ; masqué si désactivé ou si le message est vide.
 */
export async function AnnouncementBar() {
  const bandeau = await getBandeau();

  if (!bandeau.actif || bandeau.message.trim() === "") return null;

  return (
    <aside
      aria-label="Information du club"
      className="bg-club-950 px-5 py-2.5 text-center text-sm text-sable-100"
    >
      <p className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span>{bandeau.message}</span>
        {bandeau.lien ? (
          <a
            href={bandeau.lien.href}
            className="font-semibold text-sable-50 underline-offset-4 hover:underline"
          >
            {bandeau.lien.label} <span aria-hidden="true">→</span>
          </a>
        ) : null}
      </p>
    </aside>
  );
}
