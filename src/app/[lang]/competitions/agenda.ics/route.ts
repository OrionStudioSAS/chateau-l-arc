import { site } from "@/config/site";
import { getCompetitions } from "@/lib/api/content";

/**
 * Calendrier des compétitions à venir au format iCalendar (.ics), pour le
 * bouton « Ajouter à mon agenda » : importable dans Google Agenda, Outlook,
 * Calendrier Apple…
 */

/** Échappement des valeurs texte (RFC 5545). */
const echapper = (texte: string) =>
  texte.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** AAAA-MM-JJ → AAAAMMJJ ; `decalage` en jours (fin exclusive des journées entières). */
function dateIcs(iso: string, decalage = 0): string {
  const date = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + decalage);
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

export async function GET() {
  const competitions = (await getCompetitions()).filter(
    (competition) => competition.etat.cle !== "terminee",
  );
  const horodatage = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const lieu = `Golf Château l'Arc, ${site.contact.adresse}, ${site.contact.codePostalVille}`;

  const evenements = competitions.map((competition) =>
    [
      "BEGIN:VEVENT",
      `UID:${competition.slug}@chateaularcgolfclub`,
      `DTSTAMP:${horodatage}`,
      `DTSTART;VALUE=DATE:${dateIcs(competition.dateDebut)}`,
      `DTEND;VALUE=DATE:${dateIcs(competition.dateFin ?? competition.dateDebut, 1)}`,
      `SUMMARY:${echapper(competition.nom)}`,
      `DESCRIPTION:${echapper(
        [competition.formule, competition.depart, competition.trous].filter(Boolean).join(" · "),
      )}`,
      `LOCATION:${echapper(lieu)}`,
      `URL:${site.url}/competitions/${competition.slug}`,
      "END:VEVENT",
    ].join("\r\n"),
  );

  const calendrier = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Golf Chateau l'Arc//Competitions//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Compétitions — Golf Château l'Arc",
    ...evenements,
    "END:VCALENDAR",
    "",
  ].join("\r\n");

  return new Response(calendrier, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="competitions-chateau-l-arc.ics"',
    },
  });
}
