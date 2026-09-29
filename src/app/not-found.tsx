import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { NotFoundContent } from "@/components/layout/not-found-content";
import { SiteFooter } from "@/components/layout/site-footer";
import { EnTeteSite } from "@/components/layout/en-tete-site";

/** 404 des URL hors arborescence : rend le chrome public à la main. */
export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col bg-sable-50 text-encre">
      <AnnouncementBar />
      <EnTeteSite />
      <main className="flex-1">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </div>
  );
}
