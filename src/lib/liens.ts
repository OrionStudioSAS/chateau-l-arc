/**
 * Attributs d'un lien selon sa destination : un site externe (réservation
 * Prima Golf…) s'ouvre dans un nouvel onglet, pour que le visiteur garde le
 * site du club ouvert derrière.
 */
export function proprietesLien(href: string) {
  return /^https?:\/\//.test(href) ? ({ target: "_blank", rel: "noopener" } as const) : {};
}
