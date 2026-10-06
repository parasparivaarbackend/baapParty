// // 'use client';

// // import { useEffect, useRef, useState } from 'react';
// // import Link from 'next/link';
// // import { AnimatePresence, motion } from 'framer-motion';
// // import { ChevronDown, Flame, Menu, X } from 'lucide-react';
// // import { nav } from '@/data/content';
// // import Image from 'next/image';

// // export default function Navbar() {
// //   const [openIdx, setOpenIdx] = useState(null);
// //   const [mobileOpen, setMobileOpen] = useState(false);
// //   const [mobileSubOpen, setMobileSubOpen] = useState(null);
// //   const [scrolled, setScrolled] = useState(false);
// //   const navRef = useRef(null);

// //   useEffect(() => {
// //     const onScroll = () => setScrolled(window.scrollY > 12);
// //     onScroll();
// //     window.addEventListener('scroll', onScroll);
// //     return () => window.removeEventListener('scroll', onScroll);
// //   }, []);

// //   useEffect(() => {
// //     const onClick = (e) => {
// //       if (navRef.current && !navRef.current.contains(e.target)) {
// //         setOpenIdx(null);
// //       }
// //     };
// //     document.addEventListener('click', onClick);
// //     return () => document.removeEventListener('click', onClick);
// //   }, []);

// //   return (
// //     <header
// //       ref={navRef}
// //       className={`sticky top-0 z-50 transition-all duration-300 ${
// //         scrolled
// //           ? "bg-ivory/95 backdrop-blur-md shadow-card"
// //           : "bg-ivory/90 backdrop-blur-sm"
// //       }`}
// //     >
// //       <div className="h-[3px] w-full bg-tricolor-thread" />
// //       <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
// //         {/* Logo */}
// //         <Link
// //           href="/"
// //           className="flex items-center gap-2.5 shrink-0"
// //           onClick={() => setOpenIdx(null)}
// //         >
// //           <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-marigold shadow-card">
// //             <Flame size={22} strokeWidth={2.2} />
// //           </span>

// //           <span className="leading-tight">
// //             <span className="block font-display text-lg font-extrabold tracking-tight text-ink">
// //               Bharatiya Avijit Aawaz Party
// //             </span>
// //             <span className="section-eyebrow block text-[10px] font-semibold uppercase text-saffron">
// //               Sankalp 2026
// //             </span>
// //           </span>
// //         </Link>

// //         {/* Desktop nav */}
// //         <ul className="hidden items-center gap-1 lg:flex">
// //           {nav.map((item, idx) => {
// //             const isOpen = openIdx === idx;
// //             return (
// //               <li key={item.label} className="relative">
// //                 <button
// //                   type="button"
// //                   onClick={(e) => {
// //                     if (item.children) {
// //                       e.preventDefault();
// //                       setOpenIdx(isOpen ? null : idx);
// //                     } else {
// //                       window.location.href = item.href;
// //                     }
// //                   }}
// //                   className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-bold uppercase tracking-wide transition-colors ${
// //                     isOpen ? "text-saffron" : "text-ink hover:text-saffron"
// //                   }`}
// //                 >
// //                   {item.label}
// //                   {item.children && (
// //                     <ChevronDown
// //                       size={15}
// //                       className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
// //                     />
// //                   )}
// //                 </button>
// //                 <span
// //                   className={`absolute -bottom-[1px] left-3.5 h-[2px] bg-saffron transition-all duration-200 ${
// //                     isOpen ? "right-3.5" : "right-[calc(100%-3.5px)]"
// //                   }`}
// //                 />

// //                 <AnimatePresence>
// //                   {item.children && isOpen && (
// //                     <motion.ul
// //                       initial={{ opacity: 0, y: -8 }}
// //                       animate={{ opacity: 1, y: 0 }}
// //                       exit={{ opacity: 0, y: -8 }}
// //                       transition={{ duration: 0.18, ease: "easeOut" }}
// //                       className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-ink/5 bg-white py-2 shadow-card"
// //                     >
// //                       {item.children.map((child) => (
// //                         <li key={child.label}>
// //                           <Link
// //                             href={child.href}
// //                             onClick={() => setOpenIdx(null)}
// //                             className="block px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-saffron"
// //                           >
// //                             {child.label}
// //                           </Link>
// //                         </li>
// //                       ))}
// //                     </motion.ul>
// //                   )}
// //                 </AnimatePresence>
// //               </li>
// //             );
// //           })}
// //         </ul>

// //         <div className="hidden shrink-0 lg:block">
// //           <Link
// //             href="/donate"
// //             className="rounded-full bg-saffron px-6 py-2.5 text-[13px] font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark hover:shadow-card-hover"
// //           >
// //             Donate Now
// //           </Link>
// //         </div>

// //         {/* Mobile toggle */}
// //         <button
// //           type="button"
// //           className="rounded-full bg-ink/5 p-2.5 text-ink lg:hidden"
// //           onClick={() => setMobileOpen((v) => !v)}
// //           aria-label="Toggle menu"
// //         >
// //           {mobileOpen ? <X size={22} /> : <Menu size={22} />}
// //         </button>
// //       </nav>

// //       {/* Mobile menu */}
// //       <AnimatePresence>
// //         {mobileOpen && (
// //           <motion.div
// //             initial={{ height: 0, opacity: 0 }}
// //             animate={{ height: "auto", opacity: 1 }}
// //             exit={{ height: 0, opacity: 0 }}
// //             transition={{ duration: 0.25 }}
// //             className="overflow-hidden border-t border-ink/10 bg-ivory lg:hidden"
// //           >
// //             <ul className="mx-auto max-w-7xl px-5 py-3">
// //               {nav.map((item, idx) => (
// //                 <li
// //                   key={item.label}
// //                   className="border-b border-ink/5 last:border-none"
// //                 >
// //                   <button
// //                     type="button"
// //                     className="flex w-full items-center justify-between py-3 text-left text-sm font-bold uppercase tracking-wide text-ink"
// //                     onClick={() => {
// //                       if (item.children) {
// //                         setMobileSubOpen(mobileSubOpen === idx ? null : idx);
// //                       } else {
// //                         window.location.href = item.href;
// //                       }
// //                     }}
// //                   >
// //                     {item.label}
// //                     {item.children && (
// //                       <ChevronDown
// //                         size={16}
// //                         className={`transition-transform ${mobileSubOpen === idx ? "rotate-180" : ""}`}
// //                       />
// //                     )}
// //                   </button>
// //                   <AnimatePresence>
// //                     {item.children && mobileSubOpen === idx && (
// //                       <motion.ul
// //                         initial={{ height: 0, opacity: 0 }}
// //                         animate={{ height: "auto", opacity: 1 }}
// //                         exit={{ height: 0, opacity: 0 }}
// //                         className="overflow-hidden pl-3 pb-2"
// //                       >
// //                         {item.children.map((child) => (
// //                           <li key={child.label}>
// //                             <Link
// //                               href={child.href}
// //                               onClick={() => setMobileOpen(false)}
// //                               className="block py-2 text-sm font-semibold text-ink-soft"
// //                             >
// //                               {child.label}
// //                             </Link>
// //                           </li>
// //                         ))}
// //                       </motion.ul>
// //                     )}
// //                   </AnimatePresence>
// //                 </li>
// //               ))}
// //               <li className="pt-3">
// //                 <Link
// //                   href="/donate"
// //                   onClick={() => setMobileOpen(false)}
// //                   className="block rounded-full bg-saffron px-6 py-3 text-center text-[13px] font-bold uppercase tracking-wide text-white"
// //                 >
// //                   Donate Now
// //                 </Link>
// //               </li>
// //             </ul>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </header>
// //   );
// // }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { AnimatePresence, motion } from "framer-motion";
// import { ChevronDown, Flame, LogOut, Menu, User, X } from "lucide-react";
// import { nav } from "@/data/content";
// import { PARTY } from "@/data/party";
// import Image from "next/image";

// export default function Navbar() {
//   const [openIdx, setOpenIdx] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileSubOpen, setMobileSubOpen] = useState(null);
//   const [scrolled, setScrolled] = useState(false);
//   const [accountOpen, setAccountOpen] = useState(false);
//   const [authUser, setAuthUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const navRef = useRef(null);
//   const router = useRouter();

//   useEffect(() => {
//     let alive = true;
//     fetch("/api/user-auth/me")
//       .then((r) => (r.ok ? r.json() : null))
//       .then((data) => {
//         if (alive && data?.authenticated) setAuthUser(data);
//       })
//       .catch(() => {})
//       .finally(() => alive && setAuthLoading(false));
//     return () => {
//       alive = false;
//     };
//   }, []);

//   const handleLogout = async () => {
//     await fetch("/api/user-auth/logout", { method: "POST" }).catch(() => {});
//     setAuthUser(null);
//     setAccountOpen(false);
//     setMobileOpen(false);
//     router.push("/");
//     router.refresh();
//   };

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 12);
//     onScroll();
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     const onClick = (e) => {
//       if (navRef.current && !navRef.current.contains(e.target)) {
//         setOpenIdx(null);
//         setAccountOpen(false);
//       }
//     };
//     document.addEventListener("click", onClick);
//     return () => document.removeEventListener("click", onClick);
//   }, []);

//   return (
//     // <header
//     //   ref={navRef}
//     //   className={`sticky top-0 z-50 transition-all duration-300 ${
//     //     scrolled
//     //       ? "bg-ivory/95 backdrop-blur-md shadow-card"
//     //       : "bg-ivory/90 backdrop-blur-sm"
//     //   }`}
//     // >

//     <header
//       ref={navRef}
//       className={`sticky top-0 z-50 transition-all duration-300 ${
//         scrolled
//           ? "bg-transparent backdrop-blur-md shadow-card"
//           : "bg-transparent backdrop-blur-sm"
//       }`}
//     >
//       <div className="h-[3px] w-full bg-tricolor-thread" />
//       <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-4">
//         {/* Logo */}
//         <Link href="/" className="flex items-center gap-3">
//           <Image
//             src="/logo.png"
//             alt={PARTY.fullName}
//             width={52}
//             height={52}
//             className="rounded-full"
//           />
//           <div className="leading-tight">
//             <p className="font-display text-lg font-bold text-maroon">
//               {PARTY.shortName}
//             </p>
//             {/* <p className="hidden font-body text-[11px] text-ink/70 sm:block"> */}
//             <p className="hidden font-body text-[11px] text-black sm:block">
//               {PARTY.fullName.toUpperCase()}
//             </p>
//           </div>
//         </Link>
//         {/* Desktop nav */}
//         <ul className="hidden items-center gap-1 lg:flex">
//           {nav.map((item, idx) => {
//             const isOpen = openIdx === idx;
//             return (
//               <li key={item.label} className="relative">
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     if (item.children) {
//                       e.preventDefault();
//                       setOpenIdx(isOpen ? null : idx);
//                     } else {
//                       window.location.href = item.href;
//                     }
//                   }}
//                   className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-bold uppercase tracking-wide transition-colors ${
//                     isOpen ? "text-saffron" : "text-ink hover:text-saffron"
//                   }`}
//                 >
//                   {item.label}
//                   {item.children && (
//                     <ChevronDown
//                       size={15}
//                       className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
//                     />
//                   )}
//                 </button>
//                 <span
//                   className={`absolute -bottom-[1px] left-3.5 h-[2px] bg-saffron transition-all duration-200 ${
//                     isOpen ? "right-3.5" : "right-[calc(100%-3.5px)]"
//                   }`}
//                 />

//                 <AnimatePresence>
//                   {item.children && isOpen && (
//                     <motion.ul
//                       initial={{ opacity: 0, y: -8 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -8 }}
//                       transition={{ duration: 0.18, ease: "easeOut" }}
//                       className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-ink/5 bg-white py-2 shadow-card"
//                     >
//                       {item.children.map((child) => (
//                         <li key={child.label}>
//                           <Link
//                             href={child.href}
//                             onClick={() => setOpenIdx(null)}
//                             className="block px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-saffron"
//                           >
//                             {child.label}
//                           </Link>
//                         </li>
//                       ))}
//                     </motion.ul>
//                   )}
//                 </AnimatePresence>
//               </li>
//             );
//           })}
//         </ul>

//         <Link
//           href="/donate"
//           className="hidden shrink-0 rounded-full bg-saffron px-6 py-2.5 text-[13px] font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark hover:shadow-card-hover lg:block"
//         >
//           Donate Now
//         </Link>

//         {/* Auth control — responsive across all breakpoints */}
//         <div className="relative shrink-0">
//           {authLoading ? (
//             <span className="block h-8 w-8 animate-pulse rounded-full bg-ink/10 sm:h-9 sm:w-24" />
//           ) : authUser ? (
//             <>
//               <button
//                 type="button"
//                 onClick={() => setAccountOpen((v) => !v)}
//                 className="flex items-center gap-1.5 rounded-full border-2 border-ink/20 px-2.5 py-1.5 text-xs font-bold text-ink transition hover:border-maroon hover:text-maroon sm:gap-2 sm:px-4 sm:text-sm"
//               >
//                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-maroon/10 text-maroon">
//                   <User size={14} />
//                 </span>
//                 <span className="hidden max-w-[90px] truncate sm:inline">{authUser.name}</span>
//                 <ChevronDown size={14} className={`hidden transition-transform sm:inline ${accountOpen ? "rotate-180" : ""}`} />
//               </button>
//               <AnimatePresence>
//                 {accountOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -8 }}
//                     transition={{ duration: 0.15 }}
//                     className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-ink/5 bg-white py-2 shadow-card"
//                   >
//                     <p className="truncate border-b border-ink/5 px-4 pb-2 text-xs font-semibold text-ink-soft">
//                       {authUser.email}
//                     </p>
//                     <button
//                       type="button"
//                       onClick={handleLogout}
//                       className="mt-1 flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-saffron"
//                     >
//                       <LogOut size={15} /> Log out
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </>
//           ) : (
//             <Link
//               href="/login"
//               className="block rounded-full border-2 border-ink/20 px-3 py-1.5 text-xs font-bold text-ink transition hover:border-maroon hover:text-maroon sm:px-4 sm:text-sm"
//             >
//               Login
//             </Link>
//           )}
//         </div>

//         {/* Mobile toggle */}
//         <button
//           type="button"
//           className="rounded-full bg-ink/5 p-2.5 text-ink lg:hidden"
//           onClick={() => setMobileOpen((v) => !v)}
//           aria-label="Toggle menu"
//         >
//           {mobileOpen ? <X size={22} /> : <Menu size={22} />}
//         </button>
//       </nav>

//       {/* Mobile menu */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.25 }}
//             className="overflow-hidden border-t border-ink/10 bg-ivory lg:hidden"
//           >
//             <ul className="mx-auto max-w-7xl px-5 py-3">
//               {nav.map((item, idx) => (
//                 <li
//                   key={item.label}
//                   className="border-b border-ink/5 last:border-none"
//                 >
//                   <button
//                     type="button"
//                     className="flex w-full items-center justify-between py-3 text-left text-sm font-bold uppercase tracking-wide text-ink"
//                     onClick={() => {
//                       if (item.children) {
//                         setMobileSubOpen(mobileSubOpen === idx ? null : idx);
//                       } else {
//                         window.location.href = item.href;
//                       }
//                     }}
//                   >
//                     {item.label}
//                     {item.children && (
//                       <ChevronDown
//                         size={16}
//                         className={`transition-transform ${mobileSubOpen === idx ? "rotate-180" : ""}`}
//                       />
//                     )}
//                   </button>
//                   <AnimatePresence>
//                     {item.children && mobileSubOpen === idx && (
//                       <motion.ul
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: "auto", opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         className="overflow-hidden pl-3 pb-2"
//                       >
//                         {item.children.map((child) => (
//                           <li key={child.label}>
//                             <Link
//                               href={child.href}
//                               onClick={() => setMobileOpen(false)}
//                               className="block py-2 text-sm font-semibold text-ink-soft"
//                             >
//                               {child.label}
//                             </Link>
//                           </li>
//                         ))}
//                       </motion.ul>
//                     )}
//                   </AnimatePresence>
//                 </li>
//               ))}
//               <li className="pt-3">
//                 <Link
//                   href="/donate"
//                   onClick={() => setMobileOpen(false)}
//                   className="block rounded-full bg-saffron px-6 py-3 text-center text-[13px] font-bold uppercase tracking-wide text-white"
//                 >
//                   Donate Now
//                 </Link>
//               </li>

//               <li className="pt-3">
//                 {authUser ? (
//                   <div className="rounded-xl border-2 border-ink/10 px-4 py-3">
//                     <p className="flex items-center gap-2 text-sm font-bold text-ink">
//                       <User size={15} className="text-maroon" /> {authUser.name}
//                     </p>
//                     <p className="mt-0.5 truncate text-xs text-ink-soft">{authUser.email}</p>
//                     <button
//                       type="button"
//                       onClick={handleLogout}
//                       className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink/15 py-2 text-xs font-bold uppercase tracking-wide text-ink transition hover:border-maroon hover:text-maroon"
//                     >
//                       <LogOut size={14} /> Log out
//                     </button>
//                   </div>
//                 ) : (
//                   <Link
//                     href="/login"
//                     onClick={() => setMobileOpen(false)}
//                     className="block rounded-full border-2 border-ink/20 px-4 py-2.5 text-center text-sm font-bold text-ink transition hover:border-maroon hover:text-maroon"
//                   >
//                     Login / Sign Up
//                   </Link>
//                 )}
//               </li>
//             </ul>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { nav } from "@/data/content";
import { PARTY } from "@/data/party";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [openIdx, setOpenIdx] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  // Shared session state (updates instantly after login/logout, no refresh needed)
  const { user: authUser, loading: authLoading, logout } = useAuth();

  const navRef = useRef(null);
  const router = useRouter();

  // =====================================================
  // LOGOUT
  // =====================================================
  const handleLogout = async () => {
    await logout();

    setAccountOpen(false);
    setMobileOpen(false);
    setMobileSubOpen(null);
    setOpenIdx(null);

    router.push("/");
    router.refresh();
  };

  // =====================================================
  // SCROLL DETECTION
  // =====================================================
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =====================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =====================================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenIdx(null);
        setAccountOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // =====================================================
  // RESET MOBILE MENU WHEN SCREEN BECOMES DESKTOP
  // =====================================================
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
        setMobileSubOpen(null);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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

  // =====================================================
  // MOBILE NAVIGATION
  // =====================================================
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
          // ? "bg-white/95 backdrop-blur-md shadow-card"
          // : "bg-white/90 backdrop-blur-sm"
        }
      `}
    >
      {/* =================================================
          TRICOLOR TOP LINE
      ================================================= */}
      <div className="h-[3px] w-full bg-tricolor-thread" />

      {/* =================================================
          MAIN NAVBAR
      ================================================= */}
      <nav className="mx-auto flex min-h-[70px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-5 lg:px-1 ">
        {/* =================================================
            LOGO
        ================================================= */}
        <Link
          href="/"
          onClick={() => {
            setMobileOpen(false);
            setMobileSubOpen(null);
            setOpenIdx(null);
          }}
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3"
        >
          <Image
            src="/logo.png"
            alt={PARTY.fullName}
            width={52}
            height={52}
            priority
            className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-12 sm:w-12"
          />

          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-base font-bold text-maroon sm:text-lg">
              {PARTY.shortName}
            </p>

            <p className="hidden max-w-[240px] truncate font-body text-[10px] font-medium  text-black sm:block sm:text-[11px]">
              {PARTY.fullName.toUpperCase()}
            </p>
          </div>
        </Link>

        {/* ================================================
            DESKTOP NAVIGATION
            ONLY LG AND ABOVE
        ================================================= */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item, idx) => {
            const isOpen = openIdx === idx;

            return (
              <li key={item.label} className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    if (item.children) {
                      setOpenIdx(isOpen ? null : idx);
                    } else {
                      setOpenIdx(null);
                      router.push(item.href);
                    }
                  }}
                  className={`flex items-center gap-1 rounded-full px-3  py-2 text-[13px] font-bold uppercase tracking-wide transition-colors xl:px-3.5
                    ${isOpen ? "text-saffron" : "text-ink hover:text-saffron"}`}
                >
                  {item.label}

                  {item.children && (
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200
                        ${isOpen ? "rotate-180" : ""}
                      `}
                    />
                  )}
                </button>

                {/* DESKTOP ACTIVE LINE */}
                <span
                  className={` absolute-bottom-[1px] left-3.5 h-[2px] bg-saffron transition-all duration-200
                    ${isOpen ? "right-3.5" : "right-[calc(100%-3.5px)]"}
                  `}
                />

                {/* DESKTOP DROPDOWN */}
                <AnimatePresence>
                  {item.children && isOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className=" absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-xl border  border-ink/5  bg-white py-2 shadow-card "
                    >
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            onClick={() => setOpenIdx(null)}
                            className=" block px-5  py-2.5 text-sm font-semibold  text-ink-soft  transition-colors  hover:bg-paper  hover:text-saffron  "
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {/* =================================================
            DESKTOP RIGHT SIDE
            DONATE + LOGIN/USER
            IMPORTANT:
            hidden on mobile/tablet
        ================================================= */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {/* DONATE */}
          <Link
            href="/donate"
            className="shrink-0 rounded-full bg-saffron px-5  py-2.5 text-[13px] font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark hover:shadow-card-hover"
          >
            Contribute
            {/* Donate Now */}
          </Link>

          {/* DESKTOP AUTH */}
          <div className="relative shrink-0">
            {authLoading ? (
              <span className=" block h-9 w-24 animate-pulse rounded-full bg-ink/10" />
            ) : authUser ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAccountOpen((prev) => !prev);
                  }}
                  className="flex items-center gap-2 rounded-full border-2 border-ink/20 px-3 py-1.5 text-sm font-bold text-ink transition hover:border-maroon hover:text-maroon"
                >
                  {/* User Icon */}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                    <User size={14} />
                  </span>

                  {/* First Letter */}
                  <span className="text-sm font-bold">
                    {authUser.name?.charAt(0).toUpperCase()}
                  </span>

                  {/* Dropdown Icon */}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* ACCOUNT DROPDOWN */}
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
                        My Dashboard
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-saffron"
                      >
                        <LogOut size={15} />
                        Log out
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
                Login
              </Link>
            )}
          </div>
        </div>

        {/* =================================================
            MOBILE HAMBURGER
            ONLY BELOW LG
        ================================================= */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-ink transition-all active:scale-95 hover:bg-black/[0.08] lg:hidden "
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* =================================================
          MOBILE MENU
          ONLY BELOW LG
      ================================================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="w-full overflow-hidden border-t  border-black/10  bg-white shadow-lg lg:hidden"
          >
            {/* SCROLLABLE MOBILE CONTENT */}
            <div className="max-h-[calc(100vh-73px)] w-full overflow-y-auto overscroll-contain ">
              <div className="mx-auto w-full max-w-xl px-4 sm:px-6 ">
                {/* =========================================
                    MOBILE NAV ITEMS
                ========================================= */}
                <ul className="w-full py-2">
                  {nav.map((item, idx) => {
                    const isSubOpen = mobileSubOpen === idx;

                    return (
                      <li
                        key={item.label}
                        className="w-full border-b  border-black/[0.06] "
                      >
                        {/* ITEM WITH SUBMENU */}
                        {item.children ? (
                          <button
                            type="button"
                            onClick={() => handleMobileItemClick(item, idx)}
                            aria-expanded={isSubOpen}
                            className="flex min-h-[52px] w-full items-center justify-between gap-4 px-1 py-3 text-left text-[13px] font-bold uppercase tracking-[0.04em] text-ink transition-colors active:text-saffron "
                          >
                            <span className="truncate">{item.label}</span>

                            <span className=" flex h-8 w-8 shrink-0 items-center justify-center rounded-full  bg-black/[0.04] ">
                              <ChevronDown
                                size={17}
                                className={`transition-transform duration-200
                                  ${
                                    isSubOpen
                                      ? "rotate-180 text-saffron"
                                      : "text-ink"
                                  }
                                `}
                              />
                            </span>
                          </button>
                        ) : (
                          /* NORMAL ITEM */
                          <Link
                            href={item.href}
                            onClick={() => {
                              setMobileOpen(false);
                              setMobileSubOpen(null);
                            }}
                            className="flex min-h-[52px] w-full items-center px-1 py-3 text-[13px] font-bold uppercase tracking-[0.04em]  text-ink transition-colors  active:text-saffron "
                          >
                            {item.label}
                          </Link>
                        )}

                        {/* =================================
                            MOBILE SUBMENU
                        ================================= */}
                        <AnimatePresence initial={false}>
                          {item.children && isSubOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mb-3 ml-1 overflow-hidden rounded-xl border border-black/[0.06] bg-[#fafafa] ">
                                {item.children.map((child, childIndex) => (
                                  <Link
                                    key={child.label}
                                    href={child.href}
                                    onClick={() => {
                                      setMobileOpen(false);
                                      setMobileSubOpen(null);
                                    }}
                                    className={`flex min-h-[46px] items-center px-4 py-2.5 text-sm font-semibold  text-ink-soft transition-colors  active:bg-saffron/10  active:text-saffron
                                          ${
                                            childIndex !==
                                            item.children.length - 1
                                              ? "border-b border-black/[0.05]"
                                              : ""
                                          }
                                        `}
                                  >
                                    {child.label}
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

                {/* =========================================
                    MOBILE ACTION AREA
                ========================================= */}
                <div className=" w-full space-y-3 border-t  border-black/[0.06] py-4 ">
                  {/* =======================================
                      DONATE BUTTON
                  ======================================= */}
                  <Link
                    href="/report-problem"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileSubOpen(null);
                    }}
                    className="flex min-h-[48px] w-full items-center justify-center rounded-full border-2 border-saffron px-5 py-3 text-center text-[13px] font-bold tracking-wide text-saffron transition active:scale-[0.98]"
                  >
                    अपनी समस्या दर्ज करें
                  </Link>

                  <Link
                    href="/donate"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileSubOpen(null);
                    }}
                    className=" flex min-h-[48px] w-full items-center justify-center rounded-full  bg-saffron px-5  py-3 text-center text-[13px] font-bold uppercase tracking-wide  text-white shadow-card transition active:scale-[0.98]  hover:bg-saffron-dark "
                  >
                    Contribute
                    {/* Donate Now */}
                  </Link>

                  {/* =======================================
                      AUTH LOADING
                  ======================================= */}
                  {authLoading ? (
                    <div className=" h-[52px] w-full animate-pulse rounded-xl  bg-black/[0.05] " />
                  ) : authUser ? (
                    /* =====================================
                       LOGGED-IN MOBILE USER
                    ===================================== */
                    <div className=" w-full rounded-2xl border  border-black/[0.08]  bg-white p-4 shadow-sm ">
                      {/* USER */}
                      <div className=" flex w-full items-center gap-3 ">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-maroon ">
                          <User size={19} />
                        </div>

                        <div className="min-w-0 flex-1 ">
                          <p className=" truncate text-sm font-bold  text-ink ">
                            {authUser.name}
                          </p>

                          <p className=" mt-0.5 truncate text-xs  text-ink-soft  ">
                            {authUser.email}
                          </p>
                        </div>
                      </div>

                      {/* DASHBOARD */}
                      <Link
                        href="/dashboard"
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileSubOpen(null);
                        }}
                        className="mt-4 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-banyan px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition active:scale-[0.98] hover:bg-banyan-dark"
                      >
                        <LayoutDashboard size={15} />
                        My Dashboard
                      </Link>

                      {/* LOGOUT */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className=" mt-2 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full border-2  border-ink/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wide  text-ink transition active:scale-[0.98] hover:border-maroon hover:text-maroon "
                      >
                        <LogOut size={15} />
                        Log out
                      </button>
                    </div>
                  ) : (
                    /* =====================================
                       LOGGED-OUT MOBILE USER
                    ===================================== */
                    <Link
                      href="/login"
                      onClick={() => {
                        setMobileOpen(false);
                        setMobileSubOpen(null);
                      }}
                      className=" flex min-h-[48px] w-full items-center justify-center rounded-full border-2  border-ink/15  px-5 py-3 text-center text-sm font-bold  text-ink  transition  active:scale-[0.98] hover:border-maroon  hover:text-maroon "
                    >
                      Login / Sign Up
                    </Link>
                  )}
                </div>

                {/* BOTTOM SPACE */}
                <div className="h-3" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
