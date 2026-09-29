import { SiteHeader } from "@/components/layout/site-header";
import { getStatutInstallations } from "@/lib/api/content";

/**
 * Enveloppe serveur de l'en-tête : charge l'état des installations (mis en
 * cache, étiquette « statut ») et le transmet au composant client.
 */
export async function EnTeteSite() {
  const statut = await getStatutInstallations();
  return <SiteHeader statut={statut} />;
}
