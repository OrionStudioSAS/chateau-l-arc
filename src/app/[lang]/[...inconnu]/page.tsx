import { notFound } from "next/navigation";

/** Adresse inconnue du site public : la 404 du site, dans sa langue (cf. ../not-found.tsx). */
export default function PageInconnue() {
  notFound();
}
