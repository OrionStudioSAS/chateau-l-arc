import { cn } from "@/lib/cn";

/**
 * Contenu de la pop-up marketing. Partagé par le site public et l'aperçu du
 * back-office, pour que l'aperçu soit fidèle au rendu réel.
 */
export function CartePopup({
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
        "relative w-full max-w-sm overflow-hidden rounded-xl bg-sable-100 text-center shadow-xl",
        className,
      )}
    >
      <button
        type="button"
        onClick={onFermer}
        aria-label="Fermer"
        className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full text-encre/50 transition-colors hover:bg-encre/5 hover:text-encre"
      >
        <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3">
          <path
            d="M2 2l8 8M10 2l-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {afficheUrl ? (
        // Image téléversée par le club, de dimensions inconnues à l'avance :
        // <img> plutôt que next/image, qui exige de les connaître.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={afficheUrl} alt="" className="aspect-[16/9] w-full object-cover" />
      ) : null}

      <div className="px-8 pb-8 pt-7">
        {afficheUrl ? null : (
          <span aria-hidden="true" className="text-[26px] leading-none text-club-950">
            ☀
          </span>
        )}

        <p
          id={idTitre}
          className="mt-3 font-butler text-[26px] font-bold leading-tight text-club-950"
        >
          {titre || "Titre de la pop-up"}
        </p>

        {texte ? (
          <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-encre/70">
            {texte}
          </p>
        ) : null}

        {boutonLibelle && boutonLien ? (
          <a
            href={boutonLien}
            onClick={onAction}
            className="mt-5 inline-block rounded-lg bg-or-500 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-or-600"
          >
            {boutonLibelle}
          </a>
        ) : null}
      </div>
    </div>
  );
}
