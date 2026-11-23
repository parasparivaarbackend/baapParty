'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogIn, UserPlus, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { encodePassword } from "@/lib/passwordCodec";
import { useLang } from '@/context/LanguageContext';

const emptyLogin = { email: '', password: '' };
const emptySignup = { firstName: '', lastName: '', email: '', phone: '', password: '' };

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { t } = useLang();
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [signupForm, setSignupForm] = useState(emptySignup);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // After login, members land on their dashboard unless they were sent here from another page.
  const redirectTo = searchParams?.get('from') || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch("/api/user-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...loginForm,
          password: encodePassword(loginForm.password)
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ? t(data.error) : t('Something went wrong. Please try again.'));
        return;
      }
      login(data.user); // updates the navbar instantly (no manual refresh needed)
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError(t('Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch("/api/user-auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...signupForm,
          password: encodePassword(signupForm.password),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If an account already exists, nudge them to the Login tab instead
        // of making them re-type everything.
        if (res.status === 409) {
          setError(data?.error ? t(data.error) : t('An account already exists — please log in.'));
          setTab('login');
          setLoginForm((f) => ({ ...f, email: signupForm.email }));
          return;
        }
        setError(data?.error ? t(data.error) : t('Something went wrong. Please try again.'));
        return;
      }
      login(data.user); // updates the navbar instantly (no manual refresh needed)
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError(t('Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-paper px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-ink/8 bg-white p-6 shadow-card sm:p-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-extrabold text-ink">{t("Welcome")}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {t("Log in to your account, or create a new one in a few seconds.")}
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-ivory p-1">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold uppercase tracking-wide transition-colors ${
              tab === 'login' ? 'bg-saffron text-white shadow-card' : 'text-ink-soft hover:text-ink'
            }`}
          >
            <LogIn size={15} /> {t("Login")}
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setError('');
            }}
            className={`flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold uppercase tracking-wide transition-colors ${
              tab === 'signup' ? 'bg-saffron text-white shadow-card' : 'text-ink-soft hover:text-ink'
            }`}
          >
            <UserPlus size={15} /> {t("Sign Up")}
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-saffron/10 px-4 py-2.5 text-sm font-semibold text-saffron-dark">
            {error}
          </p>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <LabeledInput
              icon={Mail}
              type="email"
              placeholder={t("you@example.com")}
              label={t("Email")}
              value={loginForm.email}
              onChange={(v) => setLoginForm((f) => ({ ...f, email: v }))}
              required
            />
            <LabeledInput
              icon={Lock}
              type="password"
              placeholder="••••••••"
              label={t("Password")}
              value={loginForm.password}
              onChange={(v) => setLoginForm((f) => ({ ...f, password: v }))}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-saffron py-3 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t('Logging in...') : t('Log In')}
            </button>
            <p className="text-center text-xs text-ink-soft">
              {t("New here?")}{' '}
              <button type="button" onClick={() => setTab('signup')} className="font-bold text-saffron hover:text-saffron-dark">
                {t("Create an account")}
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput
                icon={User}
                type="text"
                autoComplete="given-name"
                placeholder={t("First name")}
                label={t("First Name")}
                value={signupForm.firstName}
                onChange={(v) => setSignupForm((f) => ({ ...f, firstName: v }))}
                required
              />
              <LabeledInput
                icon={User}
                type="text"
                autoComplete="family-name"
                placeholder={t("Last name")}
                label={t("Last Name")}
                value={signupForm.lastName}
                onChange={(v) => setSignupForm((f) => ({ ...f, lastName: v }))}
                required
              />
            </div>
            <LabeledInput
              icon={Mail}
              type="email"
              placeholder={t("you@example.com")}
              label={t("Email")}
              value={signupForm.email}
              onChange={(v) => setSignupForm((f) => ({ ...f, email: v }))}
              required
            />
            <LabeledInput
              icon={Phone}
              type="tel"
              placeholder={t("10-digit mobile number")}
              label={t("Phone")}
              value={signupForm.phone}
              onChange={(v) => setSignupForm((f) => ({ ...f, phone: v }))}
            />
            <LabeledInput
              icon={Lock}
              type="password"
              placeholder={t("At least 6 characters")}
              label={t("Password")}
              value={signupForm.password}
              onChange={(v) => setSignupForm((f) => ({ ...f, password: v }))}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-saffron py-3 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t('Creating account...') : t('Create Account')}
            </button>
            <p className="text-center text-xs text-ink-soft">
              {t("Already have an account?")}{' '}
              <button type="button" onClick={() => setTab('login')} className="font-bold text-saffron hover:text-saffron-dark">
                {t("Log in")}
              </button>
            </p>
          </form>
        )}

        <p className="mt-6 text-center text-[11px] text-ink-soft/70">
          <Link href="/" className="hover:text-ink">
            {t("← Back to Home")}
          </Link>
        </p>
      </div>
    </section>
  );
}

function LabeledInput({ icon: Icon, label, value, onChange, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-soft">{label}</span>
      <span className="relative flex items-center">
        <Icon size={16} className="pointer-events-none absolute left-3.5 text-ink-soft/50" />
        <input
          {...props}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border-2 border-ink/10 bg-ivory py-2.5 pl-10 pr-3.5 text-sm text-ink outline-none transition-colors focus:border-saffron"
        />
      </span>
    </label>
  );
}
