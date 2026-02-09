import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First, run Supabase session refresh + route protection
  const supabaseResponse = await updateSession(request);

  // If Supabase middleware returned a redirect, use it
  if (supabaseResponse.headers.get("location")) {
    return supabaseResponse;
  }

  // Run next-intl middleware for locale handling
  const intlResponse = intlMiddleware(request);

  // Copy Supabase cookies to the intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - /assets (public files)
    // - files with extensions (.ico, .svg, etc.)
    "/((?!api|_next|_vercel|assets|.*\\..*).*)",
  ],
};
