"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { Surtitre } from "@/components/ui/surtitre";
import { TROUS } from "@/lib/parcours";
import { REPERES } from "@/lib/reperes";

export function ExplorerParcours() {
  const [numero, setNumero] = useState(1);
  const trou = TROUS.find((candidat) => candidat.numero === numero) ?? TROUS[0];
  const selecteur = useRef<HTMLDivElement>(null);

  // Sélecteur mobile : le trou choisi (y compris via « Trou suivant ») est
  // ramené au centre de la rangée, sans faire défiler la page.
  useEffect(() => {
    const rangee = selecteur.current;
    const puce = rangee?.querySelector<HTMLElement>(`[data-numero="${numero}"]`);
    if (!rangee || !puce) return;
    rangee.scrollTo({
      left: puce.offsetLeft - rangee.clientWidth / 2 + puce.clientWidth / 2,
      behavior: "smooth",
    });
  }, [numero]);

  const precedent = numero === 1 ? TROUS.length : numero - 1;
  const suivant = numero === TROUS.length ? 1 : numero + 1;

  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="text-center">
          <Surtitre className="text-or-600">
            Trou par trou
          </Surtitre>

          <h2 className="mt-6 font-butler text-[40px] font-medium leading-[1.1] text-club-950 sm:text-[64px]">
            Explorez le parcours
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[18px] font-normal text-encre/70">
            Choisissez un trou pour découvrir sa vidéo, son infographie et le conseil
            du pro.
          </p>
        </div>

        {/* grid-cols-1 (minmax(0, 1fr)) : sans lui, la colonne prendrait la
            largeur de la rangée de numéros et ferait déborder la page. */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-14 lg:grid-cols-2 lg:items-center lg:gap-10">
          <div className="min-w-0">
            {/* Carte : les pastilles numérotées font partie de l'image, les zones
                cliquables sont superposées d'après les coordonnées de lib/parcours. */}
            <div className="relative mx-auto w-full max-w-[640px]">
              <Image
                src="/images/map.png"
                alt="Plan du parcours 18 trous"
                width={1742}
                height={1074}
                className="h-auto w-full"
              />

              {TROUS.map((candidat) => (
                <button
                  key={candidat.numero}
                  type="button"
                  onClick={() => setNumero(candidat.numero)}
                  aria-pressed={candidat.numero === numero}
                  title={`Trou n°${candidat.numero}`}
                  className={`absolute size-9 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600 ${
                    candidat.numero === numero
                      ? "ring-2 ring-club-950 ring-offset-2"
                      : "hover:ring-2 hover:ring-club-600/50"
                  }`}
                  style={{
                    left: `${candidat.position.x}%`,
                    top: `${candidat.position.y}%`,
                  }}
                >
                  <span className="sr-only">Trou n°{candidat.numero}</span>
                </button>
              ))}
            </div>

            {/* Mobile : sur la carte réduite, les pastilles sont trop petites pour
                le doigt. Une rangée de numéros prend le relais. */}
            <div
              ref={selecteur}
              role="group"
              aria-label="Choisir un trou"
              className="sans-barre relative -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 md:hidden"
            >
              {TROUS.map((candidat) => (
                <button
                  key={candidat.numero}
                  type="button"
                  data-numero={candidat.numero}
                  onClick={() => setNumero(candidat.numero)}
                  aria-pressed={candidat.numero === numero}
                  aria-label={`Trou n°${candidat.numero}`}
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold transition-colors ${
                    candidat.numero === numero
                      ? "bg-club-950 text-sable-50"
                      : "bg-sable-100 text-club-950"
                  }`}
                >
                  {candidat.numero}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg">
            {/* key : le remontage relance l'animation à chaque changement de trou. */}
            <div key={trou.numero} className="animation-trou">
              {/* Un seul lecteur est monté : changer de trou arrête la vidéo précédente. */}
              <div className="relative aspect-video min-h-[200px] w-full bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${trou.videoYoutubeId}?autoplay=1&mute=1&loop=1&playlist=${trou.videoYoutubeId}&playsinline=1&rel=0`}
                  title={`Vidéo du trou n°${trou.numero}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>

              <div className="bg-sable-100 px-5 py-6 sm:px-8">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="font-butler text-[28px] font-medium text-club-950">
                    Trou n°{trou.numero}
                  </p>
                  <span className="rounded-full bg-club-950 px-4 py-1.5 text-[12px] font-semibold text-sable-50">
                    Par {trou.par} · HCP {trou.hcp}
                  </span>
                </div>

                <p className="mt-4 text-[16px] leading-relaxed text-encre/80">
                  {trou.description}
                </p>

                <ul className="mt-6 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                  {REPERES.map((repere) => (
                    <li
                      key={repere.cle}
                      className="flex flex-col items-center gap-2 rounded-lg bg-white px-3 py-3 sm:px-4"
                    >
                      <span
                        aria-hidden="true"
                        className={`block size-3.5 rounded-full ${
                          "bordure" in repere ? "ring-1 ring-inset ring-encre/15" : ""
                        }`}
                        style={{ backgroundColor: repere.couleur }}
                      />
                      <span className="text-[14px] font-semibold text-club-950">
                        <span className="sr-only">Départ {repere.nom} : </span>
                        {trou.distances[repere.cle]}&nbsp;m
                      </span>
                    </li>
                  ))}
                </ul>

                {trou.conseilDuPro ? (
                  <figure className="mt-6 rounded-lg border border-dashed border-or-500/60 px-5 py-4">
                    <figcaption className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-or-600">
                      <span aria-hidden="true">🏌️</span> Le conseil du pro
                    </figcaption>
                    <blockquote className="mt-2 text-[15px] leading-relaxed text-encre/80">
                      «&nbsp;{trou.conseilDuPro}&nbsp;»
                    </blockquote>
                  </figure>
                ) : null}

                <div className="mt-6 flex items-center justify-between text-[15px] font-medium text-club-950">
                  <button
                    type="button"
                    onClick={() => setNumero(precedent)}
                    className="underline-offset-4 hover:underline"
                  >
                    <span aria-hidden="true">←</span> Trou {precedent}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNumero(suivant)}
                    className="underline-offset-4 hover:underline"
                  >
                    Trou {suivant} <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center lg:mt-12">
          <Link
            href="/le-parcours/scorecard"
            className="inline-block rounded-lg bg-club-950 px-6 py-4 text-[15px] sm:text-[16px] font-semibold text-sable-50 transition-colors hover:bg-club-800"
          >
            Télécharger la carte de score (PDF)
          </Link>
        </div>
      </Container>
    </section>
  );
}
