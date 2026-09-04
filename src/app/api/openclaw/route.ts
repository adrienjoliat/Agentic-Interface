import { NextResponse } from "next/server";
import { emptySnapshot, getOpenClawSnapshot } from "@/lib/openclaw";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (host !== "localhost" && host !== "127.0.0.1" && host !== "[::1]") {
    return NextResponse.json({ error: "Local access only" }, { status: 403 });
  }

  try {
    return NextResponse.json(await getOpenClawSnapshot(), {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "OpenClaw is unavailable";
    return NextResponse.json(emptySnapshot(message), {
      status: 503,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
}
