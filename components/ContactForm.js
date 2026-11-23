'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { namesOf } from '@/lib/personName';
import LimitedTextarea from '@/components/LimitedTextarea';
import FormPreview from '@/components/FormPreview';
import { useLang } from '@/context/LanguageContext';

export default function ContactForm() {
  const { t } = useLang();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', type: 'Query', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [preview, setPreview] = useState(false);
  const [sendError, setSendError] = useState('');
  const { user } = useAuth();

  // Logged-in members: fill name and email automatically (they can still change them).
  // Visitors who are not logged in simply type everything themselves.
  useEffect(() => {
    if (!user) return;
    const n = namesOf(user);
    setForm((f) => ({
      ...f,
      firstName: f.firstName || n.firstName,
      lastName: f.lastName || n.lastName,
      email: f.email || user.email || '',
    }));
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Please enter your first name';
    if (!form.lastName.trim()) e.lastName = 'Please enter your last name';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
    if (!form.message.trim()) e.message = 'Please write a short message';
    return e;
  };

  // Step 1: check the form, then show the preview. Nothing is sent yet.
  const handleSubmit = (ev) => {
    ev.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length > 0) return;
    setSendError('');
    setPreview(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: the visitor confirmed the preview - send it.
  const confirmSend = async () => {
    setStatus('loading');
    setSendError('');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Request failed');
      }
      setStatus('success');
    } catch (err) {
      setStatus('idle');
      setSendError(err?.message && err.message !== 'Request failed' ? t(err.message) : t('Something went wrong. Please try again.'));
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-banyan/20 bg-banyan/5 p-10 text-center"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-banyan text-white">
          <CheckCircle2 size={30} />
        </span>
        <h3 className="mt-5 font-display text-2xl font-extrabold text-ink">{t('Message Sent')}</h3>
        <p className="mt-2 text-ink-soft">
          {t('Thanks, {name} — our media desk replies within one working day.', { name: form.firstName })}
        </p>
        <button
          type="button"
          onClick={() => {
            const n = namesOf(user);
            setForm({ firstName: n.firstName, lastName: n.lastName, email: user?.email || '', type: 'Query', subject: '', message: '' });
            setStatus('idle');
            setPreview(false);
          }}
          className="mt-6 rounded-full border-2 border-ink/15 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
        >
          {t('Send Another Message')}
        </button>
      </motion.div>
    );
  }

  if (preview) {
    return (
      <FormPreview
        rows={[
          ['Name', `${form.firstName.trim()} ${form.lastName.trim()}`.trim()],
          ['Email', form.email.trim()],
          ['This is a', t(form.type)],
          ['Subject', form.subject.trim()],
        ]}
        longText={form.message.trim()}
        loading={status === 'loading'}
        error={sendError}
        onEdit={() => setPreview(false)}
        onConfirm={confirmSend}
        confirmLabel="Confirm & Send"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-ink/8 bg-white p-8 shadow-card sm:p-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-ink">{t('First Name')}</label>
          <input
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            placeholder={t("First name")}
            className={`w-full rounded-xl border-2 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors ${errors.firstName ? 'border-saffron-dark' : 'border-ink/10 focus:border-saffron'}`}
          />
          {errors.firstName && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{t(errors.firstName)}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-ink">{t('Last Name')}</label>
          <input
            type="text"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            placeholder={t("Last name")}
            className={`w-full rounded-xl border-2 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors ${errors.lastName ? 'border-saffron-dark' : 'border-ink/10 focus:border-saffron'}`}
          />
          {errors.lastName && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{t(errors.lastName)}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-bold text-ink">{t('Email Address')}</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            className={`w-full rounded-xl border-2 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors ${errors.email ? 'border-saffron-dark' : 'border-ink/10 focus:border-saffron'}`}
          />
          {errors.email && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{t(errors.email)}</p>}
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-ink">{t('This is a')}</label>
        <div className="grid grid-cols-3 gap-2.5">
          {['Query', 'Complaint', 'Suggestion'].map((ty) => (
            <button
              type="button"
              key={ty}
              onClick={() => setForm((f) => ({ ...f, type: ty }))}
              className={`rounded-xl border-2 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                form.type === ty
                  ? 'border-saffron bg-saffron text-white'
                  : 'border-ink/10 text-ink-soft hover:border-saffron hover:text-saffron'
              }`}
            >
              {t(ty)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-ink">{t('Subject')}</label>
        <input
          type="text"
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          placeholder={t("What is this about?")}
          className="w-full rounded-xl border-2 border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-saffron"
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-ink">{t('Message')}</label>
        <LimitedTextarea
          rows={5}
          value={form.message}
          onChange={(message) => setForm((f) => ({ ...f, message }))}
          placeholder={t("Write your message...")}
          className={`w-full rounded-xl border-2 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors ${errors.message ? 'border-saffron-dark' : 'border-ink/10 focus:border-saffron'}`}
        />
        {errors.message && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{t(errors.message)}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-saffron px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark disabled:opacity-70 sm:w-auto"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={18} className="animate-spin" /> {t('Sending...')}
          </>
        ) : (
          <>
            <Send size={17} /> {t('Preview Message')}
          </>
        )}
      </button>
    </form>
  );
}
