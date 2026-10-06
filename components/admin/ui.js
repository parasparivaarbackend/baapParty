'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 px-4 py-8 backdrop-blur-sm">
      <div className={`w-full ${maxWidth} rounded-2xl bg-white shadow-card-hover`}>
        <div className="flex items-center justify-between border-b border-ink/8 px-6 py-4">
          <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', description, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      {description && <p className="text-sm text-ink-soft">{description}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60';
  const variants = {
    primary: 'bg-saffron text-white hover:bg-saffron-dark',
    secondary: 'border-2 border-ink/15 text-ink hover:border-ink',
    ghost: 'text-ink-soft hover:bg-ink/5',
    danger: 'bg-saffron-dark text-white hover:bg-red-700',
  };
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink/10 bg-white/50 px-6 py-16 text-center">
      {Icon && <Icon size={32} className="mb-3 text-ink-soft/50" />}
      <p className="font-display text-lg font-bold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-soft">{description}</p>}
    </div>
  );
}

export function Field({ label, error, children, hint }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-ink">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-soft/70">{hint}</p>}
      {error && <p className="mt-1.5 text-xs font-semibold text-saffron-dark">{error}</p>}
    </div>
  );
}

export const inputClass = (error) =>
  `w-full rounded-xl border-2 bg-ivory px-4 py-2.5 text-sm text-ink outline-none transition-colors ${
    error ? 'border-saffron-dark' : 'border-ink/10 focus:border-saffron'
  }`;

export function Badge({ children, tone = 'ink' }) {
  const tones = {
    ink: 'bg-ink/8 text-ink',
    saffron: 'bg-saffron/10 text-saffron-dark',
    banyan: 'bg-banyan/10 text-banyan',
    gray: 'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${tones[tone] || tones.ink}`}>
      {children}
    </span>
  );
}
