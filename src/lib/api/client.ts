/**
 * Client HTTP unique vers l'API de contenu.
 * Tant que `API_BASE_URL` n'est pas défini, les fonctions de src/lib/api/content.ts
 * retombent sur les jeux de données de src/lib/api/mock/ (voir `apiIsConfigured`).
 */
const API_BASE_URL = process.env.API_BASE_URL;
const API_TOKEN = process.env.API_TOKEN;

export const apiIsConfigured = Boolean(API_BASE_URL);

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly path: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError("API_BASE_URL n'est pas configuré", 500, path);
  }

  const { timeoutMs = 8000, headers, ...rest } = init ?? {};
  const url = new URL(path.replace(/^\//, ""), `${API_BASE_URL.replace(/\/$/, "")}/`);

  const response = await fetch(url, {
    ...rest,
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      Accept: "application/json",
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      `Réponse ${response.status} de l'API`,
      response.status,
      url.pathname,
    );
  }

  return (await response.json()) as T;
}
