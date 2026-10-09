import { cacheLife } from "next/cache";

/**
 * Météo du moment au golf, pour le panneau « Aujourd'hui au golf ».
 *
 * Source : Open-Meteo (sans clé ni cookie). TODO : son offre gratuite est
 * réservée à un usage non commercial ; pour la mise en ligne, prendre
 * l'abonnement Open-Meteo ou basculer sur un fournisseur à clé (Météo-France,
 * OpenWeatherMap) en ne changeant que cette fonction.
 */

/** Domaine de Château l'Arc, Fuveau. */
const LATITUDE = 43.46;
const LONGITUDE = 5.57;

export type Meteo = {
  temperature: number;
  /** « ensoleillé », « nuageux », « pluie »… */
  ciel: string;
  /** Famille de pictogramme. */
  picto: "soleil" | "nuage" | "pluie";
  /** Vent moyen, en km/h. */
  vent: number;
};

/** Codes météo WMO renvoyés par Open-Meteo. */
function decrireCiel(code: number): Pick<Meteo, "ciel" | "picto"> {
  if (code === 0) return { ciel: "ensoleillé", picto: "soleil" };
  if (code <= 2) return { ciel: "éclaircies", picto: "soleil" };
  if (code === 3) return { ciel: "couvert", picto: "nuage" };
  if (code === 45 || code === 48) return { ciel: "brouillard", picto: "nuage" };
  if (code >= 51 && code <= 57) return { ciel: "bruine", picto: "pluie" };
  if (code >= 61 && code <= 67) return { ciel: "pluie", picto: "pluie" };
  if (code >= 71 && code <= 77) return { ciel: "neige", picto: "nuage" };
  if (code >= 80 && code <= 82) return { ciel: "averses", picto: "pluie" };
  if (code >= 95) return { ciel: "orage", picto: "pluie" };
  return { ciel: "nuageux", picto: "nuage" };
}

/** Météo actuelle, ou null si le service ne répond pas (la ligne est alors masquée). */
export async function getMeteo(): Promise<Meteo | null> {
  "use cache";
  // Rafraîchie toutes les 30 minutes : largement assez pour un coup d'œil.
  cacheLife({ stale: 300, revalidate: 1800, expire: 7200 });

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(LATITUDE),
    longitude: String(LONGITUDE),
    current: "temperature_2m,weather_code,wind_speed_10m",
    wind_speed_unit: "kmh",
    timezone: "Europe/Paris",
  }).toString();

  try {
    const reponse = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);

    const { current } = (await reponse.json()) as {
      current?: { temperature_2m: number; weather_code: number; wind_speed_10m: number };
    };
    if (!current) return null;

    return {
      temperature: Math.round(current.temperature_2m),
      vent: Math.round(current.wind_speed_10m),
      ...decrireCiel(current.weather_code),
    };
  } catch (erreur) {
    // Échec passager (le service renvoie parfois 503) : on réessaie vite
    // plutôt que de garder l'absence de météo en cache 30 minutes.
    cacheLife({ stale: 60, revalidate: 120, expire: 300 });
    console.error("Météo indisponible", erreur);
    return null;
  }
}
