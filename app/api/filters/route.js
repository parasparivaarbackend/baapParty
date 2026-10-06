import { NextResponse } from 'next/server';
import { getGlobalFilterOptions } from '@/lib/db/filters';

// Always reflects live DB content — never statically cached/prerendered.
export const dynamic = 'force-dynamic';

export async function GET() {
  const options = await getGlobalFilterOptions();
  return NextResponse.json(options);
}
