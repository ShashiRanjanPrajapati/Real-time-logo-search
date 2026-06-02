import type { NextRequest } from "next/server";

const LOGO_DEV_SECRET_KEY = process.env.LOGO_DEV_SECRET_KEY!;
const LOGO_DEV_SEARCH_URL = process.env.LOGO_DEV_SEARCH_URL!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const strategy = searchParams.get("strategy") ?? "suggest";

  if (!query || query.trim().length === 0) {
    return Response.json(
      { error: "Query parameter 'q' is required." },
      { status: 400 },
    );
  }

  try {
    const url = new URL(LOGO_DEV_SEARCH_URL);
    url.searchParams.set("q", query.trim());
    url.searchParams.set("strategy", strategy);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${LOGO_DEV_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return Response.json(
        { error: `logo.dev API error: ${res.status}`, detail: errorText },
        { status: res.status },
      );
    }

    const data = await res.json();
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: "Failed to reach logo.dev API", detail: message },
      { status: 502 },
    );
  }
}
