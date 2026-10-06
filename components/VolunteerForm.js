'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

const INTERESTS = ['Booth Management', 'Social Media', 'Ground Campaigning', 'Fundraising', 'Content & Design', 'Legal & Compliance'];

export default function VolunteerForm() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    constituency: '',
    interests: [],
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const toggleInterest = (i) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(i)
        ? f.interests.filter((x) => x !== i)
        : [...f.interests, i],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your full name';
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit mobile number';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
    if (!form.constituency.trim()) e.constituency = 'Please tell us your constituency';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length > 0) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/volunteers', {
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
        <h3 className="mt-5 font-display text-2xl font-extrabold text-ink">Welcome to the B.A.A.P. family, {form.name.split(' ')[0]}!</h3>
        <p className="mt-2 text-ink-soft">
          Your district coordinator will call you on {form.phone} within 48 hours.
          Keep an eye on your inbox at {form.email} too.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm({ name: '', phone: '', email: '', constituency: '', interests: [], message: '' });
            setStatus('idle');
          }}
          className="mt-6 rounded-full border-2 border-ink/15 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
        >
          Submit Another Response
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-ink/8 bg-white p-8 shadow-card sm:p-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Full Name" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ramesh Kumar"
            className={inputClass(errors.name)}
          />
        </Field>
        <Field label="Mobile Number" error={errors.phone}>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
            placeholder="98XXXXXXXX"
            className={inputClass(errors.phone)}
          />
        </Field>
        <Field label="Email Address" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            className={inputClass(errors.email)}
          />
        </Field>
        <Field label="Constituency / City" error={errors.constituency}>
          <input
            type="text"
            value={form.constituency}
            onChange={(e) => setForm((f) => ({ ...f, constituency: e.target.value }))}
            placeholder="e.g. Nagpur North"
            className={inputClass(errors.constituency)}
          />
        </Field>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-bold text-ink">Where would you like to help?</p>
        <div className="flex flex-wrap gap-2.5">
          {INTERESTS.map((i) => {
            const active = form.interests.includes(i);
            return (
              <button
                type="button"
                key={i}
                onClick={() => toggleInterest(i)}
                className={`rounded-full border-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                  active
                    ? 'border-saffron bg-saffron text-white'
                    : 'border-ink/15 text-ink-soft hover:border-saffron hover:text-saffron'
                }`}
              >
                {i}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-ink">Message (optional)</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Tell us about any past organising experience..."
          className="w-full rounded-xl border-2 border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-saffron"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-saffron px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark disabled:opacity-70 sm:w-auto"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Submitting...
          </>
        ) : (
          <>
            <Send size={17} /> Join as a Volunteer
          </>
        )}
      </button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-ink">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{error}</p>}
    </div>
  );
}

function inputClass(error) {
  return `w-full rounded-xl border-2 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors ${
    error ? 'border-saffron-dark' : 'border-ink/10 focus:border-saffron'
  }`;
}
