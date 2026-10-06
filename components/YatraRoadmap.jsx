"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { LEADER } from "@/data/party";
export default function YatraRoadmap() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.3"] });
    const pathLength = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
    const stops = LEADER.timeline;
    const stepY = 150;
    const svgHeight = stops.length * stepY + 60;
    return (
      <section ref={ref} className="relative mx-auto max-w-3xl px-4 py-4">
        <h2 className="mb-2 text-center font-display text-3xl font-bold text-maroon">
          The Yatra So Far
        </h2>
        <p className="mb-12 text-center font-body text-ink/60">
          A path of seva, from Punjab to a movement across Bharat
        </p>

        <div className="relative">
          <svg
            width="100%"
            height={svgHeight}
            viewBox={`0 0 200 ${svgHeight}`}
            preserveAspectRatio="none"
            className="absolute left-1/2 top-0 -translate-x-1/2"
          >
            <path
              d={`M100,10 ${stops.map((_, i) => `Q ${i % 2 === 0 ? 170 : 30},${(i + 0.5) * stepY} 100,${(i + 1) * stepY}`).join(" ")}`}
              stroke="#F0DDBB"
              strokeWidth={4}
              fill="none"
            />
            <motion.path
              d={`M100,10 ${stops.map((_, i) => `Q ${i % 2 === 0 ? 170 : 30},${(i + 0.5) * stepY} 100,${(i + 1) * stepY}`).join(" ")}`}
              stroke="#E4571E"
              strokeWidth={4}
              fill="none"
              style={{ pathLength }}
            />
          </svg>

          <div className="relative flex flex-col" style={{ height: svgHeight }}>
            {stops.map((s, i) => (
              <div
                key={i}
                className="absolute flex w-full items-center"
                style={{
                  top: (i + 1) * stepY - 40,
                  justifyContent: i % 2 === 0 ? "flex-end" : "flex-start",
                }}
              >
                <div
                  className={`w-[46%] ${i % 2 === 0 ? "text-right pr-6" : "text-left pl-6"}`}
                >
                  <p className="font-display text-xl font-bold text-saffron">
                    {s.year}
                  </p>
                  <p className="font-body text-sm text-ink/70">{s.event}</p>
                </div>
              </div>
            ))}
            {stops.map((_, i) => (
              <span
                key={`dot-${i}`}
                className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-banyan shadow"
                style={{ top: (i + 1) * stepY - 8 }}
              />
            ))}
          </div>
        </div>
      </section>
    );
}
