// // import Link from 'next/link';
// // import { ChevronRight } from 'lucide-react';

// // export default function PageHeader({ eyebrow, title, crumb }) {
// //   return (
// //     <section className="relative overflow-hidden bg-ink py-20">
// //       <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-saffron/10 blur-3xl" />
// //       <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-banyan/10 blur-3xl" />
// //       <div className="relative mx-auto max-w-7xl px-6 text-left lg:px-8">
// //         <span className="section-eyebrow text-xs font-bold uppercase text-marigold">
// //           {eyebrow}
// //         </span>
// //         <h1 className="mt-3 line-clamp-2 font-display text-4xl font-extrabold text-ivory sm:text-5xl">
// //           {title}
// //         </h1>
// //         <div className="mt-4 flex items-center justify-start gap-1.5 text-sm text-ivory/60">
// //           <Link href="/" className="hover:text-ivory">
// //             Home
// //           </Link>
// //           <ChevronRight size={14} />
// //           <span className="text-marigold">{crumb}</span>
// //         </div>
// //       </div>
// //       <div className="absolute bottom-0 left-0 h-1.5 w-full bg-tricolor-thread" />
// //     </section>
// //   );
// // }

// import Link from "next/link";
// import { ChevronRight } from "lucide-react";

// export default function PageHeader({ eyebrow, title, crumb }) {
//   return (
//     <section className="relative overflow-hidden bg-gradient-to-r from-saffron via-ink to-banyan py-20">
//       <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-saffron/10 blur-3xl" />
//       <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-banyan/10 blur-3xl" />

//       <div className="relative mx-auto max-w-7xl px-6 text-left lg:px-8">
//         <span className="section-eyebrow text-xs font-bold uppercase text-marigold">
//           {eyebrow}
//         </span>

//         <h1 className="mt-3 line-clamp-2 font-display text-4xl font-extrabold text-ivory sm:text-5xl">
//           {title}
//         </h1>

//         <div className="mt-4 flex items-center justify-start gap-1.5 text-sm text-ivory/60">
//           <Link href="/" className="hover:text-ivory">
//             Home
//           </Link>

//           <ChevronRight size={14} />

//           <span className="text-marigold">{crumb}</span>
//         </div>
//       </div>

//       <div className="absolute bottom-0 left-0 h-1.5 w-full bg-tricolor-thread" />
//     </section>
//   );
// }


import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function PageHeader({ eyebrow, title, crumb }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-ink via-ink/95 to-banyan py-4">
      <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-saffron/10 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-banyan/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 text-left lg:px-8">
        <span className="section-eyebrow text-xs font-bold uppercase text-marigold">
          {eyebrow}
        </span>

        <h1 className="mt-3 py-2 line-clamp-2 font-body text-4xl font-extrabold sm:text-4xl">
          <span className="title-shine py-1.5">{title.toUpperCase()}</span>
        </h1>

        <div className="mt-4 flex items-center justify-start gap-1.5 text-sm text-ivory/60">
          <Link href="/" className="hover:text-ivory">
            Home
          </Link>

          <ChevronRight size={14} />

          <span className="text-marigold">{crumb}</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-tricolor-thread" />
    </section>
  );
}