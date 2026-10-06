'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', type: 'Query', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
    if (!form.message.trim()) e.message = 'Please write a short message';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length > 0) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
    } catch {
      setStatus('idle');
      setErrors({ message: 'Something went wrong. Please try again.' });
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
        <h3 className="mt-5 font-display text-2xl font-extrabold text-ink">Message Sent</h3>
        <p className="mt-2 text-ink-soft">
          Thanks, {form.name.split(' ')[0]} — our media desk replies within one working day.
        </p>
        <button
          type="button"
          onClick={() => { setForm({ name: '', email: '', type: 'Query', subject: '', message: '' }); setStatus('idle'); }}
          className="mt-6 rounded-full border-2 border-ink/15 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-ink/8 bg-white p-8 shadow-card sm:p-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-ink">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
            className={`w-full rounded-xl border-2 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors ${errors.name ? 'border-saffron-dark' : 'border-ink/10 focus:border-saffron'}`}
          />
          {errors.name && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-ink">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            className={`w-full rounded-xl border-2 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors ${errors.email ? 'border-saffron-dark' : 'border-ink/10 focus:border-saffron'}`}
          />
          {errors.email && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{errors.email}</p>}
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-ink">This is a</label>
        <div className="grid grid-cols-3 gap-2.5">
          {['Query', 'Complaint', 'Suggestion'].map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setForm((f) => ({ ...f, type: t }))}
              className={`rounded-xl border-2 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                form.type === t
                  ? 'border-saffron bg-saffron text-white'
                  : 'border-ink/10 text-ink-soft hover:border-saffron hover:text-saffron'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-ink">Subject</label>
        <input
          type="text"
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          placeholder="What is this about?"
          className="w-full rounded-xl border-2 border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-saffron"
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-ink">Message</label>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Write your message..."
          className={`w-full rounded-xl border-2 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors ${errors.message ? 'border-saffron-dark' : 'border-ink/10 focus:border-saffron'}`}
        />
        {errors.message && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-saffron px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark disabled:opacity-70 sm:w-auto"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send size={17} /> Send Message
          </>
        )}
      </button>
    </form>
  );
}
