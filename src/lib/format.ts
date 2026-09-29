const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});

const prixFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatPrix(montant: number): string {
  return montant > 0 ? prixFormatter.format(montant) : "Sur demande";
}

const dateHeureFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

export function formatDateHeure(iso: string): string {
  return dateHeureFormatter.format(new Date(iso));
}

const moisCourtFormatter = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  timeZone: "Europe/Paris",
});

const jourFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  timeZone: "Europe/Paris",
});

/** « JUIL », « AOÛT » : abréviation sans point final, en capitales. */
export function formatMoisCourt(iso: string): string {
  return moisCourtFormatter.format(new Date(iso)).replace(".", "").toUpperCase();
}

export function formatJour(iso: string): string {
  return jourFormatter.format(new Date(iso));
}

const dateCourteFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Paris",
});

/** « 28 juin », sans l'année : utilisé quand le contexte la rend évidente. */
export function formatDateCourte(iso: string): string {
  return dateCourteFormatter.format(new Date(iso));
}

const jourIsoFormatter = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" });

/** Date du jour à Paris, au format AAAA-MM-JJ, comparable aux dates de la base. */
export function aujourdhuiAParis(): string {
  return jourIsoFormatter.format(new Date());
}
