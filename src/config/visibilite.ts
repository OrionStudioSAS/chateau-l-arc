/** Masquage temporaire pour la presentation : retirer une route pour la republier. */
export const pagesPubliquesMasquees: readonly string[] = [
  "/competitions",
  "/histoire",
  "/academie",
];

export const pagesAdminMasquees: readonly string[] = ["/admin/competitions"];

export function estPagePubliqueVisible(href: string): boolean {
  const chemin = href.split(/[?#]/, 1)[0];
  return !pagesPubliquesMasquees.some(
    (route) => chemin === route || chemin.startsWith(`${route}/`),
  );
}
