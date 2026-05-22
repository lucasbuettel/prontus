import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // Provider returned an error before reaching us
  const providerError = searchParams.get("error");
  const providerErrorDescription = searchParams.get("error_description");
  if (providerError) {
    console.error("[auth/callback] provider error:", providerError, providerErrorDescription);
    const url = new URL(`${origin}/login`);
    url.searchParams.set("error", "oauth");
    url.searchParams.set("reason", providerErrorDescription ?? providerError);
    return NextResponse.redirect(url);
  }

  if (!code) {
    console.error("[auth/callback] missing code in callback URL");
    const url = new URL(`${origin}/login`);
    url.searchParams.set("error", "oauth");
    url.searchParams.set("reason", "missing_code");
    return NextResponse.redirect(url);
  }

  const supabase = await createClient();
  console.log("[auth/callback] received code, attempting exchange. URL:", request.url);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession failed:", error.message, "status:", error.status, "name:", error.name);
    const url = new URL(`${origin}/login`);
    url.searchParams.set("error", "oauth");
    url.searchParams.set("reason", error.message);
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
