import img1 from "../public/imaghej.avif";
import img2 from "../public/qwwww.png";
import { Facebook, Instagram, Twitter, XIcon, Youtube } from "lucide-react";

export const nav = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "About Party", href: "/about" },
      { label: "Our Leaders", href: "/about#leaders" },
      { label: "Biography", href: "/about#biography" },
    ],
  },
  {
    label: "Events",
    href: "/events",
    children: [
      { label: "All Events", href: "/events" },
      { label: "Rally Schedule", href: "/events#rally-schedule" },
      { label: "Conferences", href: "/events#conferences" },
    ],
  },
  {
    label: "Gallery",
    href: "/gallery",
    children: [
      { label: "Photo Gallery", href: "/gallery" },
      { label: "Video Gallery", href: "/gallery#videos" },
    ],
  },
  {
    label: "Blog",
    href: "/blog",
    children: [
      { label: "Latest News", href: "/blog" },
      { label: "Press Releases", href: "/blog#press" },
    ],
  },
  {
    label: "Wings",
    href: "/youth",
    children: [
      { label: "Youth Wing", href: "/youth" },
      { label: "Women Wing", href: "/women" },
      { label: "Report Your Problem", href: "/report-problem" },
      { label: "Track Ticket", href: "/track" },
      { label: "Resolution Tracker", href: "/resolution-tracker" },
    ],
  },
  {
    label: "Join Us",
    href: "/volunteer",
    // label: "Pages",
    // href: "#",
    // children: [
    //   { label: "Volunteer Form", href: "/volunteer" },
    //   { label: "Contribution", href: "/donate" },
    //   { label: "Manifesto", href: "/manifesto" },
    // ],
  },
  // {
  //   label: "Pages",
  //   href: "#",
  //   children: [
  //     { label: "Volunteer Form", href: "/volunteer" },
  //     { label: "Contribution", href: "/donate" },
  //     { label: "Manifesto", href: "/manifesto" },
  //   ],
  // },

  {
    label: "Contact",
    href: "/contact",
  },
];

export const stats = [
  { label: "Booth Karyakartas", value: 42500, suffix: "+" },
  { label: "Villages Reached", value: 3100, suffix: "+" },
  { label: "Public Rallies", value: 218, suffix: "" },
  { label: "Volunteers Enrolled", value: 96000, suffix: "+" },
];

export const pillars = [
  {
    title: "Rozgar — Employment First",
    desc: "One crore new jobs across manufacturing, digital services and rural enterprise within five years.",
    icon: "briefcase",
  },
  {
    title: "Kisan Samman",
    desc: "Guaranteed MSP on 22 crops, doubled crop insurance payouts and free soil-health testing every season.",
    icon: "wheat",
  },
  {
    title: "Shiksha for All",
    desc: "Free tablets and high-speed internet for every government-school student from class 6 onward.",
    icon: "graduation-cap",
  },
  {
    title: "Swasthya Suraksha",
    desc: "A free-diagnostics clinic within 5km of every household and 2 lakh new community health workers.",
    icon: "heart-pulse",
  },
  {
    title: "Mahila Shakti",
    desc: "Interest-free loans up to ₹5 lakh for women-led self-help groups and small businesses.",
    icon: "users",
  },
  {
    title: "Swachh evam Hariyali",
    desc: "10 crore native trees planted and zero-landfill waste systems in every municipal ward.",
    icon: "leaf",
  },
];

export const manifestoDetails = [
  {
    title: "Rozgar — Employment First",
    stat: "1 crore",
    statLabel: "new jobs in 5 years",
    points: [
      "District-level manufacturing clusters with tax holidays for first-time employers",
      "A digital-services training corps of 2 lakh certified instructors",
      "Startup seed fund of ₹10,000 crore for rural and semi-urban founders",
    ],
  },
  {
    title: "Kisan Samman",
    stat: "22",
    statLabel: "crops under guaranteed MSP",
    points: [
      "Legal guarantee on Minimum Support Price across 22 staple and cash crops",
      "Crop insurance payout timelines cut from 90 to 21 days",
      "Free soil-health testing every sowing season at the panchayat level",
    ],
  },
  {
    title: "Shiksha for All",
    stat: "100%",
    statLabel: "govt schools with digital access",
    points: [
      "Free tablets and subsidised high-speed internet from class 6 onward",
      "One qualified counsellor for every 500 students in government schools",
      "Vocational tracks in every district school by the second year",
    ],
  },
  {
    title: "Swasthya Suraksha",
    stat: "2 lakh",
    statLabel: "new community health workers",
    points: [
      "A free-diagnostics clinic within 5km of every household",
      "Mobile health vans covering every panchayat on a monthly rotation",
      "Subsidised insulin and BP medication at all primary health centres",
    ],
  },
  {
    title: "Mahila Shakti",
    stat: "₹5 lakh",
    statLabel: "interest-free loan ceiling",
    points: [
      "Interest-free loans for women-led self-help groups and small businesses",
      "Reserved procurement quotas for women-owned MSMEs in govt tenders",
      "Working-women hostels in every district headquarters",
    ],
  },
  {
    title: "Swachh evam Hariyali",
    stat: "10 crore",
    statLabel: "native trees to be planted",
    points: [
      "Zero-landfill waste segregation systems in every municipal ward",
      "Native-species afforestation drives led by local youth cooperatives",
      "River and lake rejuvenation for 200 identified water bodies",
    ],
  },
];

// export const leaders = [
//   {
//     name: 'Arvind Deshmukh',
//     role: 'National President',
//     bio: 'Two-term MLA from Nagpur North, known for turning around the state irrigation department and a grassroots padyatra covering 4,200 km.',
//     image: 'https://picsum.photos/seed/leader-arvind/600/700',
//   },
//   {
//     name: 'Sunita Rathore',
//     role: 'General Secretary',
//     bio: 'Former panchayat sarpanch who built India\'s largest women self-help group network across 900 villages in Rajasthan.',
//     image: 'https://picsum.photos/seed/leader-sunita/600/700',
//   },
//   {
//     name: 'Farhan Qureshi',
//     role: 'Youth Wing President',
//     bio: 'Ex-civil engineer leading the party\'s 18-25 outreach with over 8,000 campus units nationwide.',
//     image: 'https://picsum.photos/seed/leader-farhan/600/700',
//   },
//   {
//     name: 'Lata Iyer',
//     role: 'Spokesperson',
//     bio: 'Economist and columnist, the party\'s primary voice on television debates and policy explainers.',
//     image: 'https://picsum.photos/seed/leader-lata/600/700',
//   },
// ];

export const leaders = [
  {
    id: 1,
    name: "Mr. Dharam Pal",
    role: "National President",
    bio: "Two-term MLA from Nagpur North, known for turning around the state irrigation department and a grassroots padyatra covering 4,200 km.",
    image: "https://picsum.photos/seed/leader-arvind/600/700",
  },

  {
    id: 2,
    name: "Mrs. Surender Kaur",
    role: "Vice President",
    bio: "Two-term MLA from Nagpur North, known for turning around the state irrigation department and a grassroots padyatra covering 4,200 km.",
    image: "https://picsum.photos/seed/leader-arvind/600/700",
  },

  {
    id: 3,
    name: "Ms. Khushi",
    role: "General Secretary",
    bio: "Former panchayat sarpanch who built India's largest women self-help group network across 900 villages in Rajasthan.",
    image: "https://picsum.photos/seed/leader-sunita/600/700",
  },
  {
    id: 4,
    name: "Mrs. Namrata Suri",
    role: "Treasurer",
    bio: "Ex-civil engineer leading the party's 18-25 outreach with over 8,000 campus units nationwide.",
    image: "https://picsum.photos/seed/leader-farhan/600/700",
  },
];

export const events = [
  {
    title: "Jan Sabha — Lucknow Maidan",
    date: "2026-09-14",
    time: "4:00 PM",
    location: "Ambedkar Maidan, Lucknow",
    category: "Rally",
    image: "https://picsum.photos/seed/event-lucknow/700/500",
    desc: "A mega public rally addressing farmer distress and the new employment guarantee scheme.",
  },
  {
    title: "Yuva Samvad — Campus Tour",
    date: "2026-09-21",
    time: "11:00 AM",
    location: "Delhi University, North Campus",
    category: "Conference",
    image: "https://picsum.photos/seed/event-campus/700/500",
    desc: "An open-mic dialogue with first-time voters on jobs, startups and campus safety.",
  },
  {
    title: "Kisan Chaupal",
    date: "2026-09-28",
    time: "9:00 AM",
    location: "Karnal Grain Market, Haryana",
    category: "Rally",
    image: "https://picsum.photos/seed/event-kisan/700/500",
    desc: "Village-level roundtable on MSP guarantees and cold-storage infrastructure.",
  },
  {
    title: "Mahila Shakti Sammelan",
    date: "2026-10-05",
    time: "2:00 PM",
    location: "Town Hall, Pune",
    category: "Conference",
    image: "https://picsum.photos/seed/event-mahila/700/500",
    desc: "Launch of the interest-free loan scheme for women-led self-help groups.",
  },
  {
    title: "Manifesto Press Briefing",
    date: "2026-10-11",
    time: "5:30 PM",
    location: "Party Headquarters, New Delhi",
    category: "Conference",
    image: "https://picsum.photos/seed/event-press/700/500",
    desc: "National media briefing unveiling the full election manifesto and costed roadmap.",
  },
  {
    title: "Tiranga Padyatra Finale",
    date: "2026-10-19",
    time: "7:00 AM",
    location: "Marine Drive, Mumbai",
    category: "Rally",
    image: "https://picsum.photos/seed/event-padyatra/700/500",
    desc: "Closing leg of the 4,200 km foot march, culminating in a dawn tricolour rally.",
  },
];

export const blogPosts = [
  {
    title: "Why Our Employment Guarantee Is Different This Time",
    excerpt:
      "A district-by-district breakdown of how the one-crore-jobs pledge is costed, funded and tracked in public dashboards.",
    date: "2026-08-02",
    category: "Latest News",
    image: "https://picsum.photos/seed/blog-jobs/700/460",
    author: "Lata Iyer",
  },
  {
    title: "Inside the Kisan Chaupal Movement",
    excerpt:
      "Ground reporting from three states on how village-level grain committees are shaping our MSP policy.",
    date: "2026-07-24",
    category: "Latest News",
    image: "https://picsum.photos/seed/blog-kisan/700/460",
    author: "Field Desk",
  },
  {
    title: "Party Responds to Allegations on Irrigation Funds",
    excerpt:
      "An official statement with the complete audit trail of the Vidarbha irrigation project.",
    date: "2026-07-18",
    category: "Press Releases",
    image: "https://picsum.photos/seed/blog-press1/700/460",
    author: "Press Cell",
  },
  {
    title: "Youth Wing Crosses 8,000 Campus Units",
    excerpt:
      "A milestone update on student organising ahead of the autumn campus tour.",
    date: "2026-07-09",
    category: "Latest News",
    image: "https://picsum.photos/seed/blog-youth/700/460",
    author: "Farhan Qureshi",
  },
  {
    title: "Statement on the Election Commission's New Guidelines",
    excerpt:
      "Our full compliance note and the steps every booth-level agent must follow this season.",
    date: "2026-06-30",
    category: "Press Releases",
    image: "https://picsum.photos/seed/blog-press2/700/460",
    author: "Press Cell",
  },
  {
    title: "What 900 Self-Help Groups Taught Us About Rural Credit",
    excerpt: "Sunita Rathore on the data behind the Mahila Shakti loan scheme.",
    date: "2026-06-21",
    category: "Latest News",
    image: "https://picsum.photos/seed/blog-shg/700/460",
    author: "Sunita Rathore",
  },
];

// @/data/content.js

export const galleryPhotos = [
  {
    src: "https://images.unsplash.com/photo-1661534424056-6589e239546b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGluZGlhbiUyMGVsZWN0aW9ufGVufDB8fDB8fHww",
    caption: "Booth-Level Worker Convention & Public Rally",
    location: "Central Constituency",
    category: "Rallies",
  },
  {
    src: "https://images.unsplash.com/photo-1707922788250-0ce29dd3fca2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fGluZGlhbiUyMGVsZWN0aW9ufGVufDB8fDB8fHww",
    caption: "Jan Ashirwad Padyatra with Local Citizens",
    location: "District North",
    category: "Padyatra",
  },
  {
    src: "https://images.unsplash.com/photo-1774437777794-ac071017d306?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fGluZGlhbiUyMGVsZWN0aW9ufGVufDB8fDB8fHww",
    caption: "Youth Samvad and Employment Strategy Meeting",
    location: "Sector 4 Auditorium",
    category: "Youth",
  },
  {
    src: "https://images.unsplash.com/photo-1612511112842-f610f2dd4b86?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQ2fHxpbmRpYW4lMjBlbGVjdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    caption: "Core Committee Strategy & Booth Management",
    location: "Campaign Headquarters",
    category: "Meetings",
  },
  {
    src: "https://images.unsplash.com/photo-1722932581421-97fc3cc05188?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTc4fHxpbmRpYW4lMjBlbGVjdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    caption: "Mahila Shakti Sammelan and Ground Connect",
    location: "South Zone",
    category: "Rallies",
  },
  {
    src: "https://images.unsplash.com/photo-1632560957441-7fe921591ddc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzQ1fHxpbmRpYW4lMjBlbGVjdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    caption: "Door-to-Door Campaigning and Farmer Outreach",
    location: "Rural Belt",
    category: "Padyatra",
  },
];

export const galleryVideos = [
  {
    title: "Manifesto 2026 — Full Announcement",
    duration: "12:44",
    thumb: "https://picsum.photos/seed/vid1/700/420",
  },
  {
    title: "Kisan Chaupal Highlights",
    duration: "4:18",
    thumb: "https://picsum.photos/seed/vid2/700/420",
  },
  {
    title: "Yuva Samvad — Campus Tour Reel",
    duration: "6:02",
    thumb: "https://picsum.photos/seed/vid3/700/420",
  },
  {
    title: "Padyatra Finale — Marine Drive",
    duration: "9:37",
    thumb: "https://picsum.photos/seed/vid4/700/420",
  },
];

export const testimonials = [
  {
    quote:
      "The soil-health camp reached our village for the first time in a decade. My yield is up and my costs are finally predictable.",
    name: "Ramesh Patil",
    role: "Farmer, Vidarbha",
  },
  {
    quote:
      "The self-help loan let three of us open a stitching unit. We now employ nine more women from our block.",
    name: "Kavita Solanki",
    role: "Entrepreneur, Rajasthan",
  },
  {
    quote:
      "Our campus unit has grown from twelve students to over four hundred in two years, entirely on the jobs conversation.",
    name: "Devansh Rao",
    role: "Student Volunteer, Delhi",
  },
  {
    quote:
      "The free diagnostics van visits our panchayat every month now. We caught my father's condition early because of it.",
    name: "Anjali Bora",
    role: "Resident, Assam",
  },
];

export const timeline = [
  {
    year: "2018",
    text: "Party founded by a coalition of farmer unions and urban reform groups.",
  },
  {
    year: "2020",
    text: "First state assembly breakthrough, winning 46 seats on a jobs-and-irrigation platform.",
  },
  {
    year: "2022",
    text: "Mahila Shakti self-help loan pilot launches in 40 villages.",
  },
  {
    year: "2024",
    text: "National youth wing crosses one million registered members.",
  },
  {
    year: "2026",
    text: "Tiranga Padyatra covers 4,200 km ahead of the national election.",
  },
];

export const faqs = [
  {
    q: "How can I become a booth-level volunteer?",
    a: "Fill the Volunteer Form under Pages, choose your constituency, and our district coordinator will contact you within 48 hours.",
  },
  {
    q: "Where does my contribution actually go?",
    a: "Every rupee is logged against a public ledger — booth logistics, printed material, transport and venue costs. No contribution is used for the personal expenses of any candidate.",
  },
  {
    q: "Is there a membership fee?",
    a: "Basic membership is free. Optional annual patron contributions start at ₹500 and come with a digital membership card.",
  },
  {
    q: "Can non-resident Indians contribute or volunteer?",
    a: "Yes — NRIs can join our digital outreach wing and contribute within Election Commission-permitted limits.",
  },
];

// export const socialLinks = [
//   {
//     name: "Twitter",
//     icon: "https://img.icons8.com/ios/50/twitterx--v2.png",
//     url: "https://twitter.com/yourusername",
//   },
//   {
//     name: "Instagram",
//     icon: "https://img.icons8.com/ios/50/instagram-new--v1.png",
//     //icon: Instagram,
//     url: "https://instagram.com/yourusername",
//   },
//   {
//     name: "YouTube",
//     icon: "https://img.icons8.com/ios/50/youtube-play--v1.png",
//     //icon: Youtube,
//     url: "https://youtube.com/@yourusername",
//   },
//   {
//     name: "Facebook",
//     icon: "https://img.icons8.com/ios/50/facebook-new.png",
//     //icon: Facebook,
//     url: "https://facebook.com/yourusername",
//   },
// ];

export const socialLinks = [
  {
    name: "Twitter",
    icon: XIcon,
    url: "https://twitter.com/yourusername",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://instagram.com/yourusername",
  },
  {
    name: "YouTube",
    icon: Youtube,
    url: "https://youtube.com/@yourusername",
  },
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://facebook.com/yourusername",
  },
];