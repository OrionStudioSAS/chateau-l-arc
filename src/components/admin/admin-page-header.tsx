export function AdminPageHeader({
  titre,
  description,
}: {
  titre: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{titre}</h1>
      {description ? (
        <p className="mt-2 text-sm text-neutral-500">{description}</p>
      ) : null}
    </header>
  );
}
