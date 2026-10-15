/** Clés Redis du suivi d'audience, partagées par la collecte et la lecture. */
export const cleJour = (jour: string) => `suivi:j:${jour}`;
export const clePages = (jour: string) => `suivi:p:${jour}`;
export const cleVisiteurs = (jour: string) => `suivi:v:${jour}`;
export const CLE_ACTIFS = "suivi:actifs";
export const CLE_POPUP = "suivi:popup";

/** Un visiteur est « en ce moment » sur le site s'il a vu une page depuis 5 min. */
export const FENETRE_ACTIFS_MS = 5 * 60_000;

/** « 2026-10-15 » et « 14 » à l'heure de Paris. */
export function jourEtHeure(date = new Date()): { jour: string; heure: string } {
  const parties = new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const valeur = (type: string) => parties.find((p) => p.type === type)?.value ?? "";
  return { jour: `${valeur("year")}-${valeur("month")}-${valeur("day")}`, heure: valeur("hour") };
}
