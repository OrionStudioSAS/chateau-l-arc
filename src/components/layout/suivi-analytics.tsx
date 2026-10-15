"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { envoyerSuivi, evenements, suivre, type NomEvenement } from "@/lib/analytics/evenements";
import { urlReservation } from "@/config/site";

const NOMS = new Set<string>(Object.values(evenements));
const HOTE_RESERVATION = new URL(urlReservation).host;

/**
 * Mesure d'audience maison, sans cookie ni stockage dans le navigateur : une
 * page vue est envoyée à chaque changement de page, et les clics sont comptés
 * par délégation (un seul écouteur pour tout le site). Cf. app/api/suivi.
 */
export function SuiviAnalytics() {
  const chemin = usePathname();
  const dernier = useRef<string | null>(null);

  useEffect(() => {
    // Même page qu'au dernier envoi (double effet du mode strict) : déjà comptée.
    if (dernier.current === chemin) return;
    const premiere = dernier.current === null;
    dernier.current = chemin;

    // Première page chargée : début de visite si l'on arrive d'ailleurs.
    if (premiere) {
      let interne = false;
      try {
        interne = new URL(document.referrer).host === window.location.host;
      } catch {
        // Pas de référent : accès direct.
      }
      envoyerSuivi({ t: "vue", p: chemin, e: interne ? 0 : 1, r: interne ? "" : document.referrer });
    } else {
      envoyerSuivi({ t: "vue", p: chemin, e: 0 });
    }
  }, [chemin]);

  useEffect(() => {
    const surClic = (evenement: MouseEvent) => {
      const cible = (evenement.target as Element | null)?.closest?.("a, button");
      if (!cible) return;

      const nom = cible.closest("[data-suivi]")?.getAttribute("data-suivi");
      if (nom && NOMS.has(nom)) return suivre(nom as NomEvenement);

      const href = cible.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) return suivre(evenements.appel);
      if (href.includes(HOTE_RESERVATION)) return suivre(evenements.reservation);
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
