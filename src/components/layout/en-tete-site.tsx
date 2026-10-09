import { SiteHeader } from "@/components/layout/site-header";
import { getStatutInstallations } from "@/lib/api/content";
import { getMeteo } from "@/lib/meteo";

/**
 * Enveloppe serveur de l'en-tête : charge l'état des installations (mis en
 * cache, étiquette « statut ») et la météo du moment, puis les transmet au
 * composant client.
 */
export async function EnTeteSite() {
  const [statut, meteo] = await Promise.all([getStatutInstallations(), getMeteo()]);
  return <SiteHeader statut={statut} meteo={meteo} />;
}
