import { texteBrut } from "@/components/ui/texte-riche";
import { libellesPublics, type BrouillonCompetition } from "@/lib/admin/brouillon-competition";

const jour = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", timeZone: "UTC" });
const mois = new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" });

/** Carte de la compétition telle qu'elle apparaît dans le calendrier du site. */
export function CarteApercu({
  brouillon: b,
  affiche,
}: {
  brouillon: BrouillonCompetition;
  affiche: string | null;
}) {
  const date = b.dateDebut ? new Date(`${b.dateDebut}T12:00:00Z`) : null;
  const publics = libellesPublics(b);
  const meta = [b.formule, publics.depart, publics.trous].filter(Boolean).join(" · ");

  return (
    <div className="flex gap-4 rounded-lg bg-sable-50 p-4">
      <p className="flex size-14 shrink-0 flex-col items-center justify-center rounded-sm bg-club-950 leading-none">
        <span className="font-butler text-[22px] font-bold text-sable-50">{date ? jour.format(date) : "—"}</span>
        <span className="mt-1 text-[10px] font-medium uppercase text-or-400">
          {date ? mois.format(date).replace(".", "") : ""}
        </span>
      </p>
      <div className="min-w-0 flex-1">
        <p className="font-butler text-[20px] font-medium leading-tight text-club-950">
          {b.nom || "Nom de la compétition"}
        </p>
        <p className="mt-1 text-[13px] text-encre/60">{meta}</p>
        {b.description ? (
          <p className="mt-2 line-clamp-2 text-[13px] text-encre/70">{texteBrut(b.description)}</p>
        ) : null}
        <p className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium">
          {b.ouverteVisiteurs ? (
            <span className="rounded-full bg-club-600/15 px-2.5 py-1 text-club-800">Ouvert à tous</span>
          ) : null}
          {b.sponsor ? (
            <span className="rounded-full bg-encre/[0.06] px-2.5 py-1 text-gris-500">Sponsor : {b.sponsor}</span>
          ) : null}
        </p>
      </div>
      {affiche ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={affiche} alt="" className="hidden h-24 w-[72px] shrink-0 rounded-sm object-cover sm:block" />
      ) : null}
    </div>
  );
}
