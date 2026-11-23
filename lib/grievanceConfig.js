// Shared (client + server safe) grievance constants and helpers.
// Two-letter codes used inside ticket numbers, e.g. YW-UP-LKO-000124
export const STATE_CODES = {
  'Andhra Pradesh': 'AP', 'Arunachal Pradesh': 'AR', Assam: 'AS', Bihar: 'BR',
  Chhattisgarh: 'CG', Goa: 'GA', Gujarat: 'GJ', Haryana: 'HR', 'Himachal Pradesh': 'HP',
  Jharkhand: 'JH', Karnataka: 'KA', Kerala: 'KL', 'Madhya Pradesh': 'MP', Maharashtra: 'MH',
  Manipur: 'MN', Meghalaya: 'ML', Mizoram: 'MZ', Nagaland: 'NL', Odisha: 'OD', Punjab: 'PB',
  Rajasthan: 'RJ', Sikkim: 'SK', 'Tamil Nadu': 'TN', Telangana: 'TS', Tripura: 'TR',
  'Uttar Pradesh': 'UP', Uttarakhand: 'UK', 'West Bengal': 'WB',
  'Andaman and Nicobar Islands': 'AN', Chandigarh: 'CH',
  'Dadra and Nagar Haveli and Daman and Diu': 'DN', Delhi: 'DL',
  'Jammu and Kashmir': 'JK', Ladakh: 'LA', Lakshadweep: 'LD', Puducherry: 'PY',
};

// Optional friendly district codes. Anything not listed falls back to the first
// three letters of the district name (e.g. "Ghaziabad" -> GHA).
export const DISTRICT_CODE_OVERRIDES = {
  lucknow: 'LKO',
  ghaziabad: 'GZB',
  'gautam buddha nagar': 'GBN',
  'new delhi': 'NDL',
  'north west delhi': 'NWD',
};

export const WING_PREFIX = { youth: 'YW', women: 'WW', general: 'GR' };

export const STATUSES = ['Submitted', 'Verified', 'Referred', 'Follow-up', 'Resolved', 'Pending'];

// Steps shown on the public tracker (Pending is a side-state, shown separately).
export const STATUS_FLOW = ['Submitted', 'Verified', 'Referred', 'Follow-up', 'Resolved'];

export const CATEGORIES = {
  youth: [
    'Education / Scholarship', 'Jobs & Skills', 'Entrepreneurship / Loan Help', 'Sports',
    'Exam / Paper / Admission Issue', 'Drugs / Substance Abuse Help', 'Other Youth Issue',
  ],
  women: [
    'Safety & Harassment', 'Domestic / Family Issue', 'Legal Information / Referral',
    'Employment & Entrepreneurship', 'Education', 'Health', 'SHG / Community Programme',
    'Other Women Issue',
  ],
  general: [
    'Roads / Water / Electricity', 'Health Services', 'Ration / Welfare Scheme',
    'Police / Administration', 'Other',
  ],
};

export function normalizeDistrict(raw) {
  return String(raw || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase())
    .slice(0, 60);
}

export function districtCode(district) {
  const key = String(district || '').trim().toLowerCase();
  if (DISTRICT_CODE_OVERRIDES[key]) return DISTRICT_CODE_OVERRIDES[key];
  const letters = key.replace(/[^a-z]/g, '').toUpperCase();
  return (letters + 'XXX').slice(0, 3);
}

export function normalizeTicketId(raw) {
  return String(raw || '').trim().toUpperCase().replace(/\s+/g, '');
}
