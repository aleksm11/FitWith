import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Extract locale from path
  const localeMatch = pathname.match(/^\/(sr|en|ru)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : "sr";

  // Check if accessing protected routes
  const isPortalRoute = pathname.match(/^\/(sr|en|ru)\/portal/);
  const isAdminRoute = pathname.match(/^\/(sr|en|ru)\/admin/);

  if (isPortalRoute || isAdminRoute) {
    // Not authenticated — redirect to login
    if (!user) {
      const loginUrl = new URL(`/${locale}/prijava`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // For admin routes, check role
    if (isAdminRoute) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!profile || profile.role !== "admin") {
          // Not admin — redirect to portal
          return NextResponse.redirect(
            new URL(`/${locale}/portal`, request.url)
          );
        }
      } catch {
        // If profiles table doesn't exist yet, redirect to portal
        return NextResponse.redirect(
          new URL(`/${locale}/portal`, request.url)
        );
      }
    }
  }

  // If authenticated user visits auth pages, redirect to portal
  const isAuthRoute = pathname.match(
    /^\/(sr|en|ru)\/(prijava|login|vhod|registracija|register|registraciya|zaboravljena-lozinka|forgot-password|zabyli-parol)/
  );
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL(`/${locale}/portal`, request.url));
  }

  return supabaseResponse;
}
