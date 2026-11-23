'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileCheck2, Loader2, Send, Upload, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { namesOf, joinName } from '@/lib/personName';
import { useLang } from '@/context/LanguageContext';

const METHODS = [
  { id: 'upi', label: 'UPI / QR Code' },
  { id: 'bank', label: 'Bank Transfer' },
];

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const emptyForm = () => ({ name: '', amount: '', method: 'upi', paymentDate: todayStr(), transactionId: '' });

// "I have paid" form: the donor tells us the payment details and uploads a screenshot.
// The screenshot is stored privately; only the admin can open it from the Contributions page.
export default function PaymentProofForm() {
  const { t } = useLang();
  const [form, setForm] = useState(emptyForm);
  const [shot, setShot] = useState(null); // { publicId, resourceType, format, fileName }
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const [open, setOpen] = useState(false); // details are asked only after the upload button is clicked
  const [errors, setErrors] = useState({});
  const [sendError, setSendError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const n = namesOf(user);
    setForm((f) => ({ ...f, name: f.name || joinName(n.firstName, n.lastName) }));
  }, [user]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErrors((er) => ({ ...er, shot: undefined }));
    if (file.size > 5 * 1024 * 1024) return setErrors((er) => ({ ...er, shot: 'File is larger than 5 MB' }));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/contribution-upload', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed. Please try again.');
      setShot({ ...data.screenshot, fileName: file.name });
    } catch (err) {
      setErrors((er) => ({ ...er, shot: err.message }));
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!(Number(form.amount) > 0)) e.amount = 'Enter the amount you paid';
    if (!form.paymentDate) e.paymentDate = 'Choose the payment date';
    if (!shot) e.shot = 'Please upload your payment screenshot';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length) return;
    if (uploading) return setErrors({ shot: 'Please wait - your file is still uploading' });
    setStatus('loading');
    setSendError('');
    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          amount: Number(form.amount),
          method: form.method,
          paymentDate: form.paymentDate,
          transactionId: form.transactionId.trim(),
          screenshot: { publicId: shot.publicId, resourceType: shot.resourceType, format: shot.format },
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-3xl border border-banyan/20 bg-banyan/5 p-8 text-center"
      >
        <CheckCircle2 size={44} className="mx-auto text-banyan" />
        <h3 className="mt-4 font-display text-xl font-extrabold text-ink">{t('Thank you, {name}!', { name: form.name.trim().split(' ')[0] })}</h3>
        <p className="mt-2 text-sm text-ink-soft">
          {t('We have received your payment details and screenshot. Our team will verify and record your contribution.')}
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(emptyForm());
            setShot(null);
            setOpen(false);
            setStatus('idle');
          }}
          className="mt-5 rounded-full border-2 border-ink/15 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
        >
          {t('Submit another')}
        </button>
      </motion.div>
    );
  }

  if (!open) {
    return (
      <div className="mt-8 border-t border-ink/10 pt-8 text-center">
        <h3 className="font-display text-lg font-extrabold text-ink">{t('Already paid? Upload your payment screenshot')}</h3>
        <p className="mt-1 text-xs text-ink-soft">{t('Share your payment details so we can record your contribution.')}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-saffron px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark"
        >
          <Upload size={17} /> {t('Upload Payment Screenshot')}
        </button>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={submit}
      noValidate
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-8 border-t border-ink/10 pt-8"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-extrabold text-ink">{t('Already paid? Upload your payment screenshot')}</h3>
          <p className="mt-1 text-xs text-ink-soft">{t('Fill in the details below so we can record your contribution.')}</p>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label={t("Close form")} className="shrink-0 rounded-full p-1.5 text-ink-soft hover:bg-ink/5 hover:text-ink">
          <X size={18} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name}>
          <input
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder={t("Your full name")}
            className={inputClass(errors.name)}
          />
        </Field>
        <Field label="Amount (₹)" error={errors.amount}>
          <input
            type="number"
            inputMode="decimal"
            min="1"
            value={form.amount}
            onChange={(e) => set('amount', e.target.value)}
            placeholder={t("e.g. 2100")}
            className={inputClass(errors.amount)}
          />
        </Field>
        <Field label="Payment Method">
          <select value={form.method} onChange={(e) => set('method', e.target.value)} className={inputClass()}>
            {METHODS.map((m) => (
              <option key={m.id} value={m.id}>{t(m.label)}</option>
            ))}
          </select>
        </Field>
        <Field label="Date of Payment" error={errors.paymentDate}>
          <input
            type="date"
            max={todayStr()}
            value={form.paymentDate}
            onChange={(e) => set('paymentDate', e.target.value)}
            className={inputClass(errors.paymentDate)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Transaction ID">
            <input
              type="text"
              value={form.transactionId}
              maxLength={60}
              onChange={(e) => set('transactionId', e.target.value)}
              placeholder={t("UTR / UPI reference number")}
              className={inputClass()}
            />
          </Field>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-bold text-ink">{t('Payment screenshot (JPG, PNG or PDF, up to 5 MB)')}</label>
        {shot ? (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-banyan/10 px-4 py-3 text-sm text-ink">
            <span className="flex min-w-0 items-center gap-2">
              <FileCheck2 size={17} className="shrink-0 text-banyan" />
              <span className="truncate font-semibold">{shot.fileName}</span>
            </span>
            <button type="button" onClick={() => setShot(null)} aria-label={t("Remove file")} className="shrink-0 text-ink-soft hover:text-saffron-dark">
              <X size={16} />
            </button>
          </div>
        ) : (
          <label
            className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-sm ${
              errors.shot ? 'border-saffron-dark' : 'border-ink/15 hover:border-saffron'
            }`}
          >
            {uploading ? <Loader2 size={16} className="animate-spin text-ink-soft" /> : <Upload size={16} className="text-ink-soft" />}
            <span className="text-ink-soft">{uploading ? t('Uploading...') : t('Choose a file...')}</span>
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={onFile} disabled={uploading} className="hidden" />
          </label>
        )}
        {errors.shot && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{t(errors.shot)}</p>}
      </div>

      {sendError && <p className="mt-4 text-sm font-semibold text-saffron-dark">{t(sendError)}</p>}

      <button
        type="submit"
        disabled={status === 'loading' || uploading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-saffron px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark disabled:opacity-70"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={18} className="animate-spin" /> {t('Submitting...')}
          </>
        ) : (
          <>
            <Send size={17} /> {t('Submit Payment Details')}
          </>
        )}
      </button>
    </motion.form>
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
