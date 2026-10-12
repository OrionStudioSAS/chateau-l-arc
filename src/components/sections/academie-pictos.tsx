import { cn } from "@/lib/cn";

export type NomPicto =
  | "calendrier"
  | "groupe"
  | "club"
  | "repetition"
  | "horloge"
  | "remise"
  | "telephone"
  | "juniors"
  | "adultes"
  | "diplome"
  | "info";

const chemins: Record<NomPicto, React.ReactNode> = {
  calendrier: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4m8-4v4" />
    </>
  ),
  groupe: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6m2 9a6 6 0 0 0-3-5.2" />
    </>
  ),
  club: <path d="M6 3l9 15m0 0 3 1.5-1 1.5-3-1.5 1-1.5ZM5 21h6" />,
  repetition: <path d="M4 9h13l-3-3m6 9H7l3 3" />,
  horloge: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 2" />
    </>
  ),
  remise: <path d="M3 12V4h8l10 10-8 8L3 12Zm5-4h.01" />,
  telephone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  ),
  juniors: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M9 14a4 4 0 0 0 6 0M9.5 10h.01M14.5 10h.01" />
    </>
  ),
  adultes: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" />
    </>
  ),
  diplome: <path d="M2 9l10-5 10 5-10 5L2 9Zm4 2.5V16c2 2 10 2 12 0v-4.5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
};

/** Pictogrammes au trait de la page Académie. */
export function PictoAcademie({ nom, className }: { nom: NomPicto; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("size-4 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {chemins[nom]}
    </svg>
  );
}
