"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import LeadersSection from "@/components/LeadersSection";
import TimelineSection from "@/components/TimelineSection";
import CtaBanner from "@/components/CtaBanner";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

const values = [
  "Transparent, publicly audited campaign finance",
  "Booth-level democracy — every ticket decided by local karyakartas",
  "Zero tolerance for defection after election tickets are issued",
  "Manifesto commitments tracked on a public dashboard, quarter by quarter",
];

const sectionsData = [
  {
    id: 1,
    eyebrow: "About the Party — Part 1",
    title: "Born From the Fields, Built for the Nation",
    description:
      "Bharatiya Avijit Aawaz Party began as a coalition of farmer unions and urban reform groups who believed governance had drifted away from everyday concerns — jobs, school quality and the price of grain.",
    image: "https://picsum.photos/seed/about-party1/900/1100",
  },
  {
    id: 2,
    eyebrow: "Our Core Mission — Part 2",
    title: "Empowering Local Communities Directly",
    description:
      "Eight years and four state elections later, we remain the only national party where every candidate is first vetted by local booth committees before the central leadership signs off.",
    image: "https://picsum.photos/seed/about-party2/900/1100",
  },
  {
    id: 3,
    eyebrow: "Future Vision — Part 3",
    title: "Accountability at Every Level of Governance",
    description:
      "We track every single policy promise on an open public dashboard. Transparency is not just a promise; it is built into our daily operational code.",
    image: "https://picsum.photos/seed/about-party3/900/1100",
  },
  {
    id: 4,
    eyebrow: "Grassroots Power — Part 4",
    title: "Decentralized Political Representation",
    description:
      "Our governance model ensures every district has a direct voice in ticket allocation, manifesto drafting, and budget allocation monitoring.",
    image: "https://picsum.photos/seed/about-party4/900/1100",
  },
];

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedInput, setTypedInput] = useState("");

  const handleNext = () => {
    if (currentIndex < sectionsData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Keyboard Navigation Support (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  return (
    <>
      <PageHeader
        eyebrow="Know Us"
        title="About Bharatiya Avijit Aawaz Party"
        crumb="About Us"
      />

      {/* Main Section */}
      <section
        id="party"
        className="scroll-mt-24 bg-ivory py-16 overflow-hidden"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative">
          {/* Main Card Container */}
          <div className="relative min-h-[580px]">
            {/* Sliding Content Track */}
            <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-gray-100">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {sectionsData.map((section) => (
                  <div
                    key={section.id}
                    className="w-full shrink-0 grid grid-cols-1 items-center gap-10 p-8 sm:p-12 lg:grid-cols-2"
                  >
                    {/* LEFT: Image */}
                    <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border-4 border-gray-100 shadow-md mx-auto lg:mx-0">
                      <Image
                        src={section.image}
                        alt={section.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>

                    {/* RIGHT: Content */}
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <span className="section-eyebrow text-xs font-bold uppercase text-saffron tracking-wider">
                          {section.eyebrow}
                        </span>
                        <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
                          {section.title}
                        </h2>
                        <p className="mt-5 text-ink-soft leading-relaxed text-base">
                          {section.description}
                        </p>

                        <ul className="mt-6 space-y-3">
                          {values.map((v) => (
                            <li
                              key={v}
                              className="flex items-start gap-3 text-sm text-ink-soft"
                            >
                              <CheckCircle2
                                size={19}
                                className="mt-0.5 shrink-0 text-banyan"
                              />
                              {v}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SIDE FLOATING BUTTONS */}

            {/* Previous Button (Image Edge) */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous Section"
              className="absolute -left-4 sm:-left-7 top-1/2 -translate-y-1/2 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-saffron hover:text-white disabled:opacity-0 disabled:pointer-events-none border border-gray-200"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next Button (Content Edge) */}
            <button
              onClick={handleNext}
              disabled={currentIndex === sectionsData.length - 1}
              aria-label="Next Section"
              className="absolute -right-4 sm:-right-7 top-1/2 -translate-y-1/2 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-saffron text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-ink disabled:opacity-0 disabled:pointer-events-none"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Bottom Bar: Interactive Dots + Command Input */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200/60 pt-6">
            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {sectionsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-8 bg-saffron"
                      : "w-2.5 bg-gray-300"
                  }`}
                  aria-label={`Go to section ${idx + 1}`}
                />
              ))}
              <span className="ml-3 text-xs font-semibold uppercase text-gray-400">
                {currentIndex + 1} / {sectionsData.length}
              </span>
            </div>

            {/* Type Command Box */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type 'next' & press Enter..."
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = typedInput.trim().toLowerCase();
                    if (val === "next") handleNext();
                    if (val === "prev") handlePrev();
                    setTypedInput("");
                  }
                }}
                className="w-52 rounded-xl border border-gray-300 px-4 py-2 text-xs outline-none focus:border-saffron focus:ring-1 focus:ring-saffron bg-white shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <LeadersSection />
      <TimelineSection />
      <CtaBanner />
    </>
  );
}
