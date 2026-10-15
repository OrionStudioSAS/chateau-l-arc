"use client";

import { Editable, useModeEdition } from "@/components/cms/editable";

/**
 * Une vidéo YouTube intégrée ne laisse pas passer les clics : dans l'aperçu
 * de l'éditeur visuel seulement, une étiquette sous la vidéo donne accès à
 * son identifiant. Invisible sur le site.
 */
export function ChampVideo({ path, identifiant }: { path: string; identifiant: string }) {
  const edition = useModeEdition();
  if (!edition) return null;
  return (
    <p className="mt-3 text-center text-[13px] text-encre/60">
      Vidéo YouTube :{" "}
      <Editable path={path} className="rounded bg-sable-100 px-2 py-1 font-mono text-encre">
        {identifiant}
      </Editable>
    </p>
  );
}
