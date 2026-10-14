/**
 * Périodes de l'accueil du back-office, calculées à l'heure de Paris.
 * Chaque période a son pas (heure, jour, mois) et la période précédente de
 * même durée, pour les évolutions (« +12 % »).
 */
export type Periode = "jour" | "7j" | "30j" | "saison";
export type Unite = "hour" | "day" | "month";

export const periodes: Record<Periode, { libelle: string; resume: string; unite: Unite }> = {
  jour: { libelle: "Aujourd'hui", resume: "Aujourd'hui", unite: "hour" },
  "7j": { libelle: "7 jours", resume: "7 derniers jours", unite: "day" },
  "30j": { libelle: "30 jours", resume: "30 derniers jours", unite: "day" },
  saison: { libelle: "Saison", resume: "Depuis le 1er janvier", unite: "month" },
};

export const estPeriode = (valeur: unknown): valeur is Periode =>
  typeof valeur === "string" && Object.hasOwn(periodes, valeur);

const FUSEAU = "Europe/Paris";

/** « 2026-10-14 » à Paris. */
const ymd = (date: Date) => new Intl.DateTimeFormat("fr-CA", { timeZone: FUSEAU }).format(date);

/** Décalage de Paris à cette date, en minutes (120 l'été, 60 l'hiver). */
function decalageMinutes(date: Date): number {
  const texte =
    new Intl.DateTimeFormat("en-US", { timeZone: FUSEAU, timeZoneName: "longOffset" })
      .formatToParts(date)
      .find((partie) => partie.type === "timeZoneName")?.value ?? "GMT";
  const [, signe, h, m] = texte.match(/GMT([+-])(\d{2}):?(\d{2})?/) ?? [];
  if (!signe) return 0;
  return (signe === "-" ? -1 : 1) * (Number(h) * 60 + Number(m ?? 0));
}

/** Minuit à Paris pour une date « AAAA-MM-JJ ». */
function minuit(jour: string): Date {
  const approx = new Date(`${jour}T00:00:00Z`);
  return new Date(approx.getTime() - decalageMinutes(approx) * 60_000);
}

/** Décale une date « AAAA-MM-JJ » de n jours (calendrier, sans souci d'heure d'été). */
function ajouterJours(jour: string, n: number): string {
  const [a, m, j] = jour.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, j + n)).toISOString().slice(0, 10);
}

export type Intervalle = { debut: Date; fin: Date };

export type Bornes = Intervalle & {
  precedent: Intervalle;
  unite: Unite;
  /** Graduations du graphique : clé comparable aux dates d'Umami, et libellé. */
  graduations: { cle: string; libelle: string }[];
};

const joursCourts = new Intl.DateTimeFormat("fr-FR", { weekday: "short", timeZone: "UTC" });
const moisCourts = new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" });
const sansPoint = (texte: string) => {
  const propre = texte.replace(".", "");
  return propre.charAt(0).toUpperCase() + propre.slice(1);
};

export function bornes(periode: Periode, maintenant = new Date()): Bornes {
  const aujourdhui = ymd(maintenant);

  if (periode === "jour") {
    const debut = minuit(aujourdhui);
    const heureCourante = Number(
      new Intl.DateTimeFormat("fr-FR", { hour: "numeric", hourCycle: "h23", timeZone: FUSEAU })
        .format(maintenant)
        .replace(/\D/g, ""),
    );
    return {
      debut,
      fin: maintenant,
      precedent: {
        debut: minuit(ajouterJours(aujourdhui, -1)),
        fin: new Date(maintenant.getTime() - 86_400_000),
      },
      unite: "hour",
      graduations: Array.from({ length: heureCourante + 1 }, (_, h) => ({
        cle: `${aujourdhui} ${String(h).padStart(2, "0")}`,
        libelle: `${h}h`,
      })),
    };
  }

  if (periode === "saison") {
    const annee = Number(aujourdhui.slice(0, 4));
    const moisCourant = Number(aujourdhui.slice(5, 7));
    const debut = minuit(`${annee}-01-01`);
    const ecoule = maintenant.getTime() - debut.getTime();
    const debutPrecedent = minuit(`${annee - 1}-01-01`);
    return {
      debut,
      fin: maintenant,
      precedent: { debut: debutPrecedent, fin: new Date(debutPrecedent.getTime() + ecoule) },
      unite: "month",
      graduations: Array.from({ length: moisCourant }, (_, i) => ({
        cle: `${annee}-${String(i + 1).padStart(2, "0")}`,
        libelle: sansPoint(moisCourts.format(new Date(Date.UTC(annee, i, 1)))),
      })),
    };
  }

  const nombre = periode === "7j" ? 7 : 30;
  const premier = ajouterJours(aujourdhui, -(nombre - 1));
  const debut = minuit(premier);
  return {
    debut,
    fin: maintenant,
    precedent: {
      debut: minuit(ajouterJours(premier, -nombre)),
      fin: new Date(maintenant.getTime() - nombre * 86_400_000),
    },
    unite: "day",
    graduations: Array.from({ length: nombre }, (_, i) => {
      const jour = ajouterJours(premier, i);
      const date = new Date(`${jour}T12:00:00Z`);
      return {
        cle: jour,
        libelle: nombre === 7 ? sansPoint(joursCourts.format(date)) : String(date.getUTCDate()),
      };
    }),
  };
}

const jourLong = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: FUSEAU,
});
const jourMois = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", timeZone: FUSEAU });

const majuscule = (texte: string) => texte.charAt(0).toUpperCase() + texte.slice(1);

/** « Mercredi 8 juillet » */
export const dateLongue = (date: Date) => majuscule(jourLong.format(date));

/** « Mercredi 2 – mercredi 8 juillet », ou « 1 janvier – 14 octobre » pour la saison. */
export function libelleIntervalle(periode: Periode, { debut, fin }: Intervalle): string {
  if (periode === "jour") return dateLongue(fin);
  if (periode === "saison") {
    return `${jourMois.format(debut).replace(/^1 /, "1er ")} – ${jourMois.format(fin)}`;
  }

  const memeMois = ymd(debut).slice(0, 7) === ymd(fin).slice(0, 7);
  const gauche = memeMois
    ? jourLong.format(debut).replace(/\s\S+$/, "")
    : jourLong.format(debut);
  return `${majuscule(gauche)} – ${jourLong.format(fin)}`;
}
