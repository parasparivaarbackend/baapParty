'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, CheckCircle2, Copy, Film, Image as ImageIcon, Link2, Loader2, Lock, PhoneCall, Send, Upload, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/grievanceConfig';
import { INDIAN_STATES } from '@/lib/locations';
import { DISTRICTS } from '@/data/districts';
import { useAuth } from '@/context/AuthContext';
import { namesOf } from '@/lib/personName';
import LimitedTextarea from '@/components/LimitedTextarea';
import { useLang } from '@/context/LanguageContext';

const WINGS = [
  { id: 'youth', label: 'Youth Wing', hint: 'Education, jobs, skills, sports' },
  { id: 'women', label: 'Women Wing', hint: 'Safety, legal info, health, livelihood' },
  { id: 'general', label: 'General', hint: 'Any other public problem' },
];

const MAX_FILES = 5;
const isHttpUrl = (u) => {
  try {
    return ['http:', 'https:'].includes(new URL(u).protocol);
  } catch {
    return false;
  }
};

const input = (err) =>
  `w-full rounded-xl border-2 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors ${
    err ? 'border-saffron-dark' : 'border-ink/10 focus:border-saffron'
  }`;

function Field({ label, error, hint, children }) {
  const { t } = useLang();
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-ink">{t(label)}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-soft/70">{t(hint)}</p>}
      {error && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{t(error)}</p>}
    </div>
  );
}

// One "add a photo" / "add a video" box. Each can be filled by uploading from the device OR by pasting a link.
function MediaAdder({ kind, uploading, disabled, onFile, onLink }) {
  const { t } = useLang();
  const [mode, setMode] = useState('upload'); // 'upload' | 'link'
  const [link, setLink] = useState('');
  const [err, setErr] = useState('');
  const isVideo = kind === 'video';
  const Icon = isVideo ? Film : ImageIcon;
  const busy = uploading === kind;
  const toggle = (active) =>
    `flex-1 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors ${
      active ? 'bg-saffron text-white' : 'text-ink-soft hover:text-saffron'
    }`;
  const addLink = () => {
    const problem = onLink(link.trim());
    setErr(problem);
    if (!problem) setLink('');
  };

  return (
    <div className="rounded-2xl border border-ink/10 p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
        <Icon size={16} className="text-saffron" /> {isVideo ? t('Video') : t('Photo / PDF')}
      </p>
      <div className="mb-3 flex gap-1 rounded-xl bg-ivory p-1">
        <button type="button" onClick={() => setMode('upload')} className={toggle(mode === 'upload')}>{t('Upload')}</button>
        <button type="button" onClick={() => setMode('link')} className={toggle(mode === 'link')}>{t('Paste link')}</button>
      </div>

      {mode === 'upload' ? (
        <>
          <label
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/15 px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink hover:border-saffron hover:text-saffron ${
              disabled ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {busy ? t('Uploading…') : isVideo ? t('Choose video') : t('Choose photo / PDF')}
            <input
              type="file"
              accept={isVideo ? 'video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm' : '.pdf,.jpg,.jpeg,.png'}
              disabled={disabled || !!uploading}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (f) onFile(f);
              }}
            />
          </label>
          <p className="mt-2 text-[11px] text-ink-soft/70">
            {isVideo ? t('MP4, MOV or WEBM, up to 25 MB') : t('JPG, PNG or PDF, up to 5 MB')}
          </p>
        </>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink(); } }}
              placeholder={isVideo ? t('YouTube / Google Drive / video link') : t('Link to the photo')}
              className={input(err)}
            />
            <button
              type="button"
              onClick={addLink}
              disabled={disabled || !link.trim()}
              className="shrink-0 rounded-xl bg-saffron px-4 text-xs font-bold uppercase tracking-wide text-white hover:bg-saffron-dark disabled:opacity-50"
            >
              {t('Add')}
            </button>
          </div>
          {err && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{t(err)}</p>}
          <p className="mt-2 text-[11px] text-ink-soft/70">{t('Make sure the link is open for anyone to view.')}</p>
        </>
      )}
    </div>
  );
}

export default function GrievanceForm({ defaultWing = 'youth', defaultCategory = '', otpEnabled = false, channels = { sms: false, whatsapp: false, email: true } }) {
  const { t } = useLang();
  const [form, setForm] = useState({
    wing: WINGS.some((w) => w.id === defaultWing) ? defaultWing : 'youth',
    category: defaultCategory, state: '', district: '', description: '',
    firstName: '', lastName: '', contactPhone: '', email: '', isSensitive: false, consent: false, website: '',
  });
  const [files, setFiles] = useState([]); // [{url, name, kind: 'photo' | 'video', via: 'upload' | 'link'}]
  const [uploading, setUploading] = useState(''); // '' | 'photo' | 'video' - which box is uploading
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [serverError, setServerError] = useState('');
  const [ticket, setTicket] = useState('');
  const [copied, setCopied] = useState(false);
  const [notify, setNotify] = useState({ sms: false, whatsapp: false, email: true });
  // OTP: idle -> sent -> verified
  const [otp, setOtp] = useState({ step: 'idle', code: '', token: '', email: '', busy: false, msg: '', dev: '' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const { user } = useAuth();

  // Logged-in members: fill name, email and mobile automatically (they can still change them).
  useEffect(() => {
    if (!user) return;
    const n = namesOf(user);
    setForm((f) => ({
      ...f,
      firstName: f.firstName || n.firstName,
      lastName: f.lastName || n.lastName,
      email: f.email || user.email || '',
      contactPhone: f.contactPhone || String(user.phone || '').replace(/\D/g, '').slice(-10),
    }));
  }, [user]);

  const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v.trim());
  const onEmail = (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, email: v }));
    if (otp.step !== 'idle' && v.trim().toLowerCase() !== otp.email) setOtp({ step: 'idle', code: '', token: '', email: '', busy: false, msg: '', dev: '' });
  };

  const sendCode = async () => {
    if (!emailOk(form.email)) return setErrors((e) => ({ ...e, email: t('Enter a valid email address') }));
    setErrors((e) => ({ ...e, email: undefined }));
    setOtp((o) => ({ ...o, busy: true, msg: '' }));
    try {
      const res = await fetch('/api/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email.trim(), purpose: 'file' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send the code');
      setOtp((o) => ({ ...o, step: 'sent', email: form.email.trim().toLowerCase(), busy: false, msg: t('We emailed you a 6-digit code. Check your spam folder too.'), dev: data.devCode || '' }));
    } catch (err) {
      setOtp((o) => ({ ...o, busy: false, msg: t(err.message) }));
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
      setOtp((o) => ({ ...o, busy: false, msg: t(err.message) }));
    }
  };

  const setWing = (id) => {
    setForm((f) => ({ ...f, wing: id, category: '', isSensitive: false }));
    setFiles([]);
    setNotify({ sms: false, whatsapp: false, email: true });
  };

  // Upload a photo / PDF / video from the device. The server re-checks the real file type and size.
  const uploadMedia = async (file, kind) => {
    setServerError('');
    if (files.length >= MAX_FILES) return setServerError(t('You can add up to {n} items', { n: MAX_FILES }));
    const isVideoFile = file.type.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(file.name);
    if (kind === 'video' && !isVideoFile) return setServerError(t('Please choose a video file (MP4, MOV or WEBM)'));
    if (kind === 'photo' && isVideoFile) return setServerError(t('That is a video - please use the Video box'));
    if (file.size > (kind === 'video' ? 25 : 5) * 1024 * 1024) {
      return setServerError(kind === 'video' ? t('Video is larger than 25 MB. Please paste a link instead.') : t('File is larger than 5 MB'));
    }
    setUploading(kind);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/grievance-upload', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFiles((f) => [...f, { url: data.url, name: file.name, kind, via: 'upload' }]);
    } catch (err) {
      setServerError(t(err.message));
    } finally {
      setUploading('');
    }
  };

  // Add a photo / video by link. Returns an error message, or '' when added.
  const addLink = (url, kind) => {
    if (files.length >= MAX_FILES) return t('You can add up to {n} items', { n: MAX_FILES });
    if (!isHttpUrl(url)) return t('Please paste a full link starting with https://');
    if (files.some((f) => f.url === url)) return t('This link is already added');
    setFiles((f) => [...f, { url, name: url.replace(/^https?:\/\//, '').slice(0, 70), kind, via: 'link' }]);
    return '';
  };

  const validate = () => {
    const e = {};
    if (!form.category) e.category = t('Please choose a category');
    if (!form.state) e.state = t('Please choose your state');
    if (form.district.trim().length < 2) e.district = t('Please enter your district');
    if (form.description.trim().length < 20) e.description = t('Please describe the problem (at least 20 characters)');
    if (!emailOk(form.email)) e.email = t('Enter a valid email address');
    if (form.contactPhone && !/^[6-9]\d{9}$/.test(form.contactPhone)) e.contactPhone = t('Enter a valid 10-digit mobile number, or leave it empty');
    if (otpEnabled && emailOk(form.email) && otp.step !== 'verified') e.email = t('Please verify your email with the OTP');
    if (!form.consent) e.consent = t('Please accept to continue');
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
      setServerError(t(err.message));
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
        <p className="mt-1 text-sm text-ink-soft">{t('Your problem has been registered. Please save your ticket number.')}</p>
        <div className="mx-auto mt-6 flex max-w-md items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-saffron/40 bg-saffron/5 px-5 py-4">
          <span className="break-all font-mono text-lg font-bold tracking-wider text-ink">{ticket}</span>
          <button
            type="button"
            onClick={() => { navigator.clipboard?.writeText(ticket); setCopied(true); }}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-saffron px-4 py-2 text-xs font-bold uppercase text-white hover:bg-saffron-dark"
          >
            <Copy size={14} /> {copied ? t('Copied') : t('Copy')}
          </button>
        </div>
        <p className="mx-auto mt-5 max-w-md text-sm text-ink-soft">
          {t('To check the status later you will need this ticket number and the email address you entered. We do not promise a specific outcome or timeline; our team will review and refer your case.')}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/track" className="rounded-full bg-saffron px-6 py-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-saffron-dark">
            {t('Track this ticket')}
          </Link>
          <Link href="/" className="rounded-full border-2 border-ink/15 px-6 py-3 text-xs font-bold uppercase tracking-wide text-ink hover:border-ink">
            {t('Back to home')}
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
        <p className="mb-3 text-sm font-bold text-ink">{t('1. Which wing is this for?')}</p>
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
              <p className="font-display text-base font-bold text-ink">{t(w.label)}</p>
              <p className="mt-0.5 text-xs text-ink-soft">{t(w.hint)}</p>
            </button>
          ))}
        </div>
      </div>

      {canSensitive && (
        <div className="space-y-4 rounded-2xl border border-chakra/20 bg-chakra/5 p-5">
          <p className="flex items-start gap-2 text-sm font-semibold text-ink">
            <PhoneCall size={18} className="mt-0.5 shrink-0 text-chakra" />
            <span>
              {t('In immediate danger? Call')} <b>112</b> {t('(emergency). Women Helpline:')} <b>181</b>. {t('Cyber crime:')} <b>1930</b>.
              {' '}{t('This website is not an emergency service.')}
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
              <b className="flex items-center gap-1.5"><Lock size={14} /> {t('This is a sensitive / confidential matter')}</b>
              <span className="mt-0.5 block text-xs text-ink-soft">
                {t('It is kept off the public tracker and normal lists, gets a private ticket number, and no documents are uploaded here — if needed, our team will ask for them privately.')}
              </span>
            </span>
          </label>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="2. Category" error={errors.category}>
          <select value={form.category} onChange={set('category')} className={input(errors.category)}>
            <option value="">{t('Select a category')}</option>
            {CATEGORIES[form.wing].map((c) => <option key={c} value={c}>{t(c)}</option>)}
          </select>
        </Field>
        <Field label="3. State" error={errors.state}>
          <select value={form.state} onChange={set('state')} className={input(errors.state)}>
            <option value="">{t('Select your state')}</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{t(s)}</option>)}
          </select>
        </Field>
        <Field label="District" error={errors.district}>
          <input list="district-hints" value={form.district} onChange={set('district')} placeholder={t('Your district')} className={input(errors.district)} />
          <datalist id="district-hints">{districtHints.map((d) => <option key={d} value={d} />)}</datalist>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name">
          <input autoComplete="given-name" value={form.firstName} onChange={set('firstName')} placeholder={t('First Name')} className={input()} />
        </Field>
        <Field label="Last name">
          <input autoComplete="family-name" value={form.lastName} onChange={set('lastName')} placeholder={t('Last Name')} className={input()} />
        </Field>
      </div>

      <Field label="4. Explain the problem" error={errors.description} hint="What happened, where, and when? Please avoid sharing Aadhaar/bank numbers here.">
        <LimitedTextarea rows={6} value={form.description} onChange={(description) => setForm((f) => ({ ...f, description }))} className={input(errors.description)} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email address" error={errors.email} hint={otpEnabled ? 'We will email a one-time code to confirm it. Updates and tracking use this address.' : 'Used for updates and to track your ticket.'}>
          <div className="flex gap-2">
            <input type="email" autoComplete="email" value={form.email} onChange={onEmail} placeholder="you@example.com" className={input(errors.email)} />
            {otpEnabled && otp.step !== 'verified' && (
              <button type="button" onClick={sendCode} disabled={otp.busy} className="shrink-0 rounded-xl border-2 border-saffron px-4 text-xs font-bold uppercase tracking-wide text-saffron hover:bg-saffron hover:text-white disabled:opacity-60">
                {otp.busy && otp.step === 'idle' ? <Loader2 size={15} className="animate-spin" /> : otp.step === 'sent' ? t('Resend') : t('Send OTP')}
              </button>
            )}
          </div>
          {otpEnabled && otp.step === 'sent' && (
            <div className="mt-3 flex gap-2">
              <input inputMode="numeric" maxLength={6} value={otp.code} onChange={(e) => setOtp((o) => ({ ...o, code: e.target.value.replace(/\D/g, '') }))} placeholder={t('6-digit code')} className={input()} />
              <button type="button" onClick={checkCode} disabled={otp.busy || otp.code.length !== 6} className="shrink-0 rounded-xl bg-saffron px-5 text-xs font-bold uppercase tracking-wide text-white hover:bg-saffron-dark disabled:opacity-60">
                {otp.busy ? <Loader2 size={15} className="animate-spin" /> : t('Verify')}
              </button>
            </div>
          )}
          {otp.step === 'verified' && <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-banyan"><BadgeCheck size={15} /> {t('Email verified')}</p>}
          {otp.msg && <p className="mt-2 text-xs font-semibold text-ink-soft">{t(otp.msg)}</p>}
          {otp.dev && <p className="mt-1 text-xs text-ink-soft/70">{t('Test mode — your code is')} {otp.dev}</p>}
        </Field>
        <Field label="Mobile number" error={errors.contactPhone} hint="Only if you are happy for our team to call you.">
          <input inputMode="numeric" maxLength={10} value={form.contactPhone} onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} placeholder={t('10-digit mobile')} className={input(errors.contactPhone)} />
        </Field>
      </div>

      {!form.isSensitive && (
        <div>
          <p className="mb-1 text-sm font-bold text-ink">{t('5. Photos, videos or documents')}</p>
          <p className="mb-4 text-xs text-ink-soft/70">
            {t('Add up to {n} items. For a photo or a video you can either upload it from your device or paste a link.', { n: MAX_FILES })}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <MediaAdder
              kind="photo"
              uploading={uploading}
              disabled={files.length >= MAX_FILES}
              onFile={(f) => uploadMedia(f, 'photo')}
              onLink={(u) => addLink(u, 'photo')}
            />
            <MediaAdder
              kind="video"
              uploading={uploading}
              disabled={files.length >= MAX_FILES}
              onFile={(f) => uploadMedia(f, 'video')}
              onLink={(u) => addLink(u, 'video')}
            />
          </div>
          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((f, i) => (
                <li key={f.url} className="flex items-center justify-between gap-3 rounded-xl bg-ivory px-4 py-2 text-sm text-ink">
                  <span className="flex min-w-0 items-center gap-2">
                    {f.kind === 'video' ? <Film size={15} className="shrink-0 text-saffron" /> : <ImageIcon size={15} className="shrink-0 text-saffron" />}
                    <span className="truncate">{f.name}</span>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-ink-soft">
                      {f.via === 'link' ? <><Link2 size={10} /> {t('Link')}</> : t('Uploaded')}
                    </span>
                  </span>
                  <button type="button" onClick={() => setFiles((l) => l.filter((_, j) => j !== i))} aria-label={t('Remove file')} className="shrink-0 text-ink-soft hover:text-saffron-dark">
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
            <b>{t('Email me updates on this ticket')}</b>
            <span className="mt-0.5 block text-xs text-ink-soft/80">
              {t('Emails carry only your ticket number and its status — never the details of your problem.')}
              {form.isSensitive && <b className="text-saffron-dark"> {t('For a confidential matter, tick this only if you are sure nobody else can open that inbox.')}</b>}
            </span>
          </span>
        </label>
        {/* SMS / WhatsApp — appear here automatically once enabled on the server (see PHASE3_SETUP.md) */}
        {(channels.sms || channels.whatsapp) && form.contactPhone && (
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 pl-7 text-sm text-ink">
            {channels.sms && <label className="flex items-center gap-2"><input type="checkbox" checked={notify.sms} onChange={(e) => setNotify((n) => ({ ...n, sms: e.target.checked }))} className="accent-saffron" /> {t('SMS')}</label>}
            {channels.whatsapp && <label className="flex items-center gap-2"><input type="checkbox" checked={notify.whatsapp} onChange={(e) => setNotify((n) => ({ ...n, whatsapp: e.target.checked }))} className="accent-saffron" /> {t('WhatsApp')}</label>}
          </div>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
          <input type="checkbox" checked={form.consent} onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))} className="mt-1 h-4 w-4 accent-saffron" />
          <span>
            {t('I agree that the party may store and use the details I have given to review, refer and follow up on this problem, and to contact me about it.')}
          </span>
        </label>
        {errors.consent && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{errors.consent}</p>}
      </div>

      {serverError && <p className="rounded-xl bg-saffron/10 px-4 py-3 text-sm font-semibold text-saffron-dark">{t(serverError)}</p>}

      <button
        type="submit"
        disabled={status === 'sending' || uploading}
        className="inline-flex items-center gap-2 rounded-full bg-saffron px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-colors hover:bg-saffron-dark disabled:opacity-60"
      >
        {status === 'sending' ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
        {status === 'sending' ? t('Submitting…') : t('Submit & get ticket')}
      </button>
    </form>
  );
}
