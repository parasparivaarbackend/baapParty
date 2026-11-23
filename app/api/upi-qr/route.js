import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const data = searchParams.get("data");

    if (!rateLimit(`qr:${clientIp(request)}`, 30, 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Only UPI payment links - this must not become a free QR generator for any text.
    if (!data || data.length > 500 || !data.startsWith("upi://pay?")) {
      return NextResponse.json(
        { error: "A valid UPI payment link is required" },
        { status: 400 },
      );
    }

    const qrBuffer = await QRCode.toBuffer(data, {
      type: "png",
      width: 500,
      margin: 2,
      errorCorrectionLevel: "M",
    });

    return new NextResponse(qrBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("QR generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 },
    );
  }
}
