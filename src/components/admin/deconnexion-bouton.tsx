import { seDeconnecter } from "@/app/(admin)/admin/actions";

export function DeconnexionBouton() {
  return (
    <form action={seDeconnecter}>
      <button
        type="submit"
        className="mt-3 w-full rounded-lg border border-neutral-200 py-2 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
      >
        Se déconnecter
      </button>
    </form>
  );
}
