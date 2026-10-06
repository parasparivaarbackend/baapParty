'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Newspaper,
  Images,
  Users,
  UserCircle2,
  MessageSquare,
  LifeBuoy,
  MapPin,
  ShieldCheck,
  HandCoins,
  ExternalLink,
  Flame,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/events', label: 'Events', icon: CalendarDays, content: true },
  { href: '/admin/blog', label: 'Blog / Press', icon: Newspaper, content: true },
  { href: '/admin/gallery', label: 'Gallery', icon: Images, content: true },
  { href: '/admin/volunteers', label: 'Volunteers', icon: Users },
  { href: '/admin/users', label: 'Registered Users', icon: UserCircle2 },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/grievances', label: 'Grievances', icon: LifeBuoy, officer: true },
  { href: '/admin/teams', label: 'District Teams', icon: MapPin },
  { href: '/admin/access', label: 'Team Access', icon: ShieldCheck },
  { href: '/admin/contributions', label: 'Contributions', icon: HandCoins },
];

const ROLE_LABELS = {
  super: 'Super Admin',
  youth_officer: 'Youth Wing Officer',
  women_officer: 'Women Wing Officer',
  content_manager: 'Content Manager',
};

// Which sidebar entries each role may see (super sees all). Matches middleware.js.
const visibleFor = (role) => (n) => (role === 'super' ? true : role === 'content_manager' ? !!n.content : !!n.officer);

// Fetches the logged-in admin once and shares it between the sidebar pieces.
let mePromise = null;
function useAdminMe() {
  const [me, setMe] = useState(null);
  useEffect(() => {
    let alive = true;
    if (!mePromise) {
      mePromise = fetch('/api/auth/me')
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
    }
    mePromise.then((d) => alive && d?.username && setMe(d));
    return () => {
      alive = false;
    };
  }, []);
  return me;
}

function isActive(pathname, href, exact) {
  if (exact) return pathname === href;
  return pathname === href || pathname?.startsWith(href + '/');
}

function Brand() {
  return (
    <div className="flex flex-shrink-0 items-center gap-2.5 px-6 py-6">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-marigold text-ink">
        <Flame size={20} strokeWidth={2.2} />
      </span>
      <div>
        <p className="font-display text-sm font-extrabold leading-tight">Bharatiya Avijit Aawaz Party</p>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ivory/50">Admin Panel</p>
      </div>
    </div>
  );
}

function NavLinks({ pathname, onNavigate }) {
  const me = useAdminMe();
  // Until we know the role, show nothing restricted; each role only sees its own sections.
  const items = me ? NAV.filter(visibleFor(me.role)) : [];
  return (
    <nav className="admin-scroll admin-scroll-dark min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(pathname, href, exact);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
              active ? 'bg-saffron text-white' : 'text-ivory/70 hover:bg-white/5 hover:text-ivory'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Footer() {
  const router = useRouter();
  const me = useAdminMe();
  const username = me?.username;

  const onLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="flex-shrink-0 border-t border-white/5 p-3">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-ivory/60 transition-colors hover:bg-white/5 hover:text-ivory"
      >
        <ExternalLink size={15} /> View Live Site
      </Link>
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-ivory/60 transition-colors hover:bg-white/5 hover:text-ivory"
      >
        <LogOut size={15} /> Log out
      </button>
      {username && (
        <p className="mt-3 px-3.5 text-[10px] leading-relaxed text-ivory/30">Signed in as {username}{me?.role ? ` · ${ROLE_LABELS[me.role] || me.role}` : ''}</p>
      )}
    </div>
  );
}

export default function AdminNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the drawer whenever the route changes, and lock body scroll while it's open.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-full w-64 flex-shrink-0 flex-col border-r border-white/5 bg-ink text-ivory md:flex">
        <Brand />
        <NavLinks pathname={pathname} />
        <Footer />
      </aside>

      {/* Mobile top bar with a Menu button */}
      <div className="z-40 flex flex-shrink-0 items-center justify-between border-b border-white/5 bg-ink px-4 py-3.5 text-ivory md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-marigold text-ink">
            <Flame size={16} strokeWidth={2.2} />
          </span>
          <p className="font-display text-sm font-extrabold leading-tight">Admin Panel</p>
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-ivory/80 transition-colors hover:bg-white/10 hover:text-ivory"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[80vw] flex-col bg-ink text-ivory shadow-2xl">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-ivory/80 transition-colors hover:bg-white/10 hover:text-ivory"
              >
                <X size={20} />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
            <Footer />
          </aside>
        </div>
      )}
    </>
  );
}
