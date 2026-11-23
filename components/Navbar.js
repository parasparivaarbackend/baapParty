"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { nav } from "@/data/content";
import { PARTY } from "@/data/party";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import LanguageToggle from "./LanguageToggle";

// =====================================================
// NAV DATA
// "More" ka poora data ab @/data/content.js ke `nav` me hai.
// Desktop: nav ko jaisa hai waisa use karte hain (More = mega dropdown).
// Mobile: space ki dikkat nahi, isliye More ke andar ke items
//         (Events / Blog / Gallery) alag accordion ban jate hain.
// =====================================================
const mobileNav = nav.flatMap((item) => (item.isMore ? item.children : [item]));

export default function Navbar() {
  const [openIdx, setOpenIdx] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const { user: authUser, loading: authLoading, logout } = useAuth();
  const { t, isHindi } = useLang();
  const partyName = isHindi ? PARTY.hindiName : PARTY.fullName;

  const navRef = useRef(null);
  const router = useRouter();

  const closeAll = () => {
    setOpenIdx(null);
    setAccountOpen(false);
    setMobileOpen(false);
    setMobileSubOpen(null);
  };

  // =====================================================
  // LOGOUT
  // =====================================================
  const handleLogout = async () => {
    await logout();
    closeAll();
    router.push("/");
    router.refresh();
  };

  // =====================================================
  // SCROLL DETECTION
  // =====================================================
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // =====================================================
  // CLOSE DROPDOWNS: OUTSIDE CLICK + ESC KEY
  // =====================================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenIdx(null);
        setAccountOpen(false);
      }
    };
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setOpenIdx(null);
        setAccountOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // =====================================================
  // RESET MOBILE MENU ON DESKTOP RESIZE
  // =====================================================
  // Publish the header's height (it shrinks on scroll) so sticky page headers can sit right below it.
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty("--nav-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
        setMobileSubOpen(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // =====================================================
  // MOBILE MENU TOGGLE
  // =====================================================
  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
    setMobileSubOpen(null);
    setAccountOpen(false);
    setOpenIdx(null);
  };

  const handleMobileItemClick = (item, idx) => {
    if (item.children) {
      setMobileSubOpen((prev) => (prev === idx ? null : idx));
      return;
    }
    setMobileOpen(false);
    setMobileSubOpen(null);
    router.push(item.href);
  };

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300
        ${
          scrolled
            ? "bg-transparent backdrop-blur-md shadow-card"
            : "bg-transparent backdrop-blur-sm"
        }
      `}
    >
      {/* TRICOLOR TOP LINE */}
      <div className="h-[3px] w-full bg-tricolor-thread" />

      {/* =================================================
          MAIN NAVBAR
      ================================================= */}
      <nav
        className={`mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6
          ${scrolled ? "min-h-[72px]" : "min-h-[84px]"}`}
      >
        {/* =================================================
            LOGO + PARTY NAME (BIGGER, HIGHLIGHTED)
        ================================================= */}
        <Link
          href="/"
          onClick={closeAll}
          className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-4"
        >
          <Image
            src="/logo.png"
            alt={partyName}
            width={72}
            height={72}
            priority
            className={`shrink-0 rounded-full object-cover shadow-md ring-2 ring-saffron/40 transition-all duration-300
    ${scrolled ? "h-12 w-12 sm:h-14 sm:w-14" : "h-14 w-14 sm:h-16 sm:w-16"}`}
          />

          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-xl font-extrabold tracking-wide text-maroon sm:text-2xl">
              {PARTY.shortName}
            </p>

            {/* Full name: mobile par short, tablet+ par poora */}
            <p className="mt-0.5 hidden max-w-[260px] truncate font-body text-[11px] font-semibold tracking-wider text-ink sm:block xl:max-w-[320px] xl:text-xs">
              {partyName.toUpperCase()}
            </p>
          </div>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION (LG AND ABOVE)
        ================================================= */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item, idx) => {
            const isOpen = openIdx === idx;

            return (
              <li key={t(item.label)} className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAccountOpen(false);

                    if (item.children) {
                      setOpenIdx(isOpen ? null : idx);
                    } else {
                      setOpenIdx(null);
                      router.push(item.href);
                    }
                  }}
                  aria-haspopup={item.children ? "true" : undefined}
                  aria-expanded={item.children ? isOpen : undefined}
                  className={`flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-bold uppercase tracking-wide transition-colors xl:px-3.5
                    ${isOpen ? "text-saffron" : "text-ink hover:text-saffron"}`}
                >
                  {t(item.label)}

                  {item.children && (
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* ACTIVE UNDERLINE */}
                <span
                  className={`pointer-events-none absolute bottom-0 left-3.5 h-[2px] bg-saffron transition-all duration-200
                    ${isOpen ? "right-3.5" : "right-[calc(100%-3.5px)]"}
                  `}
                />

                {/* ---------- NORMAL DROPDOWN ---------- */}
                <AnimatePresence>
                  {item.children && isOpen && !item.isMore && (
                    <motion.ul
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-ink/5 bg-white py-2 shadow-card"
                    >
                      {item.children.map((child) => (
                        <li key={t(child.label)}>
                          <Link
                            href={child.href}
                            onClick={() => setOpenIdx(null)}
                            className="block px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-saffron"
                          >
                            {t(child.label)}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                {/* ---------- "MORE" MEGA DROPDOWN (Events / Blog / Gallery) ---------- */}
                <AnimatePresence>
                  {item.isMore && isOpen && (
                    <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2">
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="grid w-[600px] grid-cols-3 gap-2 overflow-hidden rounded-2xl border border-ink/5 bg-white p-4 shadow-card"
                      >
                        {item.children.map((group) => (
                          <div key={t(group.label)} className="min-w-0">
                            <Link
                              href={group.href}
                              onClick={() => setOpenIdx(null)}
                              className="mb-1 block rounded-lg border-b-2 border-saffron/30 px-3 pb-2 pt-1 text-xs font-extrabold uppercase tracking-wider text-maroon transition-colors hover:text-saffron"
                            >
                              {t(group.label)}
                            </Link>

                            <ul>
                              {group.children?.map((child) => (
                                <li key={t(child.label)}>
                                  <Link
                                    href={child.href}
                                    onClick={() => setOpenIdx(null)}
                                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-saffron"
                                  >
                                    {t(child.label)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {/* =================================================
            DESKTOP RIGHT SIDE: CONTRIBUTE + LOGIN/USER
        ================================================= */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <Link
            href="/donate"
            className="shrink-0 rounded-full bg-saffron px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark hover:shadow-card-hover"
          >
            {t("Contribute")}
          </Link>

          <div className="relative shrink-0">
            {authLoading ? (
              <span className="block h-9 w-24 animate-pulse rounded-full bg-ink/10" />
            ) : authUser ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenIdx(null);
                    setAccountOpen((prev) => !prev);
                  }}
                  className="flex items-center gap-2 rounded-full border-2 border-ink/20 px-3 py-1.5 text-sm font-bold text-ink transition hover:border-maroon hover:text-maroon"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                    <User size={14} />
                  </span>

                  <span className="text-sm font-bold">
                    {authUser.name?.charAt(0).toUpperCase()}
                  </span>

                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-ink/5 bg-white py-2 shadow-card"
                    >
                      <div className="border-b border-ink/5 px-4 pb-3">
                        <p className="truncate text-sm font-bold text-ink">
                          {authUser.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-ink-soft">
                          {authUser.email}
                        </p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setAccountOpen(false)}
                        className="mt-1 flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-saffron"
                      >
                        <LayoutDashboard size={15} />
                        {t("My Dashboard")}
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-saffron"
                      >
                        <LogOut size={15} />
                        {t("Log out")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href="/login"
                className="block rounded-full border-2 border-ink/20 px-4 py-1.5 text-sm font-bold text-ink transition hover:border-maroon hover:text-maroon"
              >
                {t("Login")}
              </Link>
            )}
          </div>

          <LanguageToggle />
          
        </div>

        {/* =================================================
            MOBILE HAMBURGER (BELOW LG)
        ================================================= */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LanguageToggle />
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label={
              mobileOpen
                ? t("Close navigation menu")
                : t("Open navigation menu")
            }
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-ink transition-all hover:bg-black/[0.08] active:scale-95"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* =================================================
          MOBILE MENU (BELOW LG) — poori list as accordion
      ================================================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="w-full overflow-hidden border-t border-black/10 bg-white shadow-lg lg:hidden"
          >
            <div className="max-h-[calc(100vh-92px)] w-full overflow-y-auto overscroll-contain">
              <div className="mx-auto w-full max-w-xl px-4 sm:px-6">
                {/* MOBILE NAV ITEMS */}
                <ul className="w-full py-2">
                  {mobileNav.map((item, idx) => {
                    const isSubOpen = mobileSubOpen === idx;

                    return (
                      <li
                        key={t(item.label)}
                        className="w-full border-b border-black/[0.06]"
                      >
                        {item.children ? (
                          <button
                            type="button"
                            onClick={() => handleMobileItemClick(item, idx)}
                            aria-expanded={isSubOpen}
                            className="flex min-h-[52px] w-full items-center justify-between gap-4 px-1 py-3 text-left text-[13px] font-bold uppercase tracking-[0.04em] text-ink transition-colors active:text-saffron"
                          >
                            <span className="truncate">{t(item.label)}</span>

                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.04]">
                              <ChevronDown
                                size={17}
                                className={`transition-transform duration-200 ${
                                  isSubOpen
                                    ? "rotate-180 text-saffron"
                                    : "text-ink"
                                }`}
                              />
                            </span>
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => {
                              setMobileOpen(false);
                              setMobileSubOpen(null);
                            }}
                            className="flex min-h-[52px] w-full items-center px-1 py-3 text-[13px] font-bold uppercase tracking-[0.04em] text-ink transition-colors active:text-saffron"
                          >
                            {t(item.label)}
                          </Link>
                        )}

                        {/* MOBILE SUBMENU */}
                        <AnimatePresence initial={false}>
                          {item.children && isSubOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mb-3 ml-1 overflow-hidden rounded-xl border border-black/[0.06] bg-[#fafafa]">
                                {item.children.map((child, childIndex) => (
                                  <Link
                                    key={t(child.label)}
                                    href={child.href}
                                    onClick={() => {
                                      setMobileOpen(false);
                                      setMobileSubOpen(null);
                                    }}
                                    className={`flex min-h-[46px] items-center px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors active:bg-saffron/10 active:text-saffron
                                      ${
                                        childIndex !== item.children.length - 1
                                          ? "border-b border-black/[0.05]"
                                          : ""
                                      }
                                    `}
                                  >
                                    {t(child.label)}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>

                {/* MOBILE ACTION AREA */}
                <div className="w-full space-y-3 border-t border-black/[0.06] py-4">
                  <Link
                    href="/report-problem"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileSubOpen(null);
                    }}
                    className="flex min-h-[48px] w-full items-center justify-center rounded-full border-2 border-saffron px-5 py-3 text-center text-[13px] font-bold tracking-wide text-saffron transition active:scale-[0.98]"
                  >
                    {t("Report Your Problem")}
                  </Link>

                  <Link
                    href="/donate"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileSubOpen(null);
                    }}
                    className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-saffron px-5 py-3 text-center text-[13px] font-bold uppercase tracking-wide text-white shadow-card transition hover:bg-saffron-dark active:scale-[0.98]"
                  >
                    {t("Contribute")}
                  </Link>

                  {authLoading ? (
                    <div className="h-[52px] w-full animate-pulse rounded-xl bg-black/[0.05]" />
                  ) : authUser ? (
                    <div className="w-full rounded-2xl border border-black/[0.08] bg-white p-4 shadow-sm">
                      <div className="flex w-full items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                          <User size={19} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-ink">
                            {authUser.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-ink-soft">
                            {authUser.email}
                          </p>
                        </div>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileSubOpen(null);
                        }}
                        className="mt-4 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-banyan px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-banyan-dark active:scale-[0.98]"
                      >
                        <LayoutDashboard size={15} />
                        {t("My Dashboard")}
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-2 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full border-2 border-ink/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-ink transition hover:border-maroon hover:text-maroon active:scale-[0.98]"
                      >
                        <LogOut size={15} />
                        {t("Log out")}
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => {
                        setMobileOpen(false);
                        setMobileSubOpen(null);
                      }}
                      className="flex min-h-[48px] w-full items-center justify-center rounded-full border-2 border-ink/15 px-5 py-3 text-center text-sm font-bold text-ink transition hover:border-maroon hover:text-maroon active:scale-[0.98]"
                    >
                      {t("Login / Sign Up")}
                    </Link>
                  )}
                </div>

                <div className="h-3" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}