"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import type { LayerSpecification, StyleSpecification } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import { site } from "@/config/site";
import { cn } from "@/lib/cn";

/** Style vectoriel OpenFreeMap (gratuit, sans clé, usage commercial autorisé). */
const STYLE = "https://tiles.openfreemap.org/styles/positron";

const { latitude, longitude } = site.contact.coordonnees;

const itineraire = `https://www.google.com/maps/dir/?${new URLSearchParams({
  api: "1",
  destination: "Château l'Arc Golf Club, 13710 Fuveau",
})}`;

/** Palette de la carte, accordée au vert du pied de page. */
const couleurs = {
  fond: "#183526",
  eau: "#122a20",
  vegetation: "#22492f",
  parc: "#24503a",
  golf: "#2f6447",
  habitat: "#1d3d2c",
  batiment: "#2a5640",
  route: "#d8cfb8",
  rail: "#3d6b52",
  texte: "#e8e1cf",
};

/** Libellés conservés : villes et villages, grands axes. Le reste est masqué. */
const libellesGardes = new Set(["label_village", "label_town", "label_city", "highway-name-major"]);

/** Recolore le style « positron » (clair) en version verte, sobre, aux couleurs du site. */
function recolorer(style: StyleSpecification): StyleSpecification {
  const calques: LayerSpecification[] = [];

  for (const calque of style.layers) {
    const id = calque.id;
    const sourceLayer = "source-layer" in calque ? calque["source-layer"] : undefined;

    if (calque.type === "background") {
      calques.push({ ...calque, paint: { "background-color": couleurs.fond } });
      continue;
    }

    // Masqués : frontières, aéroports, glaciers, écussons de routes…
    if (
      sourceLayer === "boundary" ||
      sourceLayer === "aeroway" ||
      id.startsWith("landcover_ice") ||
      id.startsWith("landcover_glacier") ||
      (calque.type === "symbol" && !libellesGardes.has(id))
    ) {
      continue;
    }

    if (calque.type === "fill") {
      const teinte =
        sourceLayer === "water"
          ? couleurs.eau
          : sourceLayer === "park"
            ? couleurs.parc
            : sourceLayer === "building"
              ? couleurs.batiment
              : id === "landcover_wood"
                ? couleurs.vegetation
                : couleurs.habitat;
      calques.push({
        ...calque,
        paint: { "fill-color": teinte, "fill-opacity": sourceLayer === "building" ? 0.6 : 0.9 },
      });

      // Parcours de golf en vert plus clair, juste au-dessus de la végétation.
      if (id === "landcover_wood") {
        calques.push({
          id: "golf",
          type: "fill",
          source: "openmaptiles",
          "source-layer": "landcover",
          filter: ["==", ["get", "subclass"], "golf_course"],
          paint: { "fill-color": couleurs.golf, "fill-opacity": 0.9 },
        });
      }
      continue;
    }

    if (calque.type === "line") {
      if (sourceLayer === "waterway") {
        calques.push({ ...calque, paint: { ...calque.paint, "line-color": couleurs.eau } });
      } else if (id.includes("casing")) {
        calques.push({ ...calque, paint: { ...calque.paint, "line-color": couleurs.fond } });
      } else if (id.startsWith("railway")) {
        calques.push({ ...calque, paint: { ...calque.paint, "line-color": couleurs.rail } });
      } else {
        const opacite = id.includes("motorway") ? 0.7 : id.includes("major") ? 0.55 : id.includes("path") ? 0.2 : 0.35;
        calques.push({
          ...calque,
          paint: { ...calque.paint, "line-color": couleurs.route, "line-opacity": opacite },
        });
      }
      continue;
    }

    if (calque.type === "symbol") {
      calques.push({
        ...calque,
        paint: {
          ...calque.paint,
          "text-color": couleurs.texte,
          "text-opacity": 0.75,
          "text-halo-color": couleurs.fond,
          "text-halo-width": 1.2,
        },
      });
      continue;
    }

    calques.push(calque);
  }

  return { ...style, layers: calques };
}

/**
 * Carte du domaine dans le pied de page : plan vectoriel recoloré aux teintes
 * du site, figé (pas de zoom ni de glisser, pour ne pas gêner le défilement),
 * avec un repère doré sur le club-house. Un clic ouvre l'itinéraire.
 *
 * La bibliothèque (MapLibre) n'est chargée qu'à l'approche du pied de page.
 */
export function CarteDomaine({ className }: { className?: string }) {
  const conteneur = useRef<HTMLDivElement>(null);
  const [prete, setPrete] = useState(false);

  useEffect(() => {
    const element = conteneur.current;
    if (!element) return;

    let carte: import("maplibre-gl").Map | null = null;
    let annule = false;

    const charger = async () => {
      const [maplibregl, reponse] = await Promise.all([
        import("maplibre-gl"),
        fetch(STYLE),
      ]);
      if (annule) return;

      // MapLibre 6 charge son « worker » (découpe des tuiles) depuis un fichier
      // séparé, copié dans public/ par scripts/copier-worker-carte.mjs.
      maplibregl.setWorkerUrl("/vendor/maplibre-gl-worker.mjs");

      const style = recolorer((await reponse.json()) as StyleSpecification);
      if (annule) return;

      const instance = new maplibregl.Map({
        container: element,
        style,
        center: [longitude, latitude],
        zoom: 13.4,
        interactive: false,
        attributionControl: false,
      });

      const repere = document.createElement("div");
      repere.innerHTML = `<svg width="28" height="36" viewBox="0 0 28 36" aria-hidden="true"><path d="M14 35s12-11.3 12-21A12 12 0 0 0 2 14c0 9.7 12 21 12 21Z" fill="#b8944f" stroke="#f9f6f0" stroke-width="2"/><circle cx="14" cy="14" r="4.5" fill="#f9f6f0"/></svg>`;
      new maplibregl.Marker({ element: repere, anchor: "bottom" })
        .setLngLat([longitude, latitude])
        .addTo(instance);

      instance.once("load", () => setPrete(true));
      carte = instance;
    };

    // Chargement différé : rien n'est téléchargé tant que le pied de page est loin.
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return;
        observateur.disconnect();
        charger().catch((erreur) => console.error("Carte indisponible", erreur));
      },
      { rootMargin: "400px" },
    );
    observateur.observe(element);

    return () => {
      annule = true;
      observateur.disconnect();
      carte?.remove();
    };
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm border border-sable-50/20 bg-[#183526]",
        className,
      )}
    >
      {/* Le fondu est porté par l'enveloppe : MapLibre ajoute ses propres
          classes au conteneur, que React écraserait en changeant les siennes. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-700 ${prete ? "opacity-100" : "opacity-0"}`}
      >
        <div ref={conteneur} className="h-full w-full" />
      </div>

      {/* Toute la carte mène à l'itinéraire ; le crédit reste à part, cliquable. */}
      <a
        href={itineraire}
        target="_blank"
        rel="noopener"
        className="group absolute inset-0 flex items-start p-3"
        aria-label={`Itinéraire vers ${site.contact.adresse}, ${site.contact.codePostalVille} (Google Maps)`}
      >
        <span className="rounded-sm bg-club-950/90 px-3 py-1.5 text-[12px] font-medium text-sable-50 shadow-sm transition-colors group-hover:bg-club-950">
          {site.contact.adresse}, {site.contact.codePostalVille} · Itinéraire{" "}
          <span aria-hidden="true">↗</span>
        </span>
      </a>

      <p className="absolute bottom-0 right-0 bg-club-950/70 px-1.5 py-0.5 text-[9px] text-sable-50/70">
        <a href="https://openfreemap.org" target="_blank" rel="noopener" className="hover:underline">
          OpenFreeMap
        </a>{" "}
        ©{" "}
        <a href="https://www.openmaptiles.org" target="_blank" rel="noopener" className="hover:underline">
          OpenMapTiles
        </a>{" "}
        ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener"
          className="hover:underline"
        >
          OpenStreetMap
        </a>
      </p>
    </div>
  );
}
