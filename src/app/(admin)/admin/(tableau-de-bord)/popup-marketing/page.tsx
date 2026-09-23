import type { Metadata } from "next";

import { AdminEmptySection } from "@/components/admin/admin-empty-section";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export const metadata: Metadata = {
  title: { absolute: "Pop-up marketing · Back-office" },
};

export default function Page() {
  return (
    <>
      <AdminPageHeader titre="Pop-up marketing" description="Fenêtre promotionnelle affichée sur le site public." />
      <AdminEmptySection />
    </>
  );
}
