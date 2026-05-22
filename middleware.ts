import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = ["/login", "/register-request"];
const STATUS_PATHS = ["/pending-approval", "/rejected"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip /auth/* entirely so OAuth callback can read PKCE cookies untouched.
  if (pathname.startsWith("/auth/")) {
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isStatusGate = STATUS_PATHS.some((p) => pathname.startsWith(p));

  // Not logged in → only public auth routes allowed
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Logged in but on a public-only route → let root decide where to go
  if (user && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Status gate paths and private paths require status checks done in their layouts.
  void isStatusGate;
  return response;
}

export const config = {
  matcher: [
    // Skip Next internals, static assets and well-known probes (e.g. DevTools).
    "/((?!_next/static|_next/image|favicon.ico|\\.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
