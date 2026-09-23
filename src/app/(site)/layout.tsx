import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-col bg-sable-50 text-encre">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-club-950 focus:px-5 focus:py-3 focus:text-sable-50"
      >
        Aller au contenu
      </a>
      {/* Le bandeau défile normalement ; seul l'en-tête colle en haut de la
          fenêtre, et se place donc sous le bandeau tant que la page n'a pas défilé. */}
      <AnnouncementBar />
      <SiteHeader />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
