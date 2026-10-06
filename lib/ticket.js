import crypto from 'crypto';

// Server-only. Client components import from '@/lib/grievanceConfig' instead.
export * from './grievanceConfig';

// No 0/O/1/I so a ticket read out over the phone is hard to mishear.
const RANDOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function randomTicketPart(len = 8) {
  const bytes = crypto.randomBytes(len);
  return Array.from(bytes, (b) => RANDOM_ALPHABET[b % RANDOM_ALPHABET.length]).join('');
}

