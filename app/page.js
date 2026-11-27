import Hero from '@/components/Hero';
import MarqueeTicker from '@/components/MarqueeTicker';
import StatsSection from '@/components/StatsSection';
import PillarsSection from '@/components/PillarsSection';
import EventsSection from '@/components/EventsSection';
import GallerySection from '@/components/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import CtaBanner from '@/components/CtaBanner';
import MsgSection from '@/components/MsgSection';

// ✅ होम पेज के अपडेटेड Meta Tags
export const metadata = {
  title: "Bharatiya Avijit Aawaz Party | Political Party for Public Welfare in Delhi & Punjab, India",
  description: "Bharatiya Avijit Aawaz Party (BAAP) Janta Party works to empower people, promote social justice, and build a stronger, inclusive future across Delhi and Punjab.",
  keywords: [
    "Bharatiya Avijit Aawaz Party",
    "BAAP Party",
    "BAAP Janta Party India",
    "Bharatiya Avijit Awaz Party",
    "BAAP Party official website",
    "Avijit Aawaz Party",
    "BAAP Party Delhi",
    "BAAP Party leadership",
    "BAAP Political Party",
    "Join BAAP Party",
    "Political Party in India"
  ],
  // ✅ Favicon yahan add karein
  icons: {
    icon: '/favicon.ico',
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeTicker />
      <StatsSection />
      <MsgSection />
      <PillarsSection />
      <EventsSection />
      <GallerySection />
      {/* <TestimonialsSection /> */}
      <BlogSection />
      <CtaBanner />
    </>
  );
}