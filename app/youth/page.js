import WingLanding from '@/components/WingLanding';
import { WINGS } from '@/data/wings';

// ✅ Youth पेज के Meta Tags
export const metadata = {
  title: "BAAP Party Youth Wing | Education, Jobs & Skills",
  description: "The BAAP Party Youth Wing for guidance on education, scholarships, jobs, skills and sports. Report youth issues, track tickets or volunteer.",
  keywords: [
    "BAAP Party",
    "Bharatiya Avijit Aawaz Party Youth Wing",
    "BAAP Party Youth Wing",
    "Youth Wing India",
    "Youth Support India",
    "Youth Employment Support"
  ],
};

export default function YouthPage() {
  return <WingLanding wing={WINGS.youth} />;
}