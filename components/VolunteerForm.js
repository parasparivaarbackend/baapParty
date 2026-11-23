'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileCheck2, Loader2, Send, ShieldCheck, Upload, X } from 'lucide-react';
import { ID_PROOF_TYPES } from '@/lib/idProof';
import { PARTY } from '@/data/party';
import { useAuth } from '@/context/AuthContext';
import { namesOf } from '@/lib/personName';
import LimitedTextarea from '@/components/LimitedTextarea';
import FormPreview from '@/components/FormPreview';
import { useLang } from '@/context/LanguageContext';

const INTERESTS = ['Booth Management', 'Social Media', 'Ground Campaigning', 'Fundraising', 'Content & Design', 'Legal & Compliance'];

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  constituency: '',
  interests: [],
  message: '',
  isAdult: false,
  idProofType: '',
};

export default function VolunteerForm({ onSuccessChange }) {
  const { t, isHindi } = useLang();
  const [form, setForm] = useState(EMPTY_FORM);
  const [idProof, setIdProof] = useState(null); // { publicId, resourceType, format, fileName }
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(false);
  const [sendError, setSendError] = useState('');
  const { user } = useAuth();

  // Let the page know when the success card is showing (the page then hides the left-hand content).
  useEffect(() => {
    onSuccessChange?.(status === 'success');
  }, [status, onSuccessChange]);

  // Logged-in members: fill name, email and mobile automatically (they can still change them).
  // Visitors who are not logged in simply type everything themselves.
  useEffect(() => {
    if (!user) return;
    const n = namesOf(user);
    setForm((f) => ({
      ...f,
      firstName: f.firstName || n.firstName,
      lastName: f.lastName || n.lastName,
      email: f.email || user.email || '',
      phone: f.phone || String(user.phone || '').replace(/\D/g, '').slice(-10),
    }));
  }, [user]);

  // Upload the ID proof as soon as it is chosen. It is stored privately - only the party admin can open it.
  const onProofFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErrors((er) => ({ ...er, idProof: undefined }));
    if (file.size > 5 * 1024 * 1024) return setErrors((er) => ({ ...er, idProof: t('File is larger than 5 MB') }));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/volunteer-upload', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed. Please try again.');
      setIdProof({ ...data.idProof, fileName: file.name });
    } catch (err) {
      setErrors((er) => ({ ...er, idProof: t(err.message) }));
    } finally {
      setUploading(false);
    }
  };

  const onAdultChange = (checked) => {
    setForm((f) => ({ ...f, isAdult: checked, ...(checked ? {} : { idProofType: '' }) }));
    if (!checked) setIdProof(null);
    setErrors((er) => ({ ...er, isAdult: undefined, idProofType: undefined, idProof: undefined }));
  };

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
    if (!form.firstName.trim()) e.firstName = t('Please enter your first name');
    if (!form.lastName.trim()) e.lastName = t('Please enter your last name');
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = t('Enter a valid 10-digit mobile number');
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = t('Enter a valid email address');
    if (!form.constituency.trim()) e.constituency = t('Please tell us your constituency');
    if (!form.isAdult) e.isAdult = t('Please confirm that you are 18 or above to volunteer');
    if (form.isAdult && !form.idProofType) e.idProofType = t('Choose which ID you are uploading');
    if (form.isAdult && !idProof) e.idProof = t('Please upload your 18+ ID proof');
    return e;
  };

  // Step 1: check the form, then show the preview. Nothing is sent yet.
  const handleSubmit = (ev) => {
    ev.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length > 0) return;
    if (uploading) return setErrors({ idProof: t('Please wait - your file is still uploading') });
    setSendError('');
    setPreview(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: the visitor confirmed the preview - send it.
  const confirmSend = async () => {
    setStatus('loading');
    setSendError('');
    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          idProof: idProof ? { publicId: idProof.publicId, resourceType: idProof.resourceType, format: idProof.format } : null,
        }),
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
        className="mx-auto w-full max-w-xl rounded-3xl border border-banyan/20 bg-banyan/5 p-10 text-center"
      >
        {/* Party logo (replaces the green tick) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/email-logo.png"
          alt={t('{name} logo', { name: isHindi ? PARTY.hindiName : PARTY.fullName })}
          width={84}
          height={84}
          className="mx-auto h-20 w-20 rounded-full bg-white object-contain p-1 shadow-card"
        />
        <h3 className="mt-5 font-display text-2xl font-extrabold text-ink">
          {t('Welcome to the B.A.A.P. family,')}
          <br />
          <span className="mt-2 inline-block rounded-xl bg-marigold/25 px-4 py-1 text-4xl font-black text-saffron-dark sm:text-5xl">
            {form.firstName} {form.lastName}!
          </span>
        </h3>
        <p className="mt-2 text-ink-soft">
          {t('Your district coordinator will call you on {phone} within 48 hours. Keep an eye on your inbox at {email} too.', { phone: form.phone, email: form.email })}
        </p>
        <button
          type="button"
          onClick={() => {
            const n = namesOf(user);
            setForm({
              ...EMPTY_FORM,
              firstName: n.firstName,
              lastName: n.lastName,
              email: user?.email || '',
              phone: String(user?.phone || '').replace(/\D/g, '').slice(-10),
            });
            setIdProof(null);
            setPreview(false);
            setStatus('idle');
          }}
          className="mt-6 rounded-full border-2 border-ink/15 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
        >
          {t('Submit Another Response')}
        </button>
      </motion.div>
    );
  }

  if (preview) {
    return (
      <FormPreview
        rows={[
          ['Name', `${form.firstName.trim()} ${form.lastName.trim()}`.trim()],
          ['Mobile', form.phone.trim()],
          ['Email', form.email.trim()],
          ['Constituency / City', form.constituency.trim()],
          ['Where you would help', form.interests.map((i) => t(i)).join(', ')],
          ['Age declaration', t('I am 18 years or older')],
          ['ID proof', form.idProofType && idProof ? `${t(form.idProofType)} - ${idProof.fileName}` : ''],
        ]}
        longText={form.message.trim()}
        loading={status === 'loading'}
        error={sendError}
        onEdit={() => setPreview(false)}
        onConfirm={confirmSend}
        confirmLabel="Confirm & Join"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-ink/8 bg-white p-8 shadow-card sm:p-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="First Name" error={errors.firstName}>
          <input
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            placeholder={t("Ramesh")}
            className={inputClass(errors.firstName)}
          />
        </Field>
        <Field label="Last Name" error={errors.lastName}>
          <input
            type="text"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            placeholder={t("Kumar")}
            className={inputClass(errors.lastName)}
          />
        </Field>
        <Field label="Mobile Number" error={errors.phone}>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
            placeholder={t("98XXXXXXXX")}
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
            placeholder={t("e.g. Nagpur North")}
            className={inputClass(errors.constituency)}
          />
        </Field>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-bold text-ink">{t('Where would you like to help?')}</p>
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
                {t(i)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 18+ declaration - ticking it opens the ID-proof upload */}
      <div className={`mt-6 rounded-2xl border-2 p-5 transition-colors ${errors.isAdult ? 'border-saffron-dark' : 'border-ink/10'}`}>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.isAdult}
            onChange={(e) => onAdultChange(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-saffron"
          />
          <span>
            <b>{t('I am 18 years or older (an adult) and I am happy to volunteer for the party of my own free will.')}</b>
            <span className="mt-0.5 block text-xs text-ink-soft/80">{t('Only adults can join as volunteers.')}</span>
          </span>
        </label>
        {errors.isAdult && <p className="mt-2 text-xs font-semibold text-saffron-dark">{t(errors.isAdult)}</p>}

        {form.isAdult && (
          <div className="mt-5 space-y-4 border-t border-ink/10 pt-5">
            <p className="flex items-center gap-2 text-sm font-bold text-ink">
              <ShieldCheck size={17} className="text-banyan" /> {t('Upload your 18+ proof')}
            </p>
            <Field label="Which ID are you uploading?" error={errors.idProofType}>
              <select
                value={form.idProofType}
                onChange={(e) => setForm((f) => ({ ...f, idProofType: e.target.value }))}
                className={inputClass(errors.idProofType)}
              >
                <option value="">{t('Select an ID')}</option>
                {ID_PROOF_TYPES.map((idt) => (
                  <option key={idt} value={idt}>{t(idt)}</option>
                ))}
              </select>
            </Field>

            <div>
              <label className="mb-2 block text-sm font-bold text-ink">{t('ID proof (PDF, JPG or PNG, up to 5 MB)')}</label>
              {idProof ? (
                <div className="flex items-center justify-between gap-3 rounded-xl bg-banyan/10 px-4 py-3 text-sm text-ink">
                  <span className="flex min-w-0 items-center gap-2">
                    <FileCheck2 size={17} className="shrink-0 text-banyan" />
                    <span className="truncate font-semibold">{idProof.fileName}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIdProof(null)}
                    aria-label={t('Remove file')}
                    className="shrink-0 text-ink-soft hover:text-saffron-dark"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-sm ${
                    errors.idProof ? 'border-saffron-dark' : 'border-ink/15 hover:border-saffron'
                  }`}
                >
                  {uploading ? <Loader2 size={16} className="animate-spin text-ink-soft" /> : <Upload size={16} className="text-ink-soft" />}
                  <span className="text-ink-soft">{uploading ? t('Uploading...') : t('Choose a file...')}</span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={onProofFile} disabled={uploading} className="hidden" />
                </label>
              )}
              {errors.idProof && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{t(errors.idProof)}</p>}
              <p className="mt-1.5 text-xs text-ink-soft/70">
                {t("Used only to confirm your age. It is stored privately and can be opened only by the party's admin team.")}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-ink">{t('Message')}</label>
        <LimitedTextarea
          rows={4}
          value={form.message}
          onChange={(message) => setForm((f) => ({ ...f, message }))}
          placeholder={t("Tell us about any past organising experience...")}
          className="w-full rounded-xl border-2 border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-saffron"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading' || uploading}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-saffron px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark disabled:opacity-70 sm:w-auto"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={18} className="animate-spin" /> {t('Submitting...')}
          </>
        ) : (
          <>
            <Send size={17} /> {t('Preview & Continue')}
          </>
        )}
      </button>
    </form>
  );
}

function Field({ label, error, children }) {
  const { t } = useLang();
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-ink">{t(label)}</label>
      {children}
      {error && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{t(error)}</p>}
    </div>
  );
}

function inputClass(error) {
  return `w-full rounded-xl border-2 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors ${
    error ? 'border-saffron-dark' : 'border-ink/10 focus:border-saffron'
  }`;
}
