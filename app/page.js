import Hero from '@/components/Hero';
import MarqueeTicker from '@/components/MarqueeTicker';
import StatsSection from '@/components/StatsSection';
import PillarsSection from '@/components/PillarsSection';
import EventsSection from '@/components/EventsSection';
import GallerySection from '@/components/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import CtaBanner from '@/components/CtaBanner';

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeTicker />
      <StatsSection />
      <PillarsSection />
      <EventsSection />
      <GallerySection />
      {/* <TestimonialsSection /> */}
      <BlogSection />
      <CtaBanner />
    </>
  );
}
