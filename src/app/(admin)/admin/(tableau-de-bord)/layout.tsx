import Link from "next/link";

import { AdminNav } from "@/components/admin/admin-nav";
import { BarreAdminMobile } from "@/components/admin/barre-admin-mobile";
import { DeconnexionBouton } from "@/components/admin/deconnexion-bouton";
import { site } from "@/config/site";
import { exigerUtilisateur } from "@/lib/supabase/session";

/**
 * La lecture de session se fait ici : `instant` ne se propage pas depuis le
 * layout parent, le segment qui bloque doit le déclarer lui-même.
 */
export const instant = false;

/**
 * Chrome du back-office.
 * L'accès est déjà filtré par src/proxy.ts ; la vérification est refaite ici
 * car un contrôle dans le proxy seul ne suffit pas à protéger les données.
 */
export default async function TableauDeBordLayout({
  children,
}: LayoutProps<"/admin">) {
  const utilisateur = await exigerUtilisateur();

  const marque = (
    <Link href="/admin" className="flex items-center gap-3 px-1">
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-lg bg-club-950 text-sm text-sable-50"
      >
        CA
      </span>
      <span>
        <span className="block text-sm font-semibold leading-tight">
          {site.shortName}
        </span>
        <span className="block text-xs text-neutral-500">Mini back-office</span>
      </span>
    </Link>
  );

  const compte = (
    <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-club-800 text-xs uppercase text-sable-50"
        >
          {utilisateur.email.slice(0, 2)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium leading-tight">
            {utilisateur.email}
          </span>
          <span className="block text-xs text-neutral-500">Connecté</span>
        </span>
      </div>
      <DeconnexionBouton />
    </div>
  );

  return (
    <div className="min-h-screen lg:flex">
      {/* Sous 1024 px : barre en haut, navigation dépliable. */}
      <BarreAdminMobile marque={marque}>
        <AdminNav />
        {compte}
      </BarreAdminMobile>

      {/* Bureau : barre latérale fixe, qui reste visible au défilement. */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between overflow-y-auto border-r border-neutral-200 bg-neutral-50 px-4 py-5 lg:flex">
        <div>
          <div className="mb-6">{marque}</div>
          <AdminNav />
        </div>
        {compte}
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
