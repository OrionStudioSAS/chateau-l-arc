import type { Metadata } from "next";

import { CompetitionsAdmin } from "@/components/admin/competitions-admin";
import { listerCompetitions } from "@/lib/admin/competitions";

export const metadata: Metadata = {
  title: { absolute: "Compétitions · Back-office" },
};

export const instant = false;

export default async function Page({
  searchParams,
}: PageProps<"/admin/competitions">) {
  const { page } = await searchParams;
  const numeroPage = Math.max(1, Number(page) || 1);
  const { competitions, pages } = await listerCompetitions(numeroPage);

  return (
    <CompetitionsAdmin
      competitions={competitions}
      page={numeroPage}
      pages={pages}
    />
  );
}
