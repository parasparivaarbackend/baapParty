"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  HandCoins,
  HeartHandshake,
  LayoutDashboard,
  Loader2,
  MessageSquare,
  Pencil,
  LifeBuoy,
  Printer,
  Save,
  User,
  X,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { PARTY } from "@/data/party";
import { useAuth } from "@/context/AuthContext";
import { namesOf } from "@/lib/personName";
import { useLang } from "@/context/LanguageContext";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "My Profile", icon: User },
  { id: "messages", label: "Complaints & Queries", icon: MessageSquare },
  { id: "tickets", label: "My Tickets", icon: LifeBuoy },
  { id: "contributions", label: "Contributions", icon: HandCoins },
  { id: "volunteer", label: "Volunteer", icon: HeartHandshake },
];

const fmtDate = (d, locale = "en-IN") =>
  d
    ? new Date(d).toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
const fmtMoney = (n, locale = "en-IN") => `₹${Number(n || 0).toLocaleString(locale)}`;

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLang();
  const { refresh } = useAuth();
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/user/dashboard", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/login?from=/dashboard");
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load");
      setData(json);
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <PageHeader
        eyebrow={t("Member Area")}
        title={t("My Dashboard")}
        crumb={t("Dashboard")}
      />

      <section className="bg-paper py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-32 text-ink-soft">
              <Loader2 className="animate-spin" size={28} />
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-card">
              <p className="font-semibold text-saffron-dark">{t(error)}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  load();
                }}
                className="mt-5 rounded-full bg-saffron px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white"
              >
                {t("Try again")}
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-lg font-bold text-ink sm:text-xl">
                {t("Namaste, {name}", { name: data.profile.firstName || data.profile.name })} 🙏
              </p>

              {/* Tabs */}
              <div className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
                  {TABS.map((tb) => (
                    <button
                      key={tb.id}
                      type="button"
                      onClick={() => setTab(tb.id)}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                        tab === tb.id
                          ? "bg-saffron text-white shadow-card"
                          : "bg-white text-ink-soft hover:text-saffron"
                      }`}
                    >
                      <tb.icon size={15} />
                      {t(tb.label)}
                    </button>
                  ))}
                </div>
              </div>

              {tab === "overview" && <Overview data={data} goTo={setTab} />}
              {tab === "profile" && (
                <Profile
                  profile={data.profile}
                  onSaved={async () => {
                    await Promise.all([load(), refresh()]);
                  }}
                />
              )}
              {tab === "messages" && (
                <Messages items={data.messages} stats={data.stats} />
              )}
              {tab === "tickets" && <Tickets items={data.tickets || []} />}
              {tab === "contributions" && (
                <Contributions items={data.contributions} stats={data.stats} />
              )}
              {tab === "volunteer" && <Volunteers items={data.volunteers} />}
            </>
          )}
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Overview: membership card + quick stats                             */
/* ------------------------------------------------------------------ */
function Overview({ data, goTo }) {
  const { t, locale } = useLang();
  const { profile, membership, stats } = data;

  const cards = [
    {
      label: t("Total Contributed"),
      value: fmtMoney(stats.totalContributed, locale),
      sub: t("{count} contribution(s)", { count: stats.contributionCount }),
      tab: "contributions",
      icon: HandCoins,
    },
    {
      label: t("Complaints Raised"),
      value: stats.complaintCount,
      sub: t("View status"),
      tab: "messages",
      icon: MessageSquare,
    },
    {
      label: t("Queries Sent"),
      value: stats.queryCount,
      sub: t("View status"),
      tab: "messages",
      icon: MessageSquare,
    },
    {
      label: t("Volunteer Applications"),
      value: stats.volunteerCount,
      sub: t("View details"),
      tab: "volunteer",
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <MembershipCard profile={profile} membership={membership} />
      </div>

      <div className="grid grid-cols-2 content-start gap-4 lg:col-span-2">
        {cards.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => goTo(c.tab)}
            className="rounded-2xl bg-white p-5 text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron/10 text-saffron">
              <c.icon size={17} />
            </span>
            <p className="mt-3 font-display text-2xl font-extrabold text-ink">
              {c.value}
            </p>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-ink-soft">
              {c.label}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-banyan">
              {c.sub} →
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function MembershipCard({ profile, membership }) {
  const { t, locale } = useLang();
  const [qr, setQr] = useState("");
  // Which layout is shown on screen. The print buttons switch it, then print that layout.
  const [orientation, setOrientation] = useState("horizontal"); // 'horizontal' | 'vertical'
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // QR encodes the membership ID so the card can be verified/scanned at events.
  useEffect(() => {
    let alive = true;
    import("qrcode")
      .then((m) =>
        (m.default || m).toDataURL(membership.id, { margin: 1, width: 240 }),
      )
      .then((url) => alive && setQr(url))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [membership.id]);

  // Show the chosen layout first, then open the print dialog (the print stylesheet prints whatever card is on screen).
  const printCard = (o) => {
    setOrientation(o);
    setTimeout(() => window.print(), 250);
  };

  const card = { profile, membership, qr, t, locale };
  const printBtn =
    "inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink";
  const tab = (active) =>
    `rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors ${
      active ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
    }`;

  return (
    <div>
      {/* Preview switch */}
      {/* <div className="mb-4 inline-flex gap-1 rounded-full bg-white p-1 shadow-card">
        <button
          type="button"
          onClick={() => setOrientation("horizontal")}
          className={tab(orientation === "horizontal")}
        >
          Horizontal
        </button>
        <button
          type="button"
          onClick={() => setOrientation("vertical")}
          className={tab(orientation === "vertical")}
        >
          Vertical
        </button>
      </div> */}

      <div
        className={orientation === "vertical" ? "mx-auto max-w-[300px]" : ""}
      >
        {orientation === "horizontal" ? (
          <HorizontalCard {...card} />
        ) : (
          <VerticalCard {...card} />
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => printCard("horizontal")}
          className={printBtn}
        >
          <Printer size={15} /> {t("Print Horizontal")}
        </button>
        <button
          type="button"
          onClick={() => printCard("vertical")}
          className={printBtn}
        >
          <Printer size={15} /> {t("Print Vertical")}
        </button>
      </div>
      <p className="mt-2 text-[11px] text-ink-soft/70">
        {t("Prints at ID-card size ({hw} × {hh} mm horizontal, {vw} × {vh} mm vertical). Choose “Save as PDF” in the print window to keep a copy.", {
          hw: CARD_MM.horizontal.w,
          hh: CARD_MM.horizontal.h,
          vw: CARD_MM.vertical.w,
          vh: CARD_MM.vertical.h,
        })}
      </p>

      {/* Print-only copy of the card, placed directly under <body>. The print stylesheet removes everything
          else, so the printout is exactly one card on one page. */}
      {mounted &&
        createPortal(
          <div id="print-root">
            {orientation === "horizontal" ? (
              <HorizontalCard {...card} />
            ) : (
              <VerticalCard {...card} />
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}

/*
 * The two card layouts. All sizes are in `cqw` (1% of the card's own width), so a card looks
 * the same on a phone, on a laptop and on paper - only its width changes.
 * To change a card's printed size, edit CARD_MM here AND the two widths in app/globals.css (#print-root).
 */
const CARD_MM = {
  horizontal: { w: 85.6, h: 54 },
  vertical: { w: 54, h: 85.6 },
};
const cqw = (n) => `${n}cqw`;

function CardShell({ orient, children }) {
  const { w, h } = CARD_MM[orient];
  const horizontal = orient === "horizontal";
  return (
    <div
      className="membership-card-wrap"
      data-orient={orient}
      style={{ containerType: "inline-size" }}
    >
      <div
        data-orient={orient}
        className="membership-card relative overflow-hidden bg-gradient-to-br from-ink via-ink to-banyan text-white shadow-card-hover"
        style={{
          aspectRatio: `${w} / ${h}`,
          borderRadius: cqw(horizontal ? 3.5 : 6),
          lineHeight: 1.15,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 bg-tricolor-thread"
          style={{ height: cqw(horizontal ? 1 : 2) }}
        />
        <div className="absolute -right-[12%] -top-[20%] aspect-square w-[55%] rounded-full bg-saffron/15 blur-3xl" />
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ status, size }) {
  return (
    <span
      className="flex shrink-0 items-center rounded-full bg-white/15 font-bold uppercase tracking-wider text-marigold"
      style={{
        gap: cqw(size * 0.4),
        padding: `${cqw(size * 0.4)} ${cqw(size * 1.1)}`,
        fontSize: cqw(size),
      }}
    >
      <BadgeCheck style={{ width: cqw(size * 1.3), height: cqw(size * 1.3) }} />{" "}
      {status}
    </span>
  );
}

// Horizontal (85.6 x 34 mm): brand + name + IDs on the left, status badge and QR on the right.
function HorizontalCard({ profile, membership, qr, t, locale }) {
  return (
    <CardShell orient="horizontal">
      <div className="absolute inset-0 flex justify-between"
        style={{ padding: `${cqw(8)} ${cqw(4)} ${cqw(8)}`, gap: cqw(3) }}
      >
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex items-center" style={{ gap: cqw(2) }}>
            <Image
              src="/logo.png"
              alt={t(PARTY.fullName)}
              width={70}
              height={70}
              className="shrink-0 rounded-full bg-white object-cover"
              style={{ width: cqw(12), height: cqw(12) }}
            />
            <div className="min-w-0">
              <p
                className="font-display font-extrabold"
                style={{ fontSize: cqw(5) }}
              >
                {PARTY.shortName}
              </p>
              <p
                className="truncate font-semibold uppercase tracking-wider text-white/70"
                style={{ fontSize: cqw(3) }}
              >
                {t(PARTY.fullName)}
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <p
              className="font-bold uppercase text-marigold"
              style={{ fontSize: cqw(1.7), letterSpacing: "0.4em" }}
            >
              {t("Member Card")}
            </p>
            <h3
              className="truncate font-display font-extrabold"
              style={{marginTop: cqw(1) ,fontSize: cqw(5), lineHeight: 1.4 }}
            >
              {profile.name}
            </h3>
            <p
              className="truncate text-white/70"
              style={{ fontSize: cqw(2.6) }}
            >
              {profile.email}
            </p>
          </div>

          <dl className="flex" style={{ gap: cqw(6) }}>
            <div>
              <dt
                className="font-semibold uppercase tracking-wide text-white/50"
                style={{ fontSize: cqw(1.6) }}
              >
                {t("Membership ID")}
              </dt>
              <dd
                className="font-mono font-bold tracking-wider"
                style={{ fontSize: cqw(2.8) }}
              >
                {membership.id}
              </dd>
            </div>
            <div>
              <dt
                className="font-semibold uppercase tracking-wide text-white/50"
                style={{ fontSize: cqw(1.6) }}
              >
                {t("Member Since")}
              </dt>
              <dd className="font-bold" style={{ fontSize: cqw(2.8) }}>
                {fmtDate(membership.since, locale)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-end">
          {/* <StatusBadge status={membership.status} size={1.8} /> */}
          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qr}
              alt={t("Membership QR")}
              className="bg-white"
              style={{
                width: cqw(17),
                height: cqw(17),
                borderRadius: cqw(1.5),
                padding: cqw(1),
              }}
            />
          )}
        </div>
      </div>
    </CardShell>
  );
}
// function HorizontalCard({ profile, membership, qr }) {
//   return (
//     <CardShell orient="horizontal">
//       <div className="absolute inset-0 flex justify-between" style={{ padding: `${cqw(3.6)} ${cqw(4)} ${cqw(3)}`, gap: cqw(3) }}>
//         <div className="flex min-w-0 flex-1 flex-col justify-between">
//           <div className="flex items-center" style={{ gap: cqw(2) }}>
//             <Image
//               src="/logo.png"
//               alt={PARTY.fullName}
//               width={64}
//               height={64}
//               className="shrink-0 rounded-full bg-white object-cover"
//               style={{ width: cqw(8), height: cqw(8) }}
//             />
//             <div className="min-w-0">
//               <p className="font-display font-extrabold" style={{ fontSize: cqw(4.2) }}>{PARTY.shortName}</p>
//               <p className="truncate font-semibold uppercase tracking-wider text-white/70" style={{ fontSize: cqw(1.8) }}>{PARTY.fullName}</p>
//             </div>
//           </div>

//           <div className="min-w-0">
//             <p className="font-bold uppercase text-marigold" style={{ fontSize: cqw(1.7), letterSpacing: '0.2em' }}>Member Card</p>
//             <h3 className="truncate font-display font-extrabold" style={{ fontSize: cqw(5.6), lineHeight: 1.1 }}>{profile.name}</h3>
//             <p className="truncate text-white/70" style={{ fontSize: cqw(2.4) }}>{profile.email}</p>
//           </div>

//           <dl className="flex" style={{ gap: cqw(6) }}>
//             <div>
//               <dt className="font-semibold uppercase tracking-wide text-white/50" style={{ fontSize: cqw(1.6) }}>Membership ID</dt>
//               <dd className="font-mono font-bold tracking-wider" style={{ fontSize: cqw(2.8) }}>{membership.id}</dd>
//             </div>
//             <div>
//               <dt className="font-semibold uppercase tracking-wide text-white/50" style={{ fontSize: cqw(1.6) }}>Member Since</dt>
//               <dd className="font-bold" style={{ fontSize: cqw(2.8) }}>{fmtDate(membership.since)}</dd>
//             </div>
//           </dl>
//         </div>

//         <div className="flex shrink-0 flex-col items-end justify-between">
//           <StatusBadge status={membership.status} size={1.8} />
//           {qr && (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img src={qr} alt="Membership QR" className="bg-white" style={{ width: cqw(17), height: cqw(17), borderRadius: cqw(1.5), padding: cqw(1) }} />
//           )}
//         </div>
//       </div>
//     </CardShell>
//   );
// }

// Vertical (54 x 85.6 mm): everything centred, QR at the bottom.
function VerticalCard({ profile, membership, qr, t, locale }) {
  return (
    <CardShell orient="vertical">
      <div
        className="absolute inset-0 flex flex-col items-center text-center"
        style={{ padding: `${cqw(9)} ${cqw(6)} ${cqw(6)}` }}
      >
        <Image
          src="/logo.png"
          alt={t(PARTY.fullName)}
          width={96}
          height={96}
          className="rounded-full bg-white object-cover"
          style={{ width: cqw(20), height: cqw(20) }}
        />
        <p
          className="font-display font-extrabold"
          style={{ fontSize: cqw(9), marginTop: cqw(5) }}
        >
          {PARTY.shortName}
        </p>
        <p
          className="font-semibold uppercase tracking-wider text-white/70"
          style={{ marginTop: cqw(2), fontSize: cqw(4) }}
        >
          {t(PARTY.fullName)}
        </p>

        {/* <div style={{ marginTop: cqw(5) }}>
          <StatusBadge status={membership.status} size={2.8} />
        </div> */}

        <p
          className="font-bold uppercase text-marigold"
          style={{
            fontSize: cqw(4),
            letterSpacing: "0.3em",
            marginTop: cqw(8),
          }}
        >
          {t("Member Card")}
        </p>
        <h3
          className="w-full break-words font-display font-extrabold"
          style={{ marginTop: cqw(2), fontSize: cqw(9), lineHeight: 1.1 }}
        >
          {profile.name}
        </h3>
        <p
          className="w-full truncate text-white/70"
          style={{ fontSize: cqw(3.2), marginTop: cqw(0.5) }}
        >
          {profile.email}
        </p>

        <dl style={{ marginTop: cqw(5) }}>
          <dt
            className="font-semibold uppercase tracking-wide text-white/50"
            style={{ fontSize: cqw(4) }}
          >
            {t("Membership ID")}
          </dt>
          <dd
            className="font-mono font-bold tracking-wider"
            style={{ fontSize: cqw(6) }}
          >
            {membership.id}
          </dd>
          <dt
            className="font-semibold uppercase tracking-wide text-white/50"
            style={{ fontSize: cqw(4), marginTop: cqw(5) }}
          >
            {t("Member Since")}
          </dt>
          <dd className="font-bold" style={{ fontSize: cqw(3.8) }}>
            {fmtDate(membership.since, locale)}
          </dd>
        </dl>

        {qr && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qr}
            alt={t("Membership QR")}
            className="mt-auto bg-white"
            style={{
              width: cqw(30),
              height: cqw(30),
              borderRadius: cqw(3),
              padding: cqw(1.8),
            }}
          />
        )}
      </div>
    </CardShell>
  );
}

/* ------------------------------------------------------------------ */
/* Profile (view + edit)                                               */
/* ------------------------------------------------------------------ */
function Profile({ profile, onSaved }) {
  const { t, locale } = useLang();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Could not save");
      await onSaved();
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const rows = [
    ["First Name", profile.firstName],
    ["Last Name", profile.lastName],
    ["Email", profile.email],
    ["Phone", profile.phone],
    ["City", profile.city],
    ["State", profile.state],
    ["Address", profile.address],
    ["Joined On", fmtDate(profile.joinedAt, locale)],
  ];

  const input =
    "w-full rounded-xl border-2 border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-saffron";

  return (
    <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-extrabold text-ink">
          {t("My Profile")}
        </h2>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setForm(profile);
              setEditing(true);
            }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:border-saffron hover:text-saffron"
          >
            <Pencil size={14} /> {t("Edit")}
          </button>
        )}
      </div>

      {saved && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-banyan/10 px-4 py-2.5 text-sm font-semibold text-banyan">
          <CheckCircle2 size={16} /> {t("Profile updated.")}
        </p>
      )}

      {!editing ? (
        <dl className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k} className="border-b border-ink/8 pb-3">
              <dt className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/70">
                {t(k)}
              </dt>
              <dd className="mt-1 break-words text-sm font-semibold text-ink">
                {v || "—"}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <form onSubmit={save} className="mt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label={t("First Name")}>
              <input
                className={input}
                value={form.firstName || ""}
                onChange={set("firstName")}
                required
              />
            </Field>
            <Field label={t("Last Name")}>
              <input
                className={input}
                value={form.lastName || ""}
                onChange={set("lastName")}
                required
              />
            </Field>
            <Field label={t("Email (cannot be changed)")}>
              <input
                className={`${input} cursor-not-allowed opacity-60`}
                value={form.email}
                disabled
              />
            </Field>
            <Field label={t("Phone")}>
              <input
                className={input}
                value={form.phone}
                onChange={set("phone")}
                type="tel"
              />
            </Field>
            <Field label={t("City")}>
              <input
                className={input}
                value={form.city}
                onChange={set("city")}
              />
            </Field>
            <Field label={t("State")}>
              <input
                className={input}
                value={form.state}
                onChange={set("state")}
              />
            </Field>
            <Field label={t("Address")}>
              <input
                className={input}
                value={form.address}
                onChange={set("address")}
              />
            </Field>
          </div>

          {error && (
            <p className="mt-4 text-sm font-semibold text-saffron-dark">
              {t(error)}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-banyan px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-banyan-dark disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}{" "}
              {t("Save")}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
            >
              <X size={15} /> {t("Cancel")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Lists                                                               */
/* ------------------------------------------------------------------ */
function Panel({ title, summary, action, children }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-extrabold text-ink">
            {title}
          </h2>
          {summary && <p className="mt-1 text-sm text-ink-soft">{summary}</p>}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Empty({ text, href, cta }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-ink/10 py-12 text-center">
      <p className="text-sm text-ink-soft">{text}</p>
      <Link
        href={href}
        className="mt-4 inline-block rounded-full bg-saffron px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-saffron-dark"
      >
        {cta}
      </Link>
    </div>
  );
}

function ActionLink({ href, children }) {
  return (
    <Link
      href={href}
      className="rounded-full bg-saffron px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-saffron-dark"
    >
      {children}
    </Link>
  );
}

function Messages({ items, stats }) {
  const { t, locale } = useLang();
  const badge = {
    complaint: "bg-saffron/10 text-saffron-dark",
    query: "bg-chakra/10 text-chakra",
    suggestion: "bg-banyan/10 text-banyan",
  };

  return (
    <Panel
      title={t("Complaints & Queries")}
      summary={t("{complaints} complaint(s) · {queries} other message(s)", { complaints: stats.complaintCount, queries: stats.queryCount })}
      action={<ActionLink href="/contact">{t("Raise New")}</ActionLink>}
    >
      {items.length === 0 ? (
        <Empty
          text={t("You haven't sent any complaint or query yet.")}
          href="/contact"
          cta={t("Contact Us")}
        />
      ) : (
        <ul className="space-y-4">
          {items.map((m) => {
            const type = (m.type || "Query").toLowerCase();
            return (
              <li key={m.id} className="rounded-2xl border border-ink/8 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${badge[type] || badge.query}`}
                  >
                    {t(m.type || "Query")}
                  </span>
                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                      m.read
                        ? "bg-banyan/10 text-banyan"
                        : "bg-marigold/20 text-ink-soft"
                    }`}
                  >
                    {m.read ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {m.read ? t("Seen by team") : t("Pending")}
                  </span>
                  <span className="ml-auto text-xs font-semibold text-ink-soft/70">
                    {fmtDate(m.submittedAt, locale)}
                  </span>
                </div>
                {m.subject && (
                  <h3 className="mt-3 font-display text-base font-bold text-ink">
                    {m.subject}
                  </h3>
                )}
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                  {m.message}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

function Tickets({ items }) {
  const { t, locale } = useLang();
  return (
    <Panel
      title={t("My Tickets")}
      summary={t("{count} problem(s) reported through the Youth / Women Wing help desk", { count: items.length })}
      action={<ActionLink href="/report-problem">{t("Report a Problem")}</ActionLink>}
    >
      {items.length === 0 ? (
        <Empty
          text={t("You haven't reported any problem while logged in.")}
          href="/report-problem"
          cta={t("Report Your Problem")}
        />
      ) : (
        <ul className="space-y-4">
          {items.map((tk) => (
            <li key={tk.id} className="rounded-2xl border border-ink/8 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold tracking-wider text-ink">
                  {tk.ticketId}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${tk.status === "Resolved" ? "bg-banyan/10 text-banyan" : "bg-saffron/10 text-saffron-dark"}`}
                >
                  {t(tk.status)}
                </span>
                <span className="ml-auto text-xs font-semibold text-ink-soft/70">
                  {fmtDate(tk.submittedAt, locale)}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                {t(tk.category)}
                {tk.district ? ` · ${tk.district}` : ""}
              </p>
              <Link
                href="/track"
                className="mt-2 inline-block text-xs font-bold uppercase tracking-wide text-saffron hover:underline"
              >
                {t("Full status →")}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function Contributions({ items, stats }) {
  const { t, locale } = useLang();
  return (
    <Panel
      title={t("My Contributions")}
      summary={t("Total contributed: {amount} across {count} contribution(s)", { amount: fmtMoney(stats.totalContributed, locale), count: stats.contributionCount })}
      action={<ActionLink href="/donate">{t("Contribute")}</ActionLink>}
    >
      {items.length === 0 ? (
        <Empty
          text={t("You haven't made any contribution yet.")}
          href="/donate"
          cta={t("Contribute Now")}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-[11px] font-bold uppercase tracking-wide text-ink-soft/70">
                <th className="py-3 pr-4">{t("Date")}</th>
                <th className="py-3 pr-4">{t("Amount")}</th>
                <th className="py-3">{t("Method")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-ink/5 last:border-none"
                >
                  <td className="py-3 pr-4 font-semibold text-ink-soft">
                    {fmtDate(c.submittedAt, locale)}
                  </td>
                  <td className="py-3 pr-4 font-bold text-banyan">
                    {fmtMoney(c.amount, locale)}
                  </td>
                  <td className="py-3 font-semibold uppercase text-ink-soft">
                    {c.method || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function Volunteers({ items }) {
  const { t, locale } = useLang();
  return (
    <Panel
      title={t("Volunteer Applications")}
      summary={
        items.length ? t("{count} application(s) submitted", { count: items.length }) : undefined
      }
      action={<ActionLink href="/volunteer">{t("Join as Volunteer")}</ActionLink>}
    >
      {items.length === 0 ? (
        <Empty
          text={t("You haven't applied as a volunteer yet.")}
          href="/volunteer"
          cta={t("Volunteer Form")}
        />
      ) : (
        <ul className="space-y-4">
          {items.map((v) => (
            <li key={v.id} className="rounded-2xl border border-ink/8 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-base font-bold text-ink">
                  {v.constituency || t("Constituency not specified")}
                </p>
                <span className="text-xs font-semibold text-ink-soft/70">
                  {fmtDate(v.submittedAt, locale)}
                </span>
              </div>
              {v.interests?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {v.interests.map((i) => (
                    <span
                      key={i}
                      className="rounded-full bg-banyan/10 px-3 py-1 text-[11px] font-bold text-banyan"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              )}
              {v.message && (
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {v.message}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
