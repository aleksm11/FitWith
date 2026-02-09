import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect");

  if (code) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);

    if (user) {
      // Check role to redirect appropriately
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (redirect) {
        return NextResponse.redirect(`${origin}${redirect}`);
      }

      if (profile?.role === "admin") {
        return NextResponse.redirect(`${origin}/sr/admin`);
      }

      return NextResponse.redirect(`${origin}/sr/portal`);
    }
  }

  return NextResponse.redirect(`${origin}/sr/portal`);
}
