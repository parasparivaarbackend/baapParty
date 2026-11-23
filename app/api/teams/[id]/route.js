import { NextResponse } from "next/server";
import { requireAdmin, SUPER_ONLY } from "@/lib/adminSession";
import { updateTeamMember, deleteTeamMember } from "@/lib/db/teams";
import { parseTeamInput } from "@/lib/teamInput";

export async function PATCH(req, { params }) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;

  const { id } = await params;

  const { data, error } = parseTeamInput(await req.json().catch(() => ({})), {
    partial: true,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const item = await updateTeamMember(id, data);

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function DELETE(req, { params }) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;

  const { id } = await params;

  if (!(await deleteTeamMember(id))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
