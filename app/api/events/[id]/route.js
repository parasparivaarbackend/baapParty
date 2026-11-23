import { NextResponse } from "next/server";
import { requireAdmin, CONTENT_ROLES } from "@/lib/adminSession";
import { getEvent, updateEvent, deleteEvent } from "@/lib/db/events";

export async function GET(req, { params }) {
  const { id } = await params;

  const item = await getEvent(id);

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PUT(req, { params }) {
  const auth = await requireAdmin(req, CONTENT_ROLES);
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await req.json();

  const item = await updateEvent(id, body);

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function DELETE(req, { params }) {
  const auth = await requireAdmin(req, CONTENT_ROLES);
  if (auth.error) return auth.error;

  const { id } = await params;

  const ok = await deleteEvent(id);

  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
