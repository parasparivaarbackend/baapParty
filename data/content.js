import img1 from "../public/imaghej.avif";
import img2 from "../public/qwwww.png";
import { Facebook, Instagram, Twitter, XIcon, Youtube } from "lucide-react";

// data/content.js me nav array ko aise update karo
// =====================================================
// @/data/content.js me sirf `export const nav = [...]` ko
// is poore block se replace karo. Baaki file waisi hi rahegi.
// =====================================================
export const nav = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Us",
    href: "/about",
    // children: [
    //   { label: "About Party", href: "/about" },
    //   { label: "Our Ideology", href: "/about#leaders" },
    //   { label: "Biography", href: "/about#biography" },
    // ],
  },
  {
    label: "Wings",
    href: "/youth",
    children: [
      { label: "Organization", href: "/organization" },
      { label: "Youth Wing", href: "/youth" },
      { label: "Women Wing", href: "/women" },
      { label: "Report Your Problem", href: "/report-problem" },
      { label: "Track Ticket", href: "/track" },
      { label: "Resolution Tracker", href: "/resolution-tracker" },
    ],
  },

  // -----------------------------------------------------
  // MORE (desktop par mega dropdown, mobile par alag-alag accordion)
  // Is group me item add/remove karna ho to sirf yahin karo.
  // -----------------------------------------------------
  {
    label: "Explore",
    isMore: true,
    children: [
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
        label: "Blog",
        href: "/blog",
        children: [
          { label: "Latest News", href: "/blog" },
          {label: "Press Releases", href: "/blog#press",},
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
    ],
  },

  {
    label: "Join Us",
    href: "/volunteer",
  },
  {
    label: "Contact Us",
    href: "/contact",
  },
];
export const stats = [
  { label: "Booth Karyakartas", value: 42500, suffix: "+" },
  { label: "Villages Reached", value: 3100, suffix: "+" },
  { label: "Public Rallies", value: 218, suffix: "" },
  { label: "Volunteers Enrolled", value: 96000, suffix: "+" },
];


// export const leaders = [
//   {
//     name: 'Arvind Deshmukh',
//     role: 'National President',
//     bio: 'Two-term MLA from Nagpur North, known for turning around the state irrigation department and a grassroots padyatra covering 4,200 km.',
//     image: '/placeholders/portrait.svg',
//   },
//   {
//     name: 'Sunita Rathore',
//     role: 'General Secretary',
//     bio: 'Former panchayat sarpanch who built India\'s largest women self-help group network across 900 villages in Rajasthan.',
//     image: '/placeholders/portrait.svg',
//   },
//   {
//     name: 'Farhan Qureshi',
//     role: 'Youth Wing President',
//     bio: 'Ex-civil engineer leading the party\'s 18-25 outreach with over 8,000 campus units nationwide.',
//     image: '/placeholders/portrait.svg',
//   },
//   {
//     name: 'Lata Iyer',
//     role: 'Spokesperson',
//     bio: 'Economist and columnist, the party\'s primary voice on television debates and policy explainers.',
//     image: '/placeholders/portrait.svg',
//   },
// ];

export const leaders = [
  {
    id: 1,
    name: "Mr. Dharam Pal",
    role: "National President",
    bio: "Two-term MLA from Nagpur North, known for turning around the state irrigation department and a grassroots padyatra covering 4,200 km.",
    image: "/placeholders/portrait.svg",
  },

  {
    id: 2,
    name: "Mrs. Surender Kaur",
    role: "Vice President",
    bio: "Two-term MLA from Nagpur North, known for turning around the state irrigation department and a grassroots padyatra covering 4,200 km.",
    image: "/placeholders/portrait.svg",
  },

  {
    id: 3,
    name: "Ms. Khushi",
    role: "General Secretary",
    bio: "Former panchayat sarpanch who built India's largest women self-help group network across 900 villages in Rajasthan.",
    image: "/placeholders/portrait.svg",
  },
  {
    id: 4,
    name: "Mrs. Namrata Suri",
    role: "Treasurer",
    bio: "Ex-civil engineer leading the party's 18-25 outreach with over 8,000 campus units nationwide.",
    image: "/placeholders/portrait.svg",
  },
];



// @/data/content.js



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

// data/faqs.js
export const faqs = [
  {
    q: "What is the objective of Bharatiya Avijit Aawaz Party?",
    a: "To work on the people's issues and to build capable leadership, in order to make India safe, prosperous, just, and dignified.",
  },
  {
    q: "What are the 18 chapters of BAAP?",
    a: "They are the party's ideas and proposals based on 18 important social, economic, democratic, and administrative challenges facing the country.",
  },
  {
    q: "Is the party against any caste or religion?",
    a: "No. The party is not against any caste, religion, or community. The party is against caste-based discrimination, injustice, exploitation, and social inequality.",
  },
  {
    q: "What is Paras Bhai Ji's role in the party?",
    a: "Paras Bhai Ji's proposed role is that of a guide (Margdarshak). He does not aspire to any formal party post.",
  },
  {
    q: "Who can join the party?",
    a: "Citizens who believe in the values of the Constitution, democracy, equality, discipline, and public service, and who are willing to follow the organization's rules.",
  },
  {
    q: "Where will the party start?",
    a: "The proposed organizational start is from Delhi, followed by a plan to expand in Punjab.",
  },
  {
    q: "How can one get party membership?",
    a: "One can apply through the membership form on the website. Membership will be subject to the organization's prescribed rules and verification.",
  },
  {
    q: "Have all of the party's schemes been implemented?",
    a: "No. The 18 chapters given on the website are the party's proposed ideas and policy suggestions. Their implementation will require detailed policy, financial resources, and legal process.",
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
    icon: Twitter,
    url: "https://x.com/BAAPHIND",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/baaphind/",
  },
  {
    name: "YouTube",
    icon: Youtube,
    url: "https://www.youtube.com/channel/UCRSNH9sVA8yjv28H3xJaSQg",
  },
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://www.facebook.com/profile.php?id=61596647020017",
  },
];

