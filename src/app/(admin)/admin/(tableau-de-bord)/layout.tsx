import Link from "next/link";

import { AdminNav } from "@/components/admin/admin-nav";
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

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-neutral-200 bg-neutral-50 px-4 py-5">
        <div>
          <Link href="/admin" className="mb-6 flex items-center gap-3 px-1">
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
          <AdminNav />
        </div>

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
      </aside>

      <main className="flex-1 px-10 py-10">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
