'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, CheckCircle2, Copy, Loader2, Lock, PhoneCall, Send, Upload, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/grievanceConfig';
import { INDIAN_STATES } from '@/lib/locations';
import { DISTRICTS } from '@/data/districts';

const WINGS = [
  { id: 'youth', label: 'Youth Wing', hint: 'Education, jobs, skills, sports' },
  { id: 'women', label: 'Women Wing', hint: 'Safety, legal info, health, livelihood' },
  { id: 'general', label: 'General', hint: 'Any other public problem' },
];

const input = (err) =>
  `w-full rounded-xl border-2 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors ${
    err ? 'border-saffron-dark' : 'border-ink/10 focus:border-saffron'
  }`;

function Field({ label, error, hint, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-ink">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-soft/70">{hint}</p>}
      {error && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{error}</p>}
    </div>
  );
}

export default function GrievanceForm({ defaultWing = 'youth', defaultCategory = '', otpEnabled = false, channels = { sms: false, whatsapp: false, email: true } }) {
  const [form, setForm] = useState({
    wing: WINGS.some((w) => w.id === defaultWing) ? defaultWing : 'youth',
    category: defaultCategory, state: '', district: '', description: '',
    name: '', contactPhone: '', email: '', isSensitive: false, consent: false, website: '',
  });
  const [files, setFiles] = useState([]); // [{url, name}]
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [serverError, setServerError] = useState('');
  const [ticket, setTicket] = useState('');
  const [copied, setCopied] = useState(false);
  const [notify, setNotify] = useState({ sms: false, whatsapp: false, email: true });
  // OTP: idle -> sent -> verified
  const [otp, setOtp] = useState({ step: 'idle', code: '', token: '', email: '', busy: false, msg: '', dev: '' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v.trim());
  const onEmail = (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, email: v }));
    if (otp.step !== 'idle' && v.trim().toLowerCase() !== otp.email) setOtp({ step: 'idle', code: '', token: '', email: '', busy: false, msg: '', dev: '' });
  };

  const sendCode = async () => {
    if (!emailOk(form.email)) return setErrors((e) => ({ ...e, email: 'Enter a valid email address' }));
    setErrors((e) => ({ ...e, email: undefined }));
    setOtp((o) => ({ ...o, busy: true, msg: '' }));
    try {
      const res = await fetch('/api/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email.trim(), purpose: 'file' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send the code');
      setOtp((o) => ({ ...o, step: 'sent', email: form.email.trim().toLowerCase(), busy: false, msg: 'We emailed you a 6-digit code. Check your spam folder too.', dev: data.devCode || '' }));
    } catch (err) {
      setOtp((o) => ({ ...o, busy: false, msg: err.message }));
    }
  };

  const checkCode = async () => {
    setOtp((o) => ({ ...o, busy: true, msg: '' }));
    try {
      const res = await fetch('/api/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email.trim(), purpose: 'file', code: otp.code }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not verify');
      setOtp((o) => ({ ...o, step: 'verified', token: data.otpToken, busy: false, msg: '' }));
    } catch (err) {
      setOtp((o) => ({ ...o, busy: false, msg: err.message }));
    }
  };

  const setWing = (id) => {
    setForm((f) => ({ ...f, wing: id, category: '', isSensitive: false }));
    setFiles([]);
    setNotify({ sms: false, whatsapp: false, email: true });
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setServerError('');
    if (files.length >= 3) return setServerError('You can attach up to 3 files');
    if (file.size > 5 * 1024 * 1024) return setServerError('File is larger than 5 MB');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/grievance-upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFiles((f) => [...f, { url: data.url, name: file.name }]);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.category) e.category = 'Please choose a category';
    if (!form.state) e.state = 'Please choose your state';
    if (form.district.trim().length < 2) e.district = 'Please enter your district';
    if (form.description.trim().length < 20) e.description = 'Please describe the problem (at least 20 characters)';
    if (!emailOk(form.email)) e.email = 'Enter a valid email address';
    if (form.contactPhone && !/^[6-9]\d{9}$/.test(form.contactPhone)) e.contactPhone = 'Enter a valid 10-digit mobile number, or leave it empty';
    if (otpEnabled && emailOk(form.email) && otp.step !== 'verified') e.email = 'Please verify your email with the OTP';
    if (!form.consent) e.consent = 'Please accept to continue';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, attachments: files.map((f) => f.url), notify, otpToken: otp.token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setTicket(data.ticketId);
      setStatus('done');
    } catch (err) {
      setServerError(err.message);
      setStatus('idle');
    }
  };

  if (status === 'done') {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-card sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-banyan/10 text-banyan">
          <CheckCircle2 size={34} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">आपकी समस्या दर्ज हो गई है</h2>
        <p className="mt-1 text-sm text-ink-soft">Your problem has been registered. Please save your ticket number.</p>
        <div className="mx-auto mt-6 flex max-w-md items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-saffron/40 bg-saffron/5 px-5 py-4">
          <span className="break-all font-mono text-lg font-bold tracking-wider text-ink">{ticket}</span>
          <button
            type="button"
            onClick={() => { navigator.clipboard?.writeText(ticket); setCopied(true); }}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-saffron px-4 py-2 text-xs font-bold uppercase text-white hover:bg-saffron-dark"
          >
            <Copy size={14} /> {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="mx-auto mt-5 max-w-md text-sm text-ink-soft">
          To check the status later you will need this ticket number and the email address you
          entered. We do not promise a specific outcome or timeline; our team will review and refer your case.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/track" className="rounded-full bg-saffron px-6 py-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-saffron-dark">
            Track this ticket
          </Link>
          <Link href="/" className="rounded-full border-2 border-ink/15 px-6 py-3 text-xs font-bold uppercase tracking-wide text-ink hover:border-ink">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const districtHints = DISTRICTS[form.state] || [];
  const canSensitive = form.wing === 'women';

  return (
    <form onSubmit={submit} noValidate className="space-y-7 rounded-3xl bg-white p-6 shadow-card sm:p-10">
      {/* Honeypot — hidden from people, bots tend to fill it */}
      <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div>
        <p className="mb-3 text-sm font-bold text-ink">1. Which wing is this for?</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {WINGS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setWing(w.id)}
              className={`rounded-2xl border-2 p-4 text-left transition-colors ${
                form.wing === w.id ? 'border-saffron bg-saffron/5' : 'border-ink/10 hover:border-saffron/50'
              }`}
            >
              <p className="font-display text-base font-bold text-ink">{w.label}</p>
              <p className="mt-0.5 text-xs text-ink-soft">{w.hint}</p>
            </button>
          ))}
        </div>
      </div>

      {canSensitive && (
        <div className="space-y-4 rounded-2xl border border-chakra/20 bg-chakra/5 p-5">
          <p className="flex items-start gap-2 text-sm font-semibold text-ink">
            <PhoneCall size={18} className="mt-0.5 shrink-0 text-chakra" />
            <span>
              In immediate danger? Call <b>112</b> (emergency). Women Helpline: <b>181</b>. Cyber crime: <b>1930</b>.
              This website is not an emergency service.
            </span>
          </p>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.isSensitive}
              onChange={(e) => { setForm((f) => ({ ...f, isSensitive: e.target.checked })); if (e.target.checked) { setFiles([]); setNotify({ sms: false, whatsapp: false, email: false }); } else setNotify((n) => ({ ...n, email: true })); }}
              className="mt-1 h-4 w-4 accent-saffron"
            />
            <span>
              <b className="flex items-center gap-1.5"><Lock size={14} /> This is a sensitive / confidential matter</b>
              <span className="mt-0.5 block text-xs text-ink-soft">
                It is kept off the public tracker and normal lists, gets a private ticket number, and no documents are
                uploaded here — if needed, our team will ask for them privately.
              </span>
            </span>
          </label>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="2. Category" error={errors.category}>
          <select value={form.category} onChange={set('category')} className={input(errors.category)}>
            <option value="">Select a category</option>
            {CATEGORIES[form.wing].map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="3. State" error={errors.state}>
          <select value={form.state} onChange={set('state')} className={input(errors.state)}>
            <option value="">Select your state</option>
            {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="District" error={errors.district}>
          <input list="district-hints" value={form.district} onChange={set('district')} placeholder="Your district" className={input(errors.district)} />
          <datalist id="district-hints">{districtHints.map((d) => <option key={d} value={d} />)}</datalist>
        </Field>
        <Field label="Your name (optional)">
          <input value={form.name} onChange={set('name')} placeholder="You may stay anonymous" className={input()} />
        </Field>
      </div>

      <Field label="4. Explain the problem" error={errors.description} hint="What happened, where, and when? Please avoid sharing Aadhaar/bank numbers here.">
        <textarea rows={6} value={form.description} onChange={set('description')} className={input(errors.description)} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email address" error={errors.email} hint={otpEnabled ? 'We will email a one-time code to confirm it. Updates and tracking use this address.' : 'Used for updates and to track your ticket.'}>
          <div className="flex gap-2">
            <input type="email" autoComplete="email" value={form.email} onChange={onEmail} placeholder="you@example.com" className={input(errors.email)} />
            {otpEnabled && otp.step !== 'verified' && (
              <button type="button" onClick={sendCode} disabled={otp.busy} className="shrink-0 rounded-xl border-2 border-saffron px-4 text-xs font-bold uppercase tracking-wide text-saffron hover:bg-saffron hover:text-white disabled:opacity-60">
                {otp.busy && otp.step === 'idle' ? <Loader2 size={15} className="animate-spin" /> : otp.step === 'sent' ? 'Resend' : 'Send OTP'}
              </button>
            )}
          </div>
          {otpEnabled && otp.step === 'sent' && (
            <div className="mt-3 flex gap-2">
              <input inputMode="numeric" maxLength={6} value={otp.code} onChange={(e) => setOtp((o) => ({ ...o, code: e.target.value.replace(/\D/g, '') }))} placeholder="6-digit code" className={input()} />
              <button type="button" onClick={checkCode} disabled={otp.busy || otp.code.length !== 6} className="shrink-0 rounded-xl bg-saffron px-5 text-xs font-bold uppercase tracking-wide text-white hover:bg-saffron-dark disabled:opacity-60">
                {otp.busy ? <Loader2 size={15} className="animate-spin" /> : 'Verify'}
              </button>
            </div>
          )}
          {otp.step === 'verified' && <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-banyan"><BadgeCheck size={15} /> Email verified</p>}
          {otp.msg && <p className="mt-2 text-xs font-semibold text-ink-soft">{otp.msg}</p>}
          {otp.dev && <p className="mt-1 text-xs text-ink-soft/70">Test mode — your code is {otp.dev}</p>}
        </Field>
        <Field label="Mobile number (optional)" error={errors.contactPhone} hint="Only if you are happy for our team to call you.">
          <input inputMode="numeric" maxLength={10} value={form.contactPhone} onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} placeholder="10-digit mobile" className={input(errors.contactPhone)} />
        </Field>
      </div>

      {!form.isSensitive && (
        <div>
          <p className="mb-2 text-sm font-bold text-ink">5. Supporting document (optional)</p>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-ink/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-ink hover:border-saffron hover:text-saffron">
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploading ? 'Uploading…' : 'Attach PDF / JPG / PNG'}
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={onFile} disabled={uploading || files.length >= 3} className="hidden" />
          </label>
          <span className="ml-3 text-xs text-ink-soft/70">Up to 3 files, 5 MB each</span>
          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((f, i) => (
                <li key={f.url} className="flex items-center justify-between rounded-xl bg-ivory px-4 py-2 text-sm text-ink">
                  <span className="truncate">{f.name}</span>
                  <button type="button" onClick={() => setFiles((l) => l.filter((_, j) => j !== i))} aria-label="Remove file" className="text-ink-soft hover:text-saffron-dark">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-ink/10 p-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
          <input type="checkbox" checked={notify.email} onChange={(e) => setNotify((n) => ({ ...n, email: e.target.checked }))} className="mt-1 h-4 w-4 accent-saffron" />
          <span>
            <b>Email me updates on this ticket</b>
            <span className="mt-0.5 block text-xs text-ink-soft/80">
              Emails carry only your ticket number and its status — never the details of your problem.
              {form.isSensitive && <b className="text-saffron-dark"> For a confidential matter, tick this only if you are sure nobody else can open that inbox.</b>}
            </span>
          </span>
        </label>
        {/* SMS / WhatsApp — appear here automatically once enabled on the server (see PHASE3_SETUP.md) */}
        {(channels.sms || channels.whatsapp) && form.contactPhone && (
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 pl-7 text-sm text-ink">
            {channels.sms && <label className="flex items-center gap-2"><input type="checkbox" checked={notify.sms} onChange={(e) => setNotify((n) => ({ ...n, sms: e.target.checked }))} className="accent-saffron" /> SMS</label>}
            {channels.whatsapp && <label className="flex items-center gap-2"><input type="checkbox" checked={notify.whatsapp} onChange={(e) => setNotify((n) => ({ ...n, whatsapp: e.target.checked }))} className="accent-saffron" /> WhatsApp</label>}
          </div>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
          <input type="checkbox" checked={form.consent} onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))} className="mt-1 h-4 w-4 accent-saffron" />
          <span>
            I agree that the party may store and use the details I have given to review, refer and follow up on this
            problem, and to contact me about it.
          </span>
        </label>
        {errors.consent && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{errors.consent}</p>}
      </div>

      {serverError && <p className="rounded-xl bg-saffron/10 px-4 py-3 text-sm font-semibold text-saffron-dark">{serverError}</p>}

      <button
        type="submit"
        disabled={status === 'sending' || uploading}
        className="inline-flex items-center gap-2 rounded-full bg-saffron px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-colors hover:bg-saffron-dark disabled:opacity-60"
      >
        {status === 'sending' ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
        {status === 'sending' ? 'Submitting…' : 'Submit & get ticket'}
      </button>
    </form>
  );
}
