import WingLanding from '@/components/WingLanding';
import { WINGS } from '@/data/wings';

// ✅ Women पेज के Meta Tags
export const metadata = {
  title: "BAAP Party Women Wing | Safety & Women Support",
  description: "BAAP Party Women Wing for women's safety, legal information, education, employment, health resources, self-help groups and grievance support.",
  keywords: [
    "BAAP Party Women Wing",
    "Bharatiya Avijit Aawaz Party Women Wing",
    "BAAP Women Wing",
    "Women Wing of BAAP Party",
    "BAAP Party Mahila Wing",
    "BAAP Party Women Support",
    "Women Safety and Support",
    "Women Empowerment Programme",
    "Women Legal Information and Support",
    "Women Employment Support",
    "Girls Education and Scholarship",
    "Women Self Help Groups",
    "Women Grievance Support",
    "Women Health Resources"
  ],
};

export default function WomenPage() {
  return <WingLanding wing={WINGS.women} />;
}