import Link from "next/link";

import { Container } from "@/components/ui/container";

export function AppelSaison() {
  return (
    <section className="bg-club-950 py-20 text-sable-50">
      <Container>
        <div className="text-center">
          <h2 className="font-butler text-[32px] font-medium leading-tight sm:text-[40px]">
            Envie de jouer la saison avec nous ?
          </h2>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/devenir-membre"
              className="rounded-lg bg-or-500 px-7 py-4 text-[16px] font-medium text-white transition-colors hover:bg-or-600"
            >
              Rejoindre l&apos;Association Sportive
            </Link>
            <Link
              href="/reserver"
              className="rounded-lg border border-sable-50/40 px-7 py-4 text-[16px] font-medium text-sable-50 transition-colors hover:bg-sable-50/10"
            >
              Réserver un départ
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
