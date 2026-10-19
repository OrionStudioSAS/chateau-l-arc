import Image from "next/image";

import { ChampVideo } from "@/components/cms/champ-video";
import { PresentationIntro } from "@/components/sections/presentation-intro";
import { Container } from "@/components/ui/container";
import { i18n } from "@/lib/i18n/serveur";

const IMAGE_PROVISOIRE = "/images/banner.jpg";

export async function Presentation() {
  const { T, tr } = await i18n();
  const { VIDEO_YOUTUBE_ID } = T;
  return (
    <section className="overflow-hidden bg-white py-14 lg:py-20">
      <PresentationIntro />

      <Container className="mt-20">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-club-950">
          {VIDEO_YOUTUBE_ID ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_YOUTUBE_ID}`}
              title={tr("Vidéo de présentation du Golf Château l'Arc")}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <Image
              src={IMAGE_PROVISOIRE}
              alt=""
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <ChampVideo path="Accueil · Présentation.VIDEO_YOUTUBE_ID" identifiant={VIDEO_YOUTUBE_ID} />
      </Container>
    </section>
  );
}
