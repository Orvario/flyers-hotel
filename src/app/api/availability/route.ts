import { NextResponse, type NextRequest } from "next/server";
import { validateStay } from "@/lib/booking";
import { getAvailability } from "@/lib/godo-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const parsed = validateStay({
    checkin: sp.get("checkin"),
    checkout: sp.get("checkout"),
    adults: sp.get("adults"),
    children: sp.get("children"),
  });
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const data = await getAvailability(parsed.stay);
    return NextResponse.json(data, { headers: { "cache-control": "private, max-age=30" } });
  } catch (err) {
    console.error("availability error", err);
    return NextResponse.json(
      { error: "We couldn’t reach our booking system just now. Please try again in a moment." },
      { status: 502 },
    );
  }
}
