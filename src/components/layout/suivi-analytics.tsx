"use client";

import Script from "next/script";
import { useEffect } from "react";

import { evenements, suivre, type NomEvenement } from "@/lib/analytics/evenements";
import { urlReservation } from "@/config/site";

const ID_SITE = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const SCRIPT = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://cloud.umami.is/script.js";
/** Domaines comptés, séparés par des virgules : écarte les déploiements de prévisualisation. */
const DOMAINES = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;
const NOMS = new Set<string>(Object.values(evenements));
const HOTE_RESERVATION = new URL(urlReservation).host;

/**
 * Mesure d'audience Umami : sans cookie ni donnée personnelle, elle ne demande
 * pas de bandeau de consentement. Inactive tant que NEXT_PUBLIC_UMAMI_WEBSITE_ID
 * n'est pas renseigné, et hors production (pas de visites de test comptées).
 *
 * Les clics sont comptés par délégation : un seul écouteur pour tout le site.
 */
export function SuiviAnalytics() {
  useEffect(() => {
    if (!ID_SITE) return;

    const surClic = (evenement: MouseEvent) => {
      const cible = (evenement.target as Element | null)?.closest?.("a, button");
      if (!cible) return;

      const nom = cible.closest("[data-suivi]")?.getAttribute("data-suivi");
      if (nom && NOMS.has(nom)) return suivre(nom as NomEvenement);

      const href = cible.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) return suivre(evenements.appel, { page: location.pathname });
      if (href.includes(HOTE_RESERVATION)) {
        return suivre(evenements.reservation, { page: location.pathname });
      }
    };

    const surEnvoi = (evenement: SubmitEvent) => {
      const nom = (evenement.target as HTMLFormElement).getAttribute("data-suivi-envoi");
      if (nom && NOMS.has(nom)) suivre(nom as NomEvenement);
    };

    document.addEventListener("click", surClic, { capture: true });
    document.addEventListener("submit", surEnvoi, { capture: true });
    return () => {
      document.removeEventListener("click", surClic, { capture: true });
      document.removeEventListener("submit", surEnvoi, { capture: true });
    };
  }, []);

  if (!ID_SITE || process.env.NODE_ENV !== "production") return null;

  return (
    <Script
      src={SCRIPT}
      data-website-id={ID_SITE}
      data-domains={DOMAINES || undefined}
      strategy="afterInteractive"
    />
  );
}
