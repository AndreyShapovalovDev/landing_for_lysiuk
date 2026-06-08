import { NextResponse } from "next/server";

// Проксируем иконку Пуджа с Steam CDN — обходим CORS для canvas
export async function GET() {
  try {
    const res = await fetch(
      "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png",
      { next: { revalidate: 86400 } } // кэш на сутки
    );

    if (!res.ok) throw new Error("Steam CDN unavailable");

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
