"use client";

import { useState } from "react";
import {
  Landmark,
  Users,
  UserRound,
  Wallet,
  Mic,
  Network,
  MapPin,
  Building2,
  UsersRound,
  ChevronDown,
  ChevronUp,
  BriefcaseBusiness,
  ShieldCheck,
  BookOpen,
  Zap,
} from "lucide-react";

const nationalRoles = [
  { title: "National General Secretary", icon: Users },
  { title: "National Secretary", icon: BriefcaseBusiness },
  { title: "National Treasurer", icon: Wallet },
  { title: "National Spokesperson", icon: Mic },
  { title: "National Organization In-charge", icon: Network },
];

const levels = [
  {
    title: "State Leadership",
    subtitle: "State President & State Executive",
    icon: MapPin,
    items: ["State President", "State Executive"],
  },
  {
    title: "District Leadership",
    subtitle: "District President & District Executive",
    icon: Building2,
    items: ["District President", "District Executive"],
  },
  {
    title: "Grassroots Leadership",
    subtitle: "Assembly to Booth Level",
    icon: UsersRound,
    items: [
      "Assembly Constituency In-charge",
      "Mandal Office-bearers",
      "Ward Office-bearers",
      "Booth Office-bearers",
    ],
  },
];

const wings = [
  { title: "Women's Wing", subtitle: "Empowering Women", icon: Users },
  { title: "Youth Wing", subtitle: "Building Young Leaders", icon: Zap },
  {
    title: "Social & Policy Cell",
    subtitle: "Research & Public Welfare",
    icon: BookOpen,
  },
];

function SectionCard({ title, subtitle, icon: Icon, items }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left sm:p-5"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
            <Icon size={23} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="shrink-0 text-orange-600" />
        ) : (
          <ChevronDown className="shrink-0 text-orange-600" />
        )}
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-3 border-t border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-slate-200 bg-white p-4 text-center text-sm font-semibold text-slate-700 transition hover:border-orange-400 hover:text-orange-600"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrganizationStructure() {
  return (
    <section className="relative isolate overflow-hidden bg-transparent px-4 py-16 sm:px-6 lg:py-8">
      
      <div className="relative mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-700">
            <ShieldCheck size={15} />
            Our Organization
          </span>

          <h2 className="mt-5 text-3xl font-extrabold text-slate-900 sm:text-5xl">
            Organizational <span className="text-orange-600">Structure</span>
          </h2>

          <h3 className="mt-3 text-xl font-bold text-slate-600 sm:text-2xl">
            संगठनात्मक संरचना
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            A strong organizational framework built on leadership, unity,
            accountability and public welfare.
          </p>
        </div>

        {/* National President */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-[#142B49] to-[#203F65] p-7 text-center text-white shadow-xl sm:p-9">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-orange-300/40 bg-white/10">
              <Landmark size={32} className="text-orange-400" />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-300">
              National Leadership
            </p>

            <h3 className="mt-3 text-2xl font-extrabold sm:text-3xl">
              National President
            </h3>

            <p className="mt-2 text-sm text-blue-100">
              Head of the Organization
            </p>
          </div>

          <div className="h-12 w-0.5 bg-orange-400" />

          {/* National Executive */}
          <div className="w-full max-w-2xl rounded-xl border-2 border-orange-200 bg-white p-5 text-center shadow-md sm:p-7">
            <div className="mb-3 inline-flex rounded-full bg-orange-50 p-3 text-orange-600">
              <UsersRound size={27} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              National Executive
            </h3>
            <p className="mt-2 text-sm font-medium text-orange-600">
              21-Member National Core Team
            </p>
          </div>

          <div className="h-12 w-0.5 bg-orange-400" />

          {/* National Office Bearers */}
          <div className="w-full">
            <h3 className="mb-5 text-center text-lg font-bold text-slate-900">
              National Office Bearers
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nationalRoles.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.title}
                    className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
                  >
                    <div className="rounded-lg bg-orange-50 p-3 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                      <Icon size={23} />
                    </div>
                    <h4 className="text-sm font-bold leading-6 text-slate-800">
                      {role.title}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lower Leadership Levels */}
          <div className="my-12 h-12 w-0.5 bg-orange-400" />

          <div className="w-full space-y-5">
            {levels.map((level) => (
              <SectionCard key={level.title} {...level} />
            ))}
          </div>

          {/* Special Wings */}
          <div className="mt-16 w-full">
            <div className="mb-7 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                Dedicated Departments
              </span>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Special Wings & Cells
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {wings.map((wing) => {
                const Icon = wing.icon;
                return (
                  <div
                    key={wing.title}
                    className="group rounded-2xl border border-orange-100 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl"
                  >
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                      <Icon size={27} />
                    </div>

                    <h4 className="text-lg font-extrabold text-slate-900">
                      {wing.title}
                    </h4>

                    <p className="mt-2 text-sm text-slate-500">
                      {wing.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
