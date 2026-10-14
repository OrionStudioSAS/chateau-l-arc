import Link from "next/link";

import { BarreHaute } from "@/components/admin/barre-haute";
import { BarreLaterale } from "@/components/admin/barre-laterale";
import { DeconnexionBouton } from "@/components/admin/deconnexion-bouton";
import { IconeAdmin } from "@/components/admin/icone-admin";
import { MenuCompte } from "@/components/admin/menu-compte";
import { Blason } from "@/components/ui/blason";
import { site } from "@/config/site";
import { exigerUtilisateur } from "@/lib/admin/session";
import { derniereModification } from "@/lib/contenu/depot";
import { lireContenu } from "@/lib/contenu/stockage";

/**
 * La lecture de session se fait ici : `instant` ne se propage pas depuis le
 * layout parent, le segment qui bloque doit le déclarer lui-même.
 */
export const instant = false;

const heure = new Intl.DateTimeFormat("fr-FR", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});
const jour = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: "Europe/Paris",
});
const cleJour = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" });

/** « 6h42 » si c'était aujourd'hui, sinon « 9 oct. ». */
function libellePublication(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return cleJour.format(date) === cleJour.format(new Date())
    ? heure.format(date).replace(":", "h")
    : jour.format(date);
}

/**
 * Chrome du back-office (maquette « Accueil ») : barre latérale sur fond
 * grège, contenu dans un panneau blanc arrondi.
 * L'accès est déjà filtré par src/proxy.ts ; la vérification est refaite ici
 * car un contrôle dans le proxy seul ne suffit pas à protéger les données.
 */
export default async function TableauDeBordLayout({ children }: LayoutProps<"/admin">) {
  const utilisateur = await exigerUtilisateur();
  const [competitions, publication] = await Promise.all([
    lireContenu("competitions"),
    derniereModification("contenu"),
  ]);

  const aujourdhui = cleJour.format(new Date());
  const compteurs = {
    competitions: competitions.filter((c) => (c.dateFin ?? c.dateDebut) >= aujourdhui).length,
  };

  const marque = (
    <Link href="/admin" className="flex items-center gap-3 rounded-lg px-1.5 py-1 hover:bg-neutral-200/40">
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-club-950"
      >
        <Blason className="h-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-semibold leading-tight text-neutral-900">
          {site.shortName}
        </span>
        <span className="block truncate text-[12px] text-neutral-500">Golf Club · Fuveau</span>
      </span>
      <IconeAdmin nom="selecteur" className="size-4 text-neutral-400" />
    </Link>
  );

  const barre = (
    <BarreLaterale
      marque={marque}
      compteurs={compteurs}
      compte={<MenuCompte email={utilisateur.email} deconnexion={<DeconnexionBouton />} />}
    />
  );

  return (
    <div className="min-h-screen bg-[#f4f4f1] lg:flex lg:gap-2 lg:p-2">
      <aside className="sticky top-2 hidden h-[calc(100vh-1rem)] w-[232px] shrink-0 overflow-y-auto px-1.5 py-2 lg:block">
        {barre}
      </aside>

      <div className="min-w-0 flex-1 bg-white lg:rounded-xl lg:border lg:border-neutral-200">
        <BarreHaute publication={libellePublication(publication)} tiroir={barre} />
        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-[1110px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
