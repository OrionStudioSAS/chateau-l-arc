import { twMerge } from "tailwind-merge";

/**
 * Concatène des classes Tailwind en laissant la dernière l'emporter sur les
 * précédentes quand elles touchent la même propriété (`hidden` contre
 * `inline-flex`, `text-white` contre `text-encre`…). Une simple concaténation
 * laisserait l'ordre du CSS généré décider, ce qui est imprévisible.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return twMerge(classes.filter(Boolean).join(" "));
}
