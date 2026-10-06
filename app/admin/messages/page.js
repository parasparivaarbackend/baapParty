// 'use client';

// import { useEffect, useState } from 'react';
// import { MessageSquare, Trash2, Mail, MailOpen } from 'lucide-react';
// import { Modal, ConfirmDialog, PageHeader, EmptyState, Badge, Button } from '@/components/admin/ui';

// const formatDateTime = (d) =>
//   new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// export default function AdminMessagesPage() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewing, setViewing] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleting, setDeleting] = useState(false);

//   const load = () => {
//     setLoading(true);
//     fetch('/api/messages')
//       .then((r) => r.json())
//       .then((data) => {
//         setMessages(Array.isArray(data) ? data : []);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const openMessage = async (msg) => {
//     setViewing(msg);
//     if (!msg.read) {
//       setMessages((list) => list.map((m) => (m.id === msg.id ? { ...m, read: true } : m)));
//       try {
//         await fetch(`/api/messages/${msg.id}`, {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ read: true }),
//         });
//       } catch {
//         // non-fatal — local state already reflects it, next load() will reconcile
//       }
//     }
//   };

//   const toggleRead = async (msg) => {
//     const nextRead = !msg.read;
//     setMessages((list) => list.map((m) => (m.id === msg.id ? { ...m, read: nextRead } : m)));
//     try {
//       await fetch(`/api/messages/${msg.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ read: nextRead }),
//       });
//     } catch {
//       load();
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteTarget) return;
//     setDeleting(true);
//     try {
//       await fetch(`/api/messages/${deleteTarget.id}`, { method: 'DELETE' });
//       setDeleteTarget(null);
//       setViewing(null);
//       load();
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const unreadCount = messages.filter((m) => !m.read).length;

//   return (
//     <>
//       <PageHeader
//         title="Messages"
//         subtitle={`Contact form submissions${unreadCount ? ` — ${unreadCount} unread` : ''}.`}
//       />

//       {loading ? (
//         <p className="text-sm text-ink-soft">Loading...</p>
//       ) : messages.length === 0 ? (
//         <EmptyState icon={MessageSquare} title="No messages yet" description="They'll show up here as soon as someone submits the Contact form on the site." />
//       ) : (
//         <div className="divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-card">
//           {messages.map((m) => (
//             <button
//               key={m.id}
//               onClick={() => openMessage(m)}
//               className={`flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-ivory/40 ${!m.read ? 'bg-saffron/5' : ''}`}
//             >
//               <span className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${!m.read ? 'bg-saffron/15 text-saffron-dark' : 'bg-ink/5 text-ink-soft'}`}>
//                 {m.read ? <MailOpen size={16} /> : <Mail size={16} />}
//               </span>
//               <span className="min-w-0 flex-1">
//                 <span className="flex flex-wrap items-center gap-2">
//                   <span className={`text-sm ${!m.read ? 'font-extrabold text-ink' : 'font-semibold text-ink-soft'}`}>{m.name}</span>
//                   {!m.read && <Badge tone="saffron">New</Badge>}
//                   <span className="ml-auto flex-shrink-0 text-xs text-ink-soft/70">{formatDateTime(m.submittedAt)}</span>
//                 </span>
//                 <span className="mt-0.5 block truncate text-sm text-ink-soft">{m.subject || '(No subject)'}</span>
//                 <span className="mt-0.5 block truncate text-xs text-ink-soft/70">{m.message}</span>
//               </span>
//             </button>
//           ))}
//         </div>
//       )}

//       <Modal open={!!viewing} onClose={() => setViewing(null)} title="Message" maxWidth="max-w-lg">
//         {viewing && (
//           <div className="space-y-4 text-sm">
//             <Detail label="From" value={`${viewing.name} <${viewing.email}>`} />
//             <Detail label="Subject" value={viewing.subject || '(No subject)'} />
//             <div>
//               <p className="text-xs font-bold uppercase tracking-wide text-ink-soft/70">Message</p>
//               <p className="mt-1 whitespace-pre-wrap text-ink">{viewing.message}</p>
//             </div>
//             <Detail label="Received" value={formatDateTime(viewing.submittedAt)} />
//             <div className="flex flex-wrap justify-between gap-3 border-t border-ink/8 pt-4">
//               <Button variant="secondary" onClick={() => toggleRead(viewing)}>
//                 Mark as {viewing.read ? 'Unread' : 'Read'}
//               </Button>
//               <Button variant="danger" onClick={() => setDeleteTarget(viewing)}>
//                 <Trash2 size={15} /> Delete
//               </Button>
//             </div>
//           </div>
//         )}
//       </Modal>

//       <ConfirmDialog
//         open={!!deleteTarget}
//         onClose={() => setDeleteTarget(null)}
//         onConfirm={handleDelete}
//         loading={deleting}
//         title="Delete this message?"
//         description={deleteTarget ? `The message from ${deleteTarget.name} will be permanently removed.` : ''}
//       />
//     </>
//   );
// }

// function Detail({ label, value }) {
//   return (
//     <div>
//       <p className="text-xs font-bold uppercase tracking-wide text-ink-soft/70">{label}</p>
//       <p className="mt-1 text-ink">{value}</p>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Trash2, Download, Mail, MailOpen } from "lucide-react";
import * as XLSX from "xlsx";
import {
  Modal,
  ConfirmDialog,
  PageHeader,
  EmptyState,
  Badge,
  Button,
} from "@/components/admin/ui";

const formatDateTime = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const TYPES = ["Complaint", "Query", "Suggestion"];
const TYPE_TONE = { Complaint: "saffron", Query: "ink", Suggestion: "banyan" };
// Old messages (before types existed) have no `type` -> treat as Query
const typeOf = (m) => (TYPES.includes(m?.type) ? m.type : "Query");

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All"); // All | Complaint | Query | Suggestion

  const load = () => {
    setLoading(true);
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openMessage = async (msg) => {
    setViewing(msg);
    if (!msg.read) {
      setMessages((list) =>
        list.map((m) => (m.id === msg.id ? { ...m, read: true } : m)),
      );
      try {
        await fetch(`/api/messages/${msg.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        });
      } catch {
        // non-fatal — local state already reflects it, next load() will reconcile
      }
    }
  };

  const toggleRead = async (msg) => {
    const nextRead = !msg.read;
    setMessages((list) =>
      list.map((m) => (m.id === msg.id ? { ...m, read: nextRead } : m)),
    );
    try {
      await fetch(`/api/messages/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: nextRead }),
      });
    } catch {
      load();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/messages/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      setViewing(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    if (!visible.length) return;

    const exportData = visible.map((m) => ({
      Type: typeOf(m),
      Name: m.name || "",
      Email: m.email || "",
      Subject: m.subject || "(No subject)",
      Message: m.message || "",
      "Submitted At": m.submittedAt ? formatDateTime(m.submittedAt) : "",
      Status: m.read ? "Read" : "Unread",
      "Message ID": m.id || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Messages");

    // Set readable column widths
    worksheet["!cols"] = [
      { wch: 14 }, // Type
      { wch: 25 }, // Name
      { wch: 32 }, // Email
      { wch: 30 }, // Subject
      { wch: 70 }, // Message
      { wch: 24 }, // Submitted At
      { wch: 12 }, // Status
      { wch: 30 }, // Message ID
    ];

    XLSX.writeFile(
      workbook,
      `${typeFilter === "All" ? "messages" : typeFilter.toLowerCase() + "s"}-${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };


  const unreadCount = messages.filter((m) => !m.read).length;
  const counts = {
    All: messages.length,
    Complaint: messages.filter((m) => typeOf(m) === "Complaint").length,
    Query: messages.filter((m) => typeOf(m) === "Query").length,
    Suggestion: messages.filter((m) => typeOf(m) === "Suggestion").length,
  };
  const unreadByType = (t) => messages.filter((m) => !m.read && typeOf(m) === t).length;
  const visible = typeFilter === "All" ? messages : messages.filter((m) => typeOf(m) === typeFilter);

  return (
    <>
      <PageHeader
        title="Messages"
        subtitle={`Complaints, queries & suggestions from the Contact form${unreadCount ? ` — ${unreadCount} unread` : ""}.`}
        action={
          <button
            type="button"
            onClick={handleExport}
            disabled={!visible.length}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-banyan px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-banyan/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={17} />
            Export Excel
          </button>
        }
      />

      {/* Type tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {[
          { id: "All", label: "All" },
          { id: "Complaint", label: "Complaints" },
          { id: "Query", label: "Queries" },
          { id: "Suggestion", label: "Suggestions" },
        ].map((t) => {
          const unread = t.id === "All" ? unreadCount : unreadByType(t.id);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTypeFilter(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                typeFilter === t.id
                  ? "bg-saffron text-white shadow-card"
                  : "bg-white text-ink-soft hover:text-saffron"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  typeFilter === t.id ? "bg-white/25 text-white" : "bg-ink/8 text-ink"
                }`}
              >
                {counts[t.id]}
              </span>
              {unread > 0 && (
                <span
                  title={`${unread} unread`}
                  className={`h-2 w-2 rounded-full ${typeFilter === t.id ? "bg-white" : "bg-saffron"}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-sm text-ink-soft">Loading...</p>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="They'll show up here as soon as someone submits the Contact form on the site."
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={`No ${typeFilter.toLowerCase()}s yet`}
          description="Nothing in this category right now."
        />
      ) : (
        <div className="divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-card">
          {visible.map((m) => (
            <button
              key={m.id}
              onClick={() => openMessage(m)}
              className={`flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-ivory/40 ${!m.read ? "bg-saffron/5" : ""}`}
            >
              <span
                className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${!m.read ? "bg-saffron/15 text-saffron-dark" : "bg-ink/5 text-ink-soft"}`}
              >
                {m.read ? <MailOpen size={16} /> : <Mail size={16} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm ${!m.read ? "font-extrabold text-ink" : "font-semibold text-ink-soft"}`}
                  >
                    {m.name}
                  </span>
                  <Badge tone={TYPE_TONE[typeOf(m)]}>{typeOf(m)}</Badge>
                  {!m.read && <Badge tone="saffron">New</Badge>}
                  <span className="ml-auto flex-shrink-0 text-xs text-ink-soft/70">
                    {formatDateTime(m.submittedAt)}
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-sm text-ink-soft">
                  {m.subject || "(No subject)"}
                </span>
                <span className="mt-0.5 block truncate text-xs text-ink-soft/70">
                  {m.message}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing ? `${typeOf(viewing)}` : "Message"}
        maxWidth="max-w-lg"
      >
        {viewing && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink-soft/70">Type</p>
              <div className="mt-1">
                <Badge tone={TYPE_TONE[typeOf(viewing)]}>{typeOf(viewing)}</Badge>
              </div>
            </div>
            <Detail label="From" value={`${viewing.name} <${viewing.email}>`} />
            <Detail label="Subject" value={viewing.subject || "(No subject)"} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink-soft/70">
                Message
              </p>
              <p className="mt-1 whitespace-pre-wrap text-ink">
                {viewing.message}
              </p>
            </div>
            <Detail
              label="Received"
              value={formatDateTime(viewing.submittedAt)}
            />
            <div className="flex flex-wrap justify-between gap-3 border-t border-ink/8 pt-4">
              <Button variant="secondary" onClick={() => toggleRead(viewing)}>
                Mark as {viewing.read ? "Unread" : "Read"}
              </Button>
              <Button variant="danger" onClick={() => setDeleteTarget(viewing)}>
                <Trash2 size={15} /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this message?"
        description={
          deleteTarget
            ? `The message from ${deleteTarget.name} will be permanently removed.`
            : ""
        }
      />
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-ink-soft/70">
        {label}
      </p>
      <p className="mt-1 text-ink">{value}</p>
    </div>
  );
}
