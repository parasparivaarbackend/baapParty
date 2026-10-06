import { NextResponse } from 'next/server';
import { getAdmin, allowedWings } from '@/lib/adminSession';
import { buildMonthlyReport } from '@/lib/db/report';

export const dynamic = 'force-dynamic';

// GET /api/grievances/report?month=2026-09&wing=youth  → .xlsx download.
// Officers can only export the wings their role covers.
export async function GET(req) {
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month') || '';
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return NextResponse.json({ error: 'Choose a month (YYYY-MM)' }, { status: 400 });
  }
  const allowed = allowedWings(admin.role);
  const wing = searchParams.get('wing');
  const wings = wing ? allowed.filter((w) => w === wing) : allowed;
  if (!wings.length) return NextResponse.json({ error: 'Not allowed for this wing' }, { status: 403 });

  const buf = await buildMonthlyReport({ month, wings });
  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="grievance-report-${month}${wing ? `-${wing}` : ''}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  });
}
