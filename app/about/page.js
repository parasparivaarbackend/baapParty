// import Image from "next/image";
// import PageHeader from "@/components/PageHeader";
// import LeadersSection from "@/components/LeadersSection";
// import TimelineSection from "@/components/TimelineSection";
// import CtaBanner from "@/components/CtaBanner";
// import { CheckCircle2 } from "lucide-react";

// export const metadata = {
//   title: "About Us — Bharatiya Avijit Aawaz Party",
// };

// const values = [
//   "Constitutional values and respect for democratic institutions",
//   "Justice and equality for every citizen",
//   "Safety, dignity and protection of citizens",
//   "Transparent and accountable governance",
//   "Education, skills and employment opportunities",
//   "Inclusive economic and social development",
//   "Social harmony and respect for India’s diversity",
//   "Environmental protection and sustainable development",
// ];

// export default function AboutPage() {
//   return (
//     <>
//       <PageHeader
//         eyebrow="Know Us"
//         // title="Bharatiya Avijit Aawaz Party (BAAP)"
//         title={
//           <>
//             {"Bharatiya Avijit Aawaz Party".toUpperCase()}
//             <br />
//             {/* B.A.A.P. */}
//           </>
//         }
//         crumb="About Us"
//       />

//       <section id="party" className="scroll-mt-24 bg-ivory py-12">
//         <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:px-8">
//           <div className="relative">
//             <div className="relative aspect-[4/4.5] w-full max-w-md overflow-hidden rounded-[2.5rem] border-8 border-white shadow-card-hover">
//               <Image
//                 src="https://picsum.photos/seed/about-party/900/1100"
//                 alt="Party workers at a village meeting"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className="absolute -bottom-6 -right-4 hidden w-52 rounded-2xl bg-banyan p-5 text-white shadow-card sm:block">
//               <p className="font-display text-3xl font-extrabold">2018</p>
//               <p className="text-xs text-white/80">
//                 Founded by farmer unions &amp; reform groups
//               </p>
//             </div>
//           </div>

//           <div>
//             {/* <span className="section-eyebrow text-xl font-bold uppercase text-black">
//               <u>About the B.A.A.P. Party</u>
//             </span> */}

//             <h2 className="mt-5 font-display text-2xl font-extrabold text-ink sm:text-1xl">
//               <u>About the B.A.A.P. Party</u>
//             </h2>

//             {/* <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
//               Bharatiya Avijit Aawaz Party (BAAP) */}
//             {/* Born From the Fields, Built for the Nation */}
//             {/* </h2> */}
//             <p className="mt-5 text-ink-soft leading-relaxed">
//               {/* Bharatiya Avijit Aawaz Party */}
//               <b>Bharatiya Avijit Aawaz Party (BAAP)</b> is a political
//               organization committed to the values of the{" "}
//               <b>
//                 Constitution of India, democracy, rule of law, national unity
//                 and integrity, equality of opportunity, and social justice.
//               </b>{" "}
//               <br></br>BAAP seeks to work towards a society where every
//               citizen’s <b>dignity, safety, rights and opportunities</b> are
//               respected and protected. The party’s stated vision focuses on
//               inclusive social and economic development, transparent and
//               accountable governance, and responsible participation of citizens
//               in democratic and public life. <br></br> The party places
//               particular emphasis on
//               <b>
//                 {" "}
//                 women’s dignity and safety, equality, social harmony, youth
//                 empowerment, education, employment, farmers and workers’
//                 welfare, and access to quality healthcare and essential public
//                 services.
//               </b>
//               <br></br> BAAP also aims to address issues such as{" "}
//               <b>drug abuse, harmful superstitions and fraudulent practices</b>{" "}
//               through awareness, prevention, rehabilitation, scientific temper
//               and community participation.
//             </p>

//             <h2 className="mt-3 font-display text-2xl font-extrabold text-ink sm:text-1xl">
//               Our Approach
//               {/* Born From the Fields, Built for the Nation */}
//             </h2>

//             <p className="text-ink-soft leading-relaxed">
//               BAAP believes that effective public service requires:
//             </p>

//             <ul className="mt-5 space-y-3">
//               {values.map((v) => (
//                 <li
//                   key={v}
//                   className="flex items-start gap-3 text-sm text-ink-soft"
//                 >
//                   <CheckCircle2
//                     size={19}
//                     className="mt-0.5 shrink-0 text-banyan"
//                   />
//                   {v}
//                 </li>
//               ))}
//             </ul>

//             <h2 className="mt-5 font-display text-2xl font-extrabold text-ink sm:text-1xl">
//               Our Commitment
//             </h2>

//             <p className="mt-3 text-ink-soft leading-relaxed">
//               BAAP seeks to build an organization with grassroots participation
//               and a structured presence from the{" "}
//               <b>
//                 national level to State/UT, District, Parliamentary
//                 Constituency, Assembly Constituency, Block/Mandal, Ward/Local
//                 Unit and Booth Level.
//               </b>
//               <br></br>The party’s stated objective is to contribute to a more
//               <b> inclusive, accountable and citizen-centric India,</b> while
//               upholding the constitutional principles that form the foundation
//               of the country’s democratic system.
//             </p>
//           </div>
//         </div>
//       </section>

//       <LeadersSection />
//       <TimelineSection />
//       <CtaBanner />
//     </>
//   );
// }


import ZoomableImage from "@/components/ZoomableImage";
import PageHeader from "@/components/PageHeader";
import LeadersSection from "@/components/LeadersSection";
import TimelineSection from "@/components/TimelineSection";
import CtaBanner from "@/components/CtaBanner";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About Us — Bharatiya Avijit Aawaz Party",
};

const values = [
  "Constitutional values and respect for democratic institutions",
  "Justice and equality for every citizen",
  "Safety, dignity and protection of citizens",
  "Transparent and accountable governance",
  "Education, skills and employment opportunities",
  "Inclusive economic and social development",
  "Social harmony and respect for India’s diversity",
  "Environmental protection and sustainable development",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Know Us"
        // title={
        //   <>
        //     {"Bharatiya Avijit Aawaz Party"}
        //     <br />
        //   </>
        // }
        title="Bharatiya Avijit Aawaz Party"
        crumb="About Us"
      />

      {/* ================= ABOUT PARTY SECTION ================= */}
      <section id="party" className="scroll-mt-24 bg-ivory py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* ================= ROW 1 ================= */}
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* IMAGE 1 */}
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border-8 border-white shadow-card-hover">
                <ZoomableImage
                  src="https://picsum.photos/seed/about-party-1/1000/750"
                  alt="Party workers at a village meeting"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Founded Badge */}
              <div className="absolute -bottom-5 -right-5 hidden rounded-2xl bg-banyan px-6 py-4 text-white shadow-card sm:block">
                <p className="font-display text-3xl font-extrabold">2018</p>

                <p className="text-xs text-white/80">
                  Founded by farmer unions &amp; reform groups
                </p>
              </div>
            </div>

            {/* CONTENT 1 */}
            <div>
              <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
                <span className="border-b-4 border-banyan pb-2">
                  About The B.A.A.P. Party
                </span>
              </h2>

              {/* Extra spacing below heading */}
              <div className="mb-8" />

              <p className="text-ink-soft leading-relaxed">
                <b>Bharatiya Avijit Aawaz Party (BAAP)</b> is a political
                organization committed to the values of the{" "}
                <b>
                  Constitution of India, democracy, rule of law, national unity
                  and integrity, equality of opportunity, and social justice.
                </b>
              </p>

              <p className="mt-5 text-ink-soft leading-relaxed">
                BAAP seeks to work towards a society where every citizen’s{" "}
                <b>dignity, safety, rights and opportunities</b> are respected
                and protected. The party’s stated vision focuses on inclusive
                social and economic development, transparent and accountable
                governance, and responsible participation of citizens in
                democratic and public life.
              </p>

              <p className="mt-5 text-ink-soft leading-relaxed">
                The party places particular emphasis on{" "}
                <b>
                  women’s dignity and safety, equality, social harmony, youth
                  empowerment, education, employment, farmers and workers’
                  welfare, and access to quality healthcare and essential public
                  services.
                </b>
              </p>

              <p className="mt-5 text-ink-soft leading-relaxed">
                BAAP also aims to address issues such as{" "}
                <b>
                  drug abuse, harmful superstitions and fraudulent practices
                </b>{" "}
                through awareness, prevention, rehabilitation, scientific temper
                and community participation.
              </p>
            </div>
          </div>

          {/* ================= ROW 2 ================= */}
          <div className="mt-24 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* CONTENT 2 */}
            <div className="order-2 lg:order-1">
              <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
                <span className="border-b-4 border-banyan pb-2">
                  Our Approach
                </span>
              </h2>

              {/* Extra spacing below heading */}
              <div className="mb-8" />

              <p className="text-ink-soft leading-relaxed">
                BAAP believes that effective public service requires:
              </p>

              <ul className="mt-6 space-y-4">
                {values.map((value) => (
                  <li
                    key={value}
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft"
                  >
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-banyan"
                    />
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* IMAGE 2 */}
            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border-8 border-white shadow-card-hover">
                <ZoomableImage
                  src="https://picsum.photos/seed/about-party-2/1000/750"
                  alt="Community participation"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* ================= ROW 3 ================= */}
          <div className="mt-24 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* IMAGE 3 */}
            <div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border-8 border-white shadow-card-hover">
                <ZoomableImage
                  src="https://picsum.photos/seed/about-party-3/1000/750"
                  alt="Community and public service"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* CONTENT 3 */}
            <div>
              <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
                <span className="border-b-4 border-banyan pb-2">
                  Our Commitment
                </span>
              </h2>

              {/* Extra spacing below heading */}
              <div className="mb-8" />

              <p className="text-ink-soft leading-relaxed">
                BAAP seeks to build an organization with grassroots
                participation and a structured presence from the{" "}
                <b>
                  national level to State/UT, District, Parliamentary
                  Constituency, Assembly Constituency, Block/Mandal, Ward/Local
                  Unit and Booth Level.
                </b>
              </p>

              <p className="mt-5 text-ink-soft leading-relaxed">
                The party’s stated objective is to contribute to a more{" "}
                <b>inclusive, accountable and citizen-centric India,</b> while
                upholding the constitutional principles that form the foundation
                of the country’s democratic system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OTHER SECTIONS ================= */}

      <LeadersSection />

      <TimelineSection />

      <CtaBanner />
    </>
  );
}
