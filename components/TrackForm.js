'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Loader2, Lock, Search } from 'lucide-react';
import { STATUS_FLOW } from '@/lib/grievanceConfig';
import { useLang } from '@/context/LanguageContext';

const fmt = (d, locale = 'en-IN') =>
  new Date(d).toLocaleString(locale, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const input = 'w-full rounded-xl border-2 border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-saffron';

export default function TrackForm({ otpEnabled = false }) {
  const { t, locale } = useLang();
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [dev, setDev] = useState('');

  const sendCode = async () => {
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, purpose: 'track' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send the code');
      setSent(true); setDev(data.devCode || '');
    } catch (err) { setError(t(err.message)); } finally { setLoading(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (otpEnabled && !sent) return sendCode();
    setError(''); setResult(null); setLoading(true);
    try {
      let body = { ticketId, email };
      if (otpEnabled) {
        const v = await fetch('/api/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, purpose: 'track', code }) });
        const vd = await v.json();
        if (!v.ok) throw new Error(vd.error || 'Could not verify the code');
        body = { ticketId, otpToken: vd.otpToken };
      }
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
    } catch (err) {
      setError(t(err.message));
    } finally {
      setLoading(false);
    }
  };

  const pending = result?.status === 'Pending';
  const reached = result ? STATUS_FLOW.indexOf(pending ? 'Follow-up' : result.status) : -1;

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="space-y-5 rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <div>
          <label className="mb-2 block text-sm font-bold text-ink">{t('Ticket number')}</label>
          <input value={ticketId} onChange={(e) => setTicketId(e.target.value)} placeholder={t("e.g. YW-UP-LKO-000124")} className={`${input} font-mono uppercase`} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-ink">{t('Email address used to file the problem')}</label>
          <input type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setSent(false); setCode(''); }} placeholder="you@example.com" className={input} />
        </div>
        {otpEnabled && sent && (
          <div>
            <label className="mb-2 block text-sm font-bold text-ink">{t('6-digit code we emailed you')}</label>
            <input inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="123456" className={input} />
            <p className="mt-1 text-xs text-ink-soft/70">{t('If this email has a ticket, the code is on its way. Check spam too.')}</p>
            {dev && <p className="mt-1 text-xs text-ink-soft/70">{t('Test mode — your code is')} {dev}</p>}
          </div>
        )}
        {error && <p className="rounded-xl bg-saffron/10 px-4 py-3 text-sm font-semibold text-saffron-dark">{t(error)}</p>}
        <button type="submit" disabled={loading || !ticketId.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()) || (otpEnabled && sent && code.length !== 6)} className="inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-saffron-dark disabled:opacity-60">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} {otpEnabled && !sent ? t('Send OTP') : t('Check status')}
        </button>
      </form>

      {result && (
        <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-lg font-bold tracking-wider text-ink">{result.ticketId}</p>
            <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${result.status === 'Resolved' ? 'bg-banyan/10 text-banyan' : pending ? 'bg-marigold/20 text-ink-soft' : 'bg-saffron/10 text-saffron-dark'}`}>
              {t(result.status)}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
            {result.isSensitive && <Lock size={14} />}
            {t(result.category)}{result.district ? ` · ${result.district}, ${t(result.state)}` : ''} · {t('Filed')} {fmt(result.submittedAt, locale)}
          </p>

          <ol className="mt-7 grid grid-cols-5 gap-1 text-center">
            {STATUS_FLOW.map((s, i) => (
              <li key={s} className="flex flex-col items-center gap-2">
                {i <= reached ? <CheckCircle2 size={22} className="text-banyan" /> : <Circle size={22} className="text-ink/20" />}
                <span className={`text-[10px] font-bold uppercase tracking-wide sm:text-xs ${i <= reached ? 'text-ink' : 'text-ink/40'}`}>{t(s)}</span>
              </li>
            ))}
          </ol>
          {pending && <p className="mt-4 rounded-xl bg-marigold/15 px-4 py-3 text-sm text-ink-soft">{t('This case is currently marked Pending — it is waiting on action or information. Our team will update it here.')}</p>}

          <h3 className="mt-8 font-display text-base font-bold text-ink">{t('Updates')}</h3>
          <ul className="mt-3 space-y-3">
            {[...result.timeline].reverse().map((ev, i) => (
              <li key={i} className="rounded-xl border border-ink/8 p-4">
                <div className="flex justify-between gap-3 text-xs font-bold uppercase tracking-wide text-ink-soft">
                  <span>{t(ev.status)}</span><span>{fmt(ev.at, locale)}</span>
                </div>
                {ev.message && <p className="mt-1.5 text-sm text-ink">{t(ev.message)}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
