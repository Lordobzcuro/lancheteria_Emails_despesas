import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

function isPublic(p) {
  return (
    p === "/login" ||
    p.startsWith("/api/login") ||
    p === "/api/logout" ||
    p === "/sw.js" ||
    p === "/manifest.webmanifest" ||
    p.startsWith("/icon-") ||
    p === "/favicon.ico"
  );
}

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const tok = req.cookies.get("lanch_auth")?.value;
  if (tok && tok === process.env.DASHBOARD_PASSWORD) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}
