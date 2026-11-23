"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Scrolls to the top on every page change, EXCEPT when the URL has a #section
// (e.g. /about#leaders). In that case it scrolls to that section instead.
// Previously this always jumped to the top, which overrode the #hash scroll.
function scrollToHash(hash, attempt = 0) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const el = id ? document.getElementById(id) : null;

  if (el) {
    el.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }
  // Section may not be rendered yet (client-loaded content) - retry briefly.
  if (attempt < 15) {
    setTimeout(() => scrollToHash(hash, attempt + 1), 100);
  }
}

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      scrollToHash(hash);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  // Clicking "Our Leaders" while already on /about only changes the hash.
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash) scrollToHash(window.location.hash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
