import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { IconeAdmin } from "@/components/admin/icone-admin";
import { RaccourciNouvellePage } from "@/components/admin/pages/raccourci";
import { equipeOrion } from "@/config/admin";
import { pagesCms } from "@/config/pages-cms";
import { site } from "@/config/site";

export const metadata: Metadata = { title: { absolute: "Pages · Back-office" } };

const domaine = new URL(site.url).host.replace(/^www\./, "");

/** Rubrique « Pages » (maquette) : chaque page s'ouvre dans l'éditeur visuel. */
export default function Page() {
  const demande = equipeOrion[0]?.ecrire ?? "https://orion-studio.io";

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight text-neutral-900">Pages</h1>
          <p className="mt-1 text-[14px] text-neutral-500">
            Modifiez les textes et les images de votre site directement sur la page, sans risque de casser le design.
          </p>
        </div>
        <a
          href={demande}
          target="_blank"
          rel="noopener"
          id="demande-page"
          className="inline-flex items-center gap-2 rounded-lg bg-club-950 px-3 py-2 text-[14px] font-medium text-white hover:bg-club-800"
        >
          <IconeAdmin nom="plus" className="size-4" />
          Demander une nouvelle page
          <kbd aria-hidden="true" className="hidden rounded bg-white/15 px-1.5 font-sans text-[11px] font-semibold sm:inline">
            N
          </kbd>
        </a>
        <RaccourciNouvellePage cible="demande-page" />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200">
        <p className="border-b border-neutral-200 bg-neutral-50 px-4 py-2.5 pl-[96px] text-[13px] text-neutral-500">Page</p>
        <ul className="divide-y divide-neutral-200">
          {pagesCms.map((page) => (
            <li key={page.cle} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[#fdfaf3]">
              <span className="relative flex h-[38px] w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                {page.vignette ? (
                  <Image src={page.vignette} alt="" fill sizes="64px" className="object-cover" />
                ) : (
                  <IconeAdmin nom="page" className="size-4 text-neutral-400" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-neutral-900">{page.titre}</p>
                <p className="mt-0.5 flex items-center gap-1.5 truncate font-mono text-[12px] text-neutral-500">
                  <IconeAdmin nom="globe" className="size-3.5 shrink-0" />
                  {domaine}
                  {page.chemin}
                </p>
              </div>
              <Link
                href={`/admin/pages/${page.cle}`}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[14px] font-medium text-neutral-800 hover:bg-neutral-50"
              >
                <IconeAdmin nom="crayon" className="size-4" />
                Modifier
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
