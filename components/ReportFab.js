'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquareWarning } from 'lucide-react';

// Floating "Report Your Problem" button, shown on every public page.
export default function ReportFab() {
  const pathname = usePathname() || '';
  if (pathname.startsWith('/report-problem') || pathname.startsWith('/track')) return null;
  const wing = pathname.startsWith('/women') ? 'women' : pathname.startsWith('/youth') ? 'youth' : '';
  return (
    <Link
      href={`/report-problem${wing ? `?wing=${wing}` : ''}`}
      className="fixed bottom-5 left-4 z-40 flex items-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-bold text-white shadow-card-hover transition-all hover:-translate-y-0.5 hover:bg-saffron-dark sm:left-6"
    >
      <MessageSquareWarning size={18} />
      <span>अपनी समस्या दर्ज करें</span>
    </Link>
  );
}
