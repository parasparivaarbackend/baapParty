'use client';

import { usePathname } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    // The shell is exactly one screen tall and never scrolls itself. The sidebar's link
    // list and the page content each get their own scrollbar, so a long page can no
    // longer drag the sidebar away and leave a light strip at the bottom of it.
    <div className="flex h-dvh flex-col overflow-hidden bg-paper md:flex-row">
      <AdminNav />
      <main className="admin-scroll min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</div>
      </main>
    </div>
  );
}
