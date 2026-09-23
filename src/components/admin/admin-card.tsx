import { cn } from "@/lib/cn";

export function AdminCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
