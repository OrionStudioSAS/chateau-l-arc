import { seDeconnecter } from "@/app/(admin)/admin/actions";
import { IconeAdmin } from "@/components/admin/icone-admin";

export function DeconnexionBouton() {
  return (
    <form action={seDeconnecter}>
      <button
        type="submit"
        className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] text-neutral-700 transition-colors hover:bg-neutral-100"
      >
        <IconeAdmin nom="sortie" className="size-4 text-neutral-500" />
        Se déconnecter
      </button>
    </form>
  );
}
