import { NextResponse } from "next/server";

export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch (e) {}
  const { senha, manter } = body;

  if (senha && senha === process.env.DASHBOARD_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("lanch_auth", process.env.DASHBOARD_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: manter ? 60 * 60 * 24 * 60 : undefined, // 60 dias se "manter conectado"
    });
    return res;
  }
  return NextResponse.json({ ok: false, erro: "Senha incorreta" }, { status: 401 });
}
