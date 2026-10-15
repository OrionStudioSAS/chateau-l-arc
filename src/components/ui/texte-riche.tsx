import { Fragment } from "react";

import { cn } from "@/lib/cn";

/**
 * Rendu du texte enrichi saisi dans le back-office : **gras**, *italique*,
 * listes « - », titres « ### » et liens [texte](url). Construit des éléments
 * React (jamais de HTML injecté) et n'accepte que les liens sûrs.
 */
const lienSur = (url: string) => /^(\/(?!\/)|https?:\/\/|tel:|mailto:)/i.test(url);

function enLigne(texte: string): React.ReactNode[] {
  const morceaux: React.ReactNode[] = [];
  const motif = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let dernier = 0;
  let trouve: RegExpExecArray | null;

  while ((trouve = motif.exec(texte))) {
    if (trouve.index > dernier) morceaux.push(texte.slice(dernier, trouve.index));
    const cle = trouve.index;
    if (trouve[1]) morceaux.push(<strong key={cle}>{trouve[1]}</strong>);
    else if (trouve[2]) morceaux.push(<em key={cle}>{trouve[2]}</em>);
    else if (lienSur(trouve[4])) {
      const externe = /^https?:/i.test(trouve[4]);
      morceaux.push(
        <a
          key={cle}
          href={trouve[4]}
          {...(externe ? { target: "_blank", rel: "noopener" } : {})}
          className="underline underline-offset-4"
        >
          {trouve[3]}
        </a>,
      );
    } else morceaux.push(trouve[3]);
    dernier = motif.lastIndex;
  }
  if (dernier < texte.length) morceaux.push(texte.slice(dernier));
  return morceaux;
}

type Bloc = { type: "p" | "titre" | "liste"; lignes: string[] };

function blocs(source: string): Bloc[] {
  const resultat: Bloc[] = [];
  for (const ligne of source.replace(/\r/g, "").split("\n")) {
    const nue = ligne.trim();
    const dernier = resultat.at(-1);
    if (!nue) {
      resultat.push({ type: "p", lignes: [] });
    } else if (nue.startsWith("### ")) {
      resultat.push({ type: "titre", lignes: [nue.slice(4)] });
    } else if (/^[-•]\s/.test(nue)) {
      if (dernier?.type === "liste") dernier.lignes.push(nue.slice(2));
      else resultat.push({ type: "liste", lignes: [nue.slice(2)] });
    } else if (dernier?.type === "p") {
      dernier.lignes.push(nue);
    } else {
      resultat.push({ type: "p", lignes: [nue] });
    }
  }
  return resultat.filter((b) => b.lignes.length > 0);
}

export function TexteRiche({ source, className }: { source: string; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {blocs(source).map((bloc, i) =>
        bloc.type === "titre" ? (
          <h3 key={i} className="font-semibold">
            {enLigne(bloc.lignes[0])}
          </h3>
        ) : bloc.type === "liste" ? (
          <ul key={i} className="list-disc space-y-1 pl-5">
            {bloc.lignes.map((ligne, j) => (
              <li key={j}>{enLigne(ligne)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            {bloc.lignes.map((ligne, j) => (
              <Fragment key={j}>
                {j > 0 ? <br /> : null}
                {enLigne(ligne)}
              </Fragment>
            ))}
          </p>
        ),
      )}
    </div>
  );
}

/** Version sans mise en forme (balises meta, cartes). */
export function texteBrut(source: string): string {
  return source
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*?([^*]+)\*\*?/g, "$1")
    .replace(/^(### |[-•] )/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}
