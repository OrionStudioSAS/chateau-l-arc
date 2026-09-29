export function AdminPageHeader({
  titre,
  description,
}: {
  titre: string;
  description?: string;
}) {
  return (
    <header className="mb-6 sm:mb-8">
      <h1 className="text-xl font-bold sm:text-2xl tracking-tight text-neutral-900">{titre}</h1>
      {description ? (
        <p className="mt-2 text-sm text-neutral-500">{description}</p>
      ) : null}
    </header>
  );
}
