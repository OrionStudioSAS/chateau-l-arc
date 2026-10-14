import { cn } from "@/lib/cn";

/** Tracés au trait (24 × 24), dans l'esprit des icônes de la maquette. */
const traces = {
  maison: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  courrier: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  drapeau: <path d="M5 21V4m0 0h11l-2 4 2 4H5" />,
  trophee: (
    <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5v1a3 3 0 0 0 3 3m8-4h3v1a3 3 0 0 1-3 3m-4 3v4m-3 4h6m-5-4h4" />
  ),
  etiquette: (
    <>
      <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" />
      <circle cx="8" cy="8" r="1.5" />
    </>
  ),
  calendrier: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4m8-4v4" />
    </>
  ),
  bandeau: <rect x="4" y="6" width="16" height="12" rx="1.5" />,
  megaphone: <path d="M3 10v4h3l7 4V6L6 10zm13-1a3 3 0 0 1 0 6M6 14l1 5h2.5" />,
  page: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6m-6 4h6" />
    </>
  ),
  livre: (
    <>
      <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z" />
      <path d="M5 18a2 2 0 0 1 2-2h11M9 8h5" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m21 16-5-5-9 9" />
    </>
  ),
  prise: <path d="M9 3v5m6-5v5M7 8h10v3a5 5 0 0 1-10 0zm5 8v5" />,
  traduction: <path d="M4 5h9M8.5 3v2c0 4-2 7-5 8m2-4c1 2 3 3.5 6 4M13 21l4-10 4 10m-6.5-3h5" />,
  formulaire: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1M9 10h6m-6 4h6" />
    </>
  ),
  aide: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.8 1c0 1.7-2.3 2-2.3 3.5m0 3h.01" />
    </>
  ),
  etoile: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />,
  bouee: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="m5.6 5.6 3.6 3.6m5.6 5.6 3.6 3.6m0-12.8-3.6 3.6m-5.6 5.6-3.6 3.6" />
    </>
  ),
  externe: <path d="M14 4h6v6m0-6L10 14m-1-9H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-4" />,
  fleche: <path d="M7 17 17 7m-8 0h8v8" />,
  recherche: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </>
  ),
  chevronHaut: <path d="m6 15 6-6 6 6" />,
  chevronDroite: <path d="m9 6 6 6-6 6" />,
  selecteur: <path d="m8 9 4-4 4 4m-8 6 4 4 4-4" />,
  crayon: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  camera: (
    <>
      <rect x="3" y="7" width="12" height="10" rx="2" />
      <path d="m15 11 6-3v8l-6-3" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  fermer: <path d="M6 6l12 12M18 6 6 18" />,
  points: <path d="M5 12h.01M12 12h.01M19 12h.01" />,
  sortie: <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4m-5-4 4-4-4-4m4 4H4" />,
  swingcall: <path d="M4 4l16 16M4 12l8 8M12 4l8 8" />,
  fidzly: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8h5m-5 0v8m0-4h4" />
    </>
  ),
} satisfies Record<string, React.ReactNode>;

export type NomIconeAdmin = keyof typeof traces;

export function IconeAdmin({ nom, className }: { nom: NomIconeAdmin; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-[18px] shrink-0", className)}
    >
      {traces[nom]}
    </svg>
  );
}
