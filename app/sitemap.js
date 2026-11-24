export default function sitemap() {
  const baseUrl = 'https://bharatiyaavijitaawazparty.com';
  const lastMod = new Date();
  const pdfDate = new Date('2026-11-23T16:12:54+00:00');

  const manifestoSlugs = [
    'good-nutrition-for-every-child',
    'affordable-cooking-gas-for-poor-housewives',
    'transparency-in-elections-above-all',
    'employment-for-youth-in-the-nations-security',
    'skilled-india-self-reliant-india',
    'respect-for-faith-opposition-to-superstition-and-exploitation',
    'end-fraud-in-the-name-of-jobs-abroad',
    'a-new-chapter-of-safety-in-india',
    'safety-of-sons-and-the-trust-of-parents',
    'drug-free-youth-safe-india',
    'transparency-and-accountability-of-peoples-representatives',
    'a-voice-in-parliament-for-every-section-of-india',
    'reform-of-police-forensics-and-the-justice-system',
    'health-and-mental-health',
    'respect-and-economic-security-for-farmers',
    'respect-and-protection-for-the-elderly',
    'ending-corruption-and-nepotism',
    'end-casteism-and-discrimination'
  ];

  return [
    // मुख्य पेज
    { url: `${baseUrl}/`, lastModified: lastMod, priority: 1.0 },
    { url: `${baseUrl}/volunteer`, lastModified: lastMod, priority: 0.8 },
    { url: `${baseUrl}/manifesto`, lastModified: lastMod, priority: 0.8 },
    { url: `${baseUrl}/events`, lastModified: lastMod, priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: lastMod, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: lastMod, priority: 0.8 },
    { url: `${baseUrl}/report-problem`, lastModified: lastMod, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: lastMod, priority: 0.8 },
    { url: `${baseUrl}/youth`, lastModified: lastMod, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: lastMod, priority: 0.8 },
    { url: `${baseUrl}/resolution-tracker`, lastModified: lastMod, priority: 0.8 },
    { url: `${baseUrl}/documents`, lastModified: lastMod, priority: 0.8 },

    // मैनिफेस्टो सब-पेज
    ...manifestoSlugs.map((slug) => ({
      url: `${baseUrl}/manifesto/${slug}`,
      lastModified: lastMod,
      priority: 0.64,
    })),

    // अन्य पेज
    { url: `${baseUrl}/track`, lastModified: lastMod, priority: 0.64 },
    { url: `${baseUrl}/report-problem?wing=youth`, lastModified: lastMod, priority: 0.64 },
    { url: `${baseUrl}/youth/education`, lastModified: lastMod, priority: 0.64 },
    { url: `${baseUrl}/youth/jobs-skills`, lastModified: lastMod, priority: 0.64 },
    { url: `${baseUrl}/youth/entrepreneurship`, lastModified: lastMod, priority: 0.64 },
    { url: `${baseUrl}/youth/sports`, lastModified: lastMod, priority: 0.64 },
    { url: `${baseUrl}/youth/policy`, lastModified: lastMod, priority: 0.64 },
    { url: `${baseUrl}/youth/teams`, lastModified: lastMod, priority: 0.64 },

    // PDF फाइलें
    { url: `${baseUrl}/Party%20Savidhan.pdf`, lastModified: pdfDate, priority: 0.64 },
    { url: `${baseUrl}/18%20Points.pdf`, lastModified: pdfDate, priority: 0.64 },
  ];
}