'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Landmark, QrCode } from 'lucide-react';
import { PAYMENT } from '@/data/party';
import PaymentProofForm from '@/components/PaymentProofForm';
import { useLang } from '@/context/LanguageContext';

const TABS = [
  { id: 'qr', label: 'Scan QR Code', icon: QrCode },
  { id: 'bank', label: 'Bank Details', icon: Landmark },
];

export default function DonateOptions() {
  const { t: tr } = useLang();
  const [tab, setTab] = useState('qr');

  return (
    <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-card sm:p-9">
      <div role="tablist" className="grid grid-cols-2 gap-2 rounded-full bg-ivory p-1.5">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`flex items-center justify-center gap-2 rounded-full px-3 py-3 text-xs font-bold uppercase tracking-wide transition-colors sm:text-sm ${
                active ? 'bg-saffron text-white shadow-card' : 'text-ink-soft hover:text-saffron'
              }`}
            >
              <t.icon size={17} /> {tr(t.label)}
            </button>
          );
        })}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-8">
        {tab === 'qr' ? <QrPanel /> : <BankPanel />}
      </motion.div>

      <PaymentProofForm />
    </div>
  );
}

function QrPanel() {
  const { t } = useLang();
  const upiUrl = `upi://pay?${new URLSearchParams({ pa: PAYMENT.upiId, pn: PAYMENT.payeeName, cu: 'INR' }).toString()}`;
  const src = PAYMENT.qrImage || `/api/upi-qr?data=${encodeURIComponent(upiUrl)}`;

  return (
    <div className="text-center">
      <p className="text-sm font-semibold text-ink">{t('Scan with any UPI app to contribute')}</p>
      <div className="mx-auto mt-5 w-fit rounded-3xl border-2 border-dashed border-saffron/40 bg-white p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={t("UPI payment QR code")} width={260} height={260} className="h-64 w-64 object-contain" />
      </div>
      <p className="mt-4 text-xs text-ink-soft">{t('Google Pay · PhonePe · Paytm · BHIM · any bank app')}</p>

      <div className="mx-auto mt-6 max-w-sm">
        <CopyRow label={t("UPI ID")} value={PAYMENT.upiId} />
      </div>
    </div>
  );
}

function BankPanel() {
  const { t } = useLang();
  const b = PAYMENT.bank;
  const rows = [
    ['Account Holder Name', b.accountHolder],
    ['Bank Name', b.bankName],
    ['Branch', b.branch],
    ['Account Number', b.accountNumber],
    ['IFSC Code', b.ifsc],
    ['Account Type', b.accountType],
  ];
  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-ink">{t('Transfer via NEFT / RTGS / IMPS')}</p>
      <div className="space-y-3">
        {rows.map(([label, value]) => (
          <CopyRow key={label} label={t(label)} value={value} />
        ))}
      </div>
    </div>
  );
}

function CopyRow({ label, value }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable - ignore */
    }
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-ink/8 bg-ivory px-4 py-3 text-left">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/70">{label}</p>
        <p className="mt-0.5 break-words font-display text-base font-bold text-ink">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={t('Copy {label}', { label })}
        className="shrink-0 rounded-full p-2 text-ink-soft transition-colors hover:bg-white hover:text-saffron"
      >
        {copied ? <Check size={17} className="text-banyan" /> : <Copy size={17} />}
      </button>
    </div>
  );
}
