"use client";

import { useEffect } from "react";

import { evenements, suivre, type NomEvenement } from "@/lib/analytics/evenements";
import { urlReservation } from "@/config/site";

const NOMS = new Set<string>(Object.values(evenements));
const HOTE_RESERVATION = new URL(urlReservation).host;

/**
 * Événements Umami du site public, actifs uniquement en production.
 * Le script de mesure d'audience est chargé dans le layout racine.
 *
 * Les clics sont comptés par délégation : un seul écouteur pour tout le site.
 */
export function SuiviAnalytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

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

  return null;
}
