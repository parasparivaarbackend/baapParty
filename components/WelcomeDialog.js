'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, HandHeart, HeartHandshake, UserPlus, UsersRound, X } from 'lucide-react';
import { PARTY } from '@/data/party';
import { useLang } from '@/context/LanguageContext';

// Shown once per full page load, on the home page only, right after the splash loader finishes.
// Step 1: Join Us / Donate.   Step 2 (after Join Us): As a Volunteer / As a Member.
export default function WelcomeDialog() {
  const { t, isHindi } = useLang();
  const partyName = isHindi ? PARTY.hindiName : PARTY.fullName;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('main'); // main | join

  // Wait for PageLoader to finish (it fires "baap:loader-done").
  useEffect(() => {
    const show = () => {
      if (window.location.pathname === '/') setOpen(true);
    };
    if (window.__baapLoaderDone) show();
    window.addEventListener('baap:loader-done', show, { once: true });
    return () => window.removeEventListener('baap:loader-done', show);
  }, []);

  // Lock page scroll while open (scrollbar-gutter keeps the layout from shifting).
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const go = (href) => {
    close();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="welcome-overlay"
          className="fixed inset-y-0 left-0 z-[9000] flex w-screen items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("Welcome to {name}", { name: partyName })}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-ivory p-7 text-center shadow-card-hover sm:p-9"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute left-0 top-0 h-1.5 w-full bg-tricolor-thread" />

            <button
              type="button"
              onClick={close}
              aria-label={t("Close")}
              className="absolute right-4 top-5 rounded-full p-1.5 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X size={18} />
            </button>

            {step === "join" && (
              <button
                type="button"
                onClick={() => setStep("main")}
                aria-label={t("Back")}
                className="absolute left-4 top-5 rounded-full p-1.5 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <ArrowLeft size={18} />
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/email-logo.png"
              alt={t("{name} logo", { name: partyName })}
              width={88}
              height={88}
              className="mx-auto mt-2 h-22 w-22 rounded-full bg-white object-contain p-1 shadow-card"
              style={{ height: 88, width: 88 }}
            />
            <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight text-ink">
              {PARTY.hindiName}
            </h2>
            <p className="mt-0.5 font-display text-sm font-bold uppercase tracking-wide text-saffron">
              {PARTY.fullName}
            </p>

            <div
              className="mx-auto mt-4 flex h-1 w-20 overflow-hidden rounded-full"
              aria-hidden="true"
            >
              <span className="flex-1 bg-saffron" />
              <span className="flex-1 bg-white" />
              <span className="flex-1 bg-banyan-light" />
            </div>

            {step === "main" ? (
              <>
                <p className="mt-4 text-sm text-ink-soft">
                  {t("Aap hamare saath kaise judna chahte hain?")}
                </p>
                <div className="mt-5 grid gap-3">
                  <OptionButton
                    icon={UserPlus}
                    title="Join Us"
                    text="Become a part of the B.A.A.P. family"
                    tone="saffron"
                    onClick={() => setStep("join")}
                  />
                  <OptionLink
                    icon={HeartHandshake}
                    title="Donate / Contribute"
                    text="Support the movement with your contribution"
                    tone="banyan"
                    href="/donate"
                    onNavigate={close}
                  />
                </div>
              </>
            ) : (
              <>
                <p className="mt-4 text-sm text-ink-soft">
                  {t("Aap kis roop mein judna chahte hain?")}
                </p>
                <div className="mt-5 grid gap-3">
                  <OptionButton
                    icon={HandHeart}
                    title="As a Volunteer"
                    text="Help on the ground in your constituency"
                    tone="saffron"
                    onClick={() => go("/volunteer")}
                  />
                  {/* <OptionButton
                    icon={UsersRound}
                    title="As a Member"
                    text="Official party membership"
                    tone="banyan"
                    badge="Coming Soon"
                    onClick={() => go("/member")}
                  /> */}

                  <OptionLink
                    icon={UsersRound}
                    title="As a Member"
                    text="Official party membership"
                    tone="banyan"
                    badge="Join Now"
                    href="https://forms.gle/5VxnYrCDLmYTL1859"
                    onNavigate={close}
                  />
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const TONES = {
  saffron: 'bg-saffron text-white hover:bg-saffron-dark',
  banyan: 'bg-banyan text-white hover:bg-banyan-dark',
};

function Inner({ icon: Icon, title, text, badge }) {
  const { t } = useLang();
  return (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
        <Icon size={22} />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="flex items-center gap-2 font-display text-base font-extrabold leading-tight">
          {t(title)}
          {badge && (
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
              {t(badge)}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-xs font-medium text-white/85">{t(text)}</span>
      </span>
    </>
  );
}

function OptionButton({ tone, onClick, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 shadow-card transition-all hover:-translate-y-0.5 ${TONES[tone]}`}
    >
      <Inner {...rest} />
    </button>
  );
}

function OptionLink({ tone, href, onNavigate, ...rest }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 shadow-card transition-all hover:-translate-y-0.5 ${TONES[tone]}`}
    >
      <Inner {...rest} />
    </Link>
  );
}
