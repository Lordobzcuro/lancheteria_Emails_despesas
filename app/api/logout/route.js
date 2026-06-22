import { NextResponse } from "next/server";

export async function GET(req) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  const res = NextResponse.redirect(url);
  res.cookies.set("lanch_auth", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
