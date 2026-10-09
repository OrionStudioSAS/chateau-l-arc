import { AnimationsDefilement } from "@/components/layout/animations-defilement";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { EnTeteSite } from "@/components/layout/en-tete-site";
import { PopupMarketing } from "@/components/layout/popup-marketing";
import { SiteFooter } from "@/components/layout/site-footer";
import { getPopupActive } from "@/lib/api/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const popup = await getPopupActive();

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
      <EnTeteSite />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <PopupMarketing popup={popup} />
        <AnimationsDefilement />
    </div>
  );
}
