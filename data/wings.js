// Content for the Youth Wing and Women Wing pages. Edit freely — this is
// placeholder copy describing the help desks; review wording with the party
// before publishing, and only list services you can actually deliver.
//
// Each section gets its own page at /<wing>/<slug> unless it has an `href`.
// `category` pre-selects the category in the "Report Your Problem" form and must
// match a name in lib/grievanceConfig.js CATEGORIES.
export const WINGS = {
  youth: {
    slug: 'youth',
    name: 'Youth Wing',
    hindi: 'युवा प्रकोष्ठ',
    tagline: 'Education, jobs, skills and sports — a help desk for the youth of Bharat.',
    intro:
      'The Youth Wing is a public-service desk for young people. Tell us the problem you are facing, get a ticket number, and follow what happens next.',
    accent: 'saffron',
    reportLabel: 'Report a Youth problem',
    sections: [
      {
        slug: 'education', icon: 'GraduationCap', title: 'Education & Scholarship Help',
        desc: 'Guidance on scholarships, admissions and exam-related issues.',
        category: 'Education / Scholarship',
        points: [
          'Information on scholarship schemes and how to apply',
          'Help understanding admission, fee or exam notices',
          'Referral to the right office if an application is stuck or wrongly rejected',
        ],
      },
      {
        slug: 'jobs-skills', icon: 'Briefcase', title: 'Jobs & Skills',
        desc: 'Information on skill programmes, job notices and career guidance.',
        category: 'Jobs & Skills',
        points: [
          'Pointers to skill-training and apprenticeship programmes',
          'Help reading recruitment notices and eligibility rules',
          'Referral if a recruitment or result process looks unfair or delayed',
        ],
      },
      {
        slug: 'entrepreneurship', icon: 'Rocket', title: 'Entrepreneurship',
        desc: 'Pointers on schemes, loans and starting a small business.',
        category: 'Entrepreneurship / Loan Help',
        points: [
          'Information on self-employment and start-up loan schemes',
          'Help with where and how to apply',
          'Referral if a loan or subsidy application is stuck',
        ],
      },
      {
        slug: 'sports', icon: 'Trophy', title: 'Sports',
        desc: 'Support for local players, trials, grounds and sports facilities.',
        category: 'Sports',
        points: [
          'Information on trials, tournaments and sports schemes',
          'Raising problems with local grounds and facilities',
          'Connecting players with district youth teams',
        ],
      },
      { slug: 'grievance', icon: 'MessageSquareWarning', title: 'Youth Grievance', desc: 'Raise a problem and track it with a ticket number.', href: '/report-problem?wing=youth' },
      { slug: 'events', icon: 'CalendarDays', title: 'Youth Events', desc: 'Camps, meetings and awareness programmes near you.', href: '/events' },
      {
        slug: 'policy', icon: 'FileText', title: 'Policy & Research',
        desc: 'Youth-focused ideas and policy notes from the wing.',
        category: 'Other Youth Issue',
        points: [
          'Read the party manifesto and its youth commitments',
          'Share a suggestion or idea for youth policy with us',
          'Join the wing as a volunteer to take part in policy discussions',
        ],
        links: [{ label: 'Read the Manifesto', href: '/manifesto' }, { label: 'Send a suggestion', href: '/contact' }],
      },
      { slug: 'teams', icon: 'MapPin', title: 'District Youth Teams', desc: 'Find and contact your district youth team.', href: '/youth/teams' },
    ],
  },
  women: {
    slug: 'women',
    name: 'Women Wing',
    hindi: 'महिला प्रकोष्ठ',
    tagline: 'Safety, information and support — a private, respectful help desk for women.',
    intro:
      'The Women Wing is a support desk. It offers information and referrals; it does not replace the police, courts or emergency services. Sensitive matters have a separate confidential pathway.',
    accent: 'banyan',
    reportLabel: 'Report a Women Wing problem',
    sections: [
      {
        slug: 'safety', icon: 'ShieldCheck', title: 'Safety & Support', emergency: true,
        desc: 'Safety information and help reaching the right authority.',
        category: 'Safety & Harassment',
        points: [
          'Information on whom to contact for safety and harassment issues',
          'Help reaching the right authority or helpline',
          'A confidential option for sensitive matters',
        ],
      },
      {
        slug: 'legal-help', icon: 'Scale', title: 'Legal Information & Referral', legalNote: true,
        desc: 'General information and referral to legal-aid services (not legal advice).',
        category: 'Legal Information / Referral',
        points: [
          'General information on rights and processes, in plain language',
          'Referral to legal-aid services',
          'Help preparing the facts you will need to explain your problem',
        ],
      },
      {
        slug: 'employment', icon: 'Briefcase', title: 'Employment & Entrepreneurship',
        desc: 'Livelihood schemes, skill training and small-business pointers.',
        category: 'Employment & Entrepreneurship',
        points: [
          'Information on livelihood and self-employment schemes',
          'Pointers to skill-training programmes',
          'Referral if an application or loan is stuck',
        ],
      },
      {
        slug: 'education', icon: 'GraduationCap', title: 'Education',
        desc: 'Scholarships, admissions and support for girls to continue studying.',
        category: 'Education',
        points: [
          'Information on scholarships and schemes for girls and women',
          'Help with admission and fee problems',
          'Referral if a girl is being stopped from continuing her studies',
        ],
      },
      {
        slug: 'health', icon: 'HeartPulse', title: 'Health Resources',
        desc: 'Information on health services and camps in your area.',
        category: 'Health',
        points: [
          'Information on government health services and schemes',
          'Pointers to health camps and awareness programmes',
          'Referral if you are denied a service you are entitled to',
        ],
        note: 'This page gives general information only. For medical help, please contact a doctor or hospital.',
      },
      {
        slug: 'shg', icon: 'Users', title: 'SHG & Community Programmes',
        desc: 'Self-help groups and community initiatives near you.',
        category: 'SHG / Community Programme',
        points: [
          'Information on forming and joining self-help groups',
          'Pointers to training and credit-linkage schemes',
          'Connecting groups with district women teams',
        ],
      },
      { slug: 'grievance', icon: 'MessageSquareWarning', title: 'Women Grievance', desc: 'Raise a problem; use the confidential option for sensitive matters.', href: '/report-problem?wing=women' },
      { slug: 'teams', icon: 'MapPin', title: 'District Women Teams', desc: 'Find and contact your district women team.', href: '/women/teams' },
    ],
  },
};

export const TICKET_STEPS = ['Submitted', 'Verified', 'Referred', 'Follow-up', 'Resolved / Pending'];

export const sectionHref = (wing, s) => s.href || `/${wing.slug}/${s.slug}`;
