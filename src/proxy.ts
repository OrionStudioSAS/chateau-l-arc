import type { NextRequest } from "next/server";

import { actualiserSession } from "@/lib/supabase/proxy";

/**
 * Next 16 : l'ancien « middleware » s'appelle désormais proxy.
 * Limité au back-office — le site public n'a pas de session à rafraîchir.
 */
export async function proxy(request: NextRequest) {
  return actualiserSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
