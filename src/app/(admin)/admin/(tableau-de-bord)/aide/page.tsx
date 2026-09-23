import type { Metadata } from "next";

import { AdminEmptySection } from "@/components/admin/admin-empty-section";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export const metadata: Metadata = {
  title: { absolute: "Aide & contact · Back-office" },
};

export default function Page() {
  return (
    <>
      <AdminPageHeader titre="Aide & contact" description="Documentation du back-office et contact support." />
      <AdminEmptySection />
    </>
  );
}
