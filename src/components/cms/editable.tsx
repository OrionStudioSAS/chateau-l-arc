"use client";

import { useEffect, useState, useCallback, type ElementType, type ComponentPropsWithoutRef } from "react";

type EditableProps<T extends ElementType = "span"> = {
  path: string;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "path" | "as">;

let _editMode: boolean | null = null;
function isEditMode() {
  if (typeof window === "undefined") return false;
  if (_editMode === null) _editMode = new URLSearchParams(window.location.search).has("edit");
  return _editMode;
}

export function Editable<T extends ElementType = "span">({
  path,
  as,
  children,
  ...props
}: EditableProps<T>) {
  const Tag = as || "span";
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setEditMode(isEditMode());
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!editMode) return;
      e.preventDefault();
      e.stopPropagation();
      window.parent.postMessage({ type: "cms:field-click", path }, "*");
    },
    [editMode, path],
  );

  if (!editMode || !path) {
    return <Tag {...props}>{children}</Tag>;
  }

  return (
    <Tag data-cms-path={path} onClick={handleClick} {...props}>
      {children}
    </Tag>
  );
}
