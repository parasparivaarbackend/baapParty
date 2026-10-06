// const SLOGANS = [
//   'Rozgar Sabka Adhikar',
//   'Kisan Ki Suraksha, Desh Ki Taraqqi',
//   'Har Ghar Shiksha, Har Gaon Swasthya',
//   'Mahila Shakti, Naya Bharat',
//   'Sankalp 2026 — Bharatiya Avijit Aawaz Party',
// ];

// export default function MarqueeTicker() {
//   const items = [...SLOGANS, ...SLOGANS];
//   return (
//     <div className="overflow-hidden border-y border-ink/10 bg-ink py-3">
//       <div className="marquee-track">
//         {items.map((s, i) => (
//           <span key={i} className="mx-6 flex items-center gap-3 whitespace-nowrap font-display text-sm font-bold uppercase tracking-wide text-ivory/90">
//             <span className="h-1.5 w-1.5 rounded-full bg-marigold" />
//             {s}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

const SLOGANS = [
  "Rozgar Sabka Adhikar",
  "Kisan Ki Suraksha, Desh Ki Taraqqi",
  "Har Ghar Shiksha, Har Gaon Swasthya",
  "Mahila Shakti, Naya Bharat",
  "Sankalp 2026 — Bharatiya Avijit Aawaz Party",
];

export default function MarqueeTicker() {
  const items = [...SLOGANS, ...SLOGANS];

  return (
    <div className="overflow-hidden border-y border-ink/10 bg-ink py-3">
      <div className="marquee-track flex w-max">
        {items.map((s, i) => (
          <span
            key={i}
            className="mx-6 flex items-center gap-3 whitespace-nowrap font-display text-sm font-bold uppercase tracking-wide text-ivory/90"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-marigold" />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}