"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export default function PageHeader({ eyebrow, title, crumb }) {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-ink via-ink/95 to-banyan py-4">
      <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-saffron/10 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-banyan/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 text-left lg:px-8">
        <span className="section-eyebrow text-xs font-bold uppercase text-marigold">
          {t(eyebrow)}
        </span>

        <h1 className="mt-3 py-2 line-clamp-2 font-body text-4xl font-extrabold sm:text-4xl">
          <span className="title-shine py-1.5">{t(title).toUpperCase()}</span>
        </h1>

        <div className="mt-4 flex items-center justify-start gap-1.5 text-sm text-ivory/60">
          <Link href="/" className="hover:text-ivory">
            {t("Home")}
          </Link>

          <ChevronRight size={14} />

          <span className="text-marigold">{t(crumb)}</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-tricolor-thread" />
    </section>
  );
}
