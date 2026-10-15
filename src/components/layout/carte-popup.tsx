import { cn } from "@/lib/cn";

/**
 * Contenu de la pop-up marketing. Partagé par le site public et l'aperçu du
 * back-office, pour que l'aperçu soit fidèle au rendu réel.
 */
export function CartePopup({
  surtitre,
  titre,
  texte,
  boutonLibelle,
  boutonLien,
  afficheUrl,
  onFermer,
  onAction,
  idTitre,
  className,
}: {
  surtitre?: string;
  titre: string;
  texte: string;
  boutonLibelle?: string;
  boutonLien?: string;
  afficheUrl?: string;
  onFermer?: () => void;
  onAction?: () => void;
  /** id du titre, pour `aria-labelledby` sur la boîte de dialogue. */
  idTitre?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full max-w-sm overflow-hidden rounded-xl bg-[#f6f0e3] text-center shadow-2xl",
        className,
      )}
    >
      <button
        type="button"
        onClick={onFermer}
        aria-label="Fermer"
        className={cn(
          "absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full transition-colors",
          afficheUrl
            ? "bg-white text-encre shadow-sm hover:bg-sable-50"
            : "text-encre/50 hover:bg-encre/5 hover:text-encre",
        )}
      >
        <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {afficheUrl ? (
        // Image téléversée par le club, de dimensions inconnues à l'avance :
        // <img> plutôt que next/image, qui exige de les connaître.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={afficheUrl} alt="" className="aspect-[5/2] w-full object-cover" />
      ) : null}

      <div className={cn("px-8 pb-8", afficheUrl ? "pt-6" : "pt-10")}>
        {surtitre ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-or-600">{surtitre}</p>
        ) : null}

        <p
          id={idTitre}
          className={cn(
            "font-butler text-[26px] font-medium leading-[1.1] text-club-950",
            surtitre && "mt-2.5",
          )}
        >
          {titre || "Titre de la pop-up"}
        </p>

        {texte ? (
          <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-encre/70">{texte}</p>
        ) : null}

        {boutonLibelle && boutonLien ? (
          <a
            href={boutonLien}
            onClick={onAction}
            className="mt-6 inline-block rounded-md bg-or-500 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-or-600"
          >
            {boutonLibelle}
          </a>
        ) : null}
      </div>
    </div>
  );
}
