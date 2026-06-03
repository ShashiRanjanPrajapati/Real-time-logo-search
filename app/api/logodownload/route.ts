import type { NextRequest } from "next/server";

const LOGO_DEV_SECRET_KEY = process.env.LOGO_DEV_SECRET_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  const name = searchParams.get("name") ?? "logo";

  if (!domain || domain.trim().length === 0) {
    return Response.json(
      { error: "Domain parameter 'domain' is required." },
      { status: 400 },
    );
  }

  try {
    // Request a high-quality 512px logo for downloading
    const logoUrl = `https://img.logo.dev/${domain}?token=${LOGO_DEV_SECRET_KEY}&size=512&format=png`;
    const res = await fetch(logoUrl, {
      next: { revalidate: 86400 }, // Cache on Next.js server for 24 hours
    });

    if (!res.ok) {
      return Response.json(
        { error: `Failed to fetch logo from CDN: ${res.status}` },
        { status: res.status },
      );
    }

    const contentType = res.headers.get("content-type") ?? "image/png";
    const blob = await res.blob();

    // Clean brand name for a safe filename (e.g., "stripe-logo.png")
    const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const filename = `${safeName}-logo.png`;

    return new Response(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: "Failed to download logo", detail: message },
      { status: 500 },
    );
  }
}
