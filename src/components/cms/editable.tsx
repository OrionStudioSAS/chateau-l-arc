"use client";

import { useCallback, useSyncExternalStore, type ComponentPropsWithoutRef, type ElementType } from "react";

type EditableProps<T extends ElementType = "span"> = {
  /** « Section.CONSTANTE » ou, pour un élément de liste, « Section.CONSTANTE.0.cle ». */
  path: string;
  as?: T;
  /** Zone d'image : l'aperçu remplace l'image qu'elle contient. */
  image?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "path" | "as">;

const sAbonner = () => () => {};
const enEdition = () => new URLSearchParams(window.location.search).has("edit");

/** Vrai dans l'aperçu de l'éditeur visuel (page chargée avec ?edit). */
export function useModeEdition(): boolean {
  return useSyncExternalStore(sAbonner, enEdition, () => false);
}

/**
 * Texte ou image modifiable depuis l'éditeur visuel du back-office (même
 * protocole qu'Orion admin). Hors édition, rend simplement la balise.
 */
export function Editable<T extends ElementType = "span">({
  path,
  as,
  image,
  children,
  ...props
}: EditableProps<T>) {
  const Tag = as || "span";
  const editMode = useModeEdition();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      window.parent.postMessage({ type: "cms:field-click", path }, "*");
    },
    [path],
  );

  if (!editMode || !path) {
    return <Tag {...props}>{children}</Tag>;
  }

  return (
    <Tag data-cms-path={path} data-cms-image={image ? "" : undefined} onClick={handleClick} {...props}>
      {children}
    </Tag>
  );
}
