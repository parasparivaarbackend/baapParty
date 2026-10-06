import Link from 'next/link';
import {Flame, Mail, MapPin, Phone,} from 'lucide-react';
import { nav } from '@/data/content';
import { socialLinks } from "@/data/content";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-16 text-ivory/80">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-saffron/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-banyan/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="mb-4 flex items-center gap-2.5">
            {/* <span className="flex h-11 w-11 items-center justify-center rounded-full bg-marigold text-ink">
              <Flame size={22} strokeWidth={2.2} />
            </span> */}

            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white shadow-card">
              <Image
                src="/logo.png"
                alt="Bharatiya Avijit Aawaz Party Logo"
                fill
                priority
                sizes="48px"
                className="object-cover"
              />
            </div>

            <span className="font-display text-l font-extrabold text-ivory">
              Bharatiya Avijit Aawaz Party
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-ivory/60">
            A grassroots movement for employment, farmer dignity and public
            education — built booth by booth, village by village.
          </p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map(({ icon: Icon, name, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition-colors hover:border-marigold hover:text-marigold"
              >          
                {/* <img
                  width="17"
                  height="17"
                  src= {Icon}
                  // src="https://img.icons8.com/ios/50/twitterx--v2.png"
                  alt="twitterx--v2"
                /> */}

                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="section-eyebrow mb-4 text-xs font-bold uppercase text-marigold">
            Navigate
          </h4>
          <ul className="space-y-2.5 text-sm">
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href === "#" ? "/volunteer" : item.href}
                  className="text-ivory/60 transition-colors hover:text-ivory"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="section-eyebrow mb-4 text-xs font-bold uppercase text-marigold">
            Get Involved
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/report-problem"
                className="text-ivory/60 transition-colors hover:text-ivory"
              >
                Report Your Problem
              </Link>
            </li>
            <li>
              <Link
                href="/resolution-tracker"
                className="text-ivory/60 transition-colors hover:text-ivory"
              >
                Resolution Tracker
              </Link>
            </li>
            <li>
              <Link
                href="/volunteer"
                className="text-ivory/60 transition-colors hover:text-ivory"
              >
                Become a Volunteer
              </Link>
            </li>
            <li>
              <Link
                href="/donate"
                className="text-ivory/60 transition-colors hover:text-ivory"
              >
                Contribute to the Campaign
              </Link>
            </li>
            <li>
              <Link
                href="/manifesto"
                className="text-ivory/60 transition-colors hover:text-ivory"
              >
                Read the Manifesto
              </Link>
            </li>
            <li>
              <Link
                href="/events#rally-schedule"
                className="text-ivory/60 transition-colors hover:text-ivory"
              >
                Attend a Rally
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="section-eyebrow mb-4 text-xs font-bold uppercase text-marigold">
            Contact HQ
          </h4>
          <ul className="space-y-3 text-sm text-ivory/60">
            <li className="flex gap-2.5">
              <MapPin size={17} className="mt-0.5 shrink-0 text-saffron" />
              BK-1/54 Ground Floor Shalimar Bagh New Delhi 110088
            </li>
            <li className="flex gap-2.5">
              <Phone size={17} className="mt-0.5 shrink-0 text-saffron" /> +91
              11 2xxx 6xxx
            </li>
            <li className="flex gap-2.5">
              <Mail size={17} className="mt-0.5 shrink-0 text-saffron" />{" "}
              contact@bharatiyaavijitaawazparty.in
            </li>
          </ul>
        </div>
      </div>

      <div className="h-[4px] w-full bg-tricolor-thread" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-ivory/45 sm:flex-row lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} Bharatiya Avijit Aawaz Party. All
          Rights Reserved.
        </p>
        <p>Published on Behalf of Bharatiya Avijit Aawaz Party, New Delhi.</p>
      </div>
    </footer>
  );
}
