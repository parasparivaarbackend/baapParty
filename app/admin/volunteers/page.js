// 'use client';

// import { useEffect, useState } from 'react';
// import { Users, Trash2, Eye } from 'lucide-react';
// import { Modal, ConfirmDialog, PageHeader, EmptyState, Badge } from '@/components/admin/ui';

// const formatDateTime = (d) =>
//   new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// export default function AdminVolunteersPage() {
//   const [volunteers, setVolunteers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewing, setViewing] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleting, setDeleting] = useState(false);

//   const load = () => {
//     setLoading(true);
//     fetch('/api/volunteers')
//       .then((r) => r.json())
//       .then((data) => {
//         setVolunteers(Array.isArray(data) ? data : []);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const handleDelete = async () => {
//     if (!deleteTarget) return;
//     setDeleting(true);
//     try {
//       await fetch(`/api/volunteers/${deleteTarget.id}`, { method: 'DELETE' });
//       setDeleteTarget(null);
//       setViewing(null);
//       load();
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <>
//       <PageHeader title="Volunteers" subtitle="Everyone who has filled in the Volunteer Signup Form on the site." />

//       {loading ? (
//         <p className="text-sm text-ink-soft">Loading...</p>
//       ) : volunteers.length === 0 ? (
//         <EmptyState icon={Users} title="No volunteer submissions yet" description="They'll show up here as soon as someone fills the Volunteer Form on the site." />
//       ) : (
//         <div className="overflow-x-auto rounded-2xl border border-ink/8 bg-white shadow-card">
//           <table className="w-full text-left text-sm">
//             <thead className="border-b border-ink/8 bg-ivory/60 text-xs font-bold uppercase tracking-wide text-ink-soft">
//               <tr>
//                 <th className="px-5 py-3.5">Name</th>
//                 <th className="px-5 py-3.5">Phone</th>
//                 <th className="px-5 py-3.5">Constituency</th>
//                 <th className="px-5 py-3.5">Submitted</th>
//                 <th className="px-5 py-3.5 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-ink/8">
//               {volunteers.map((v) => (
//                 <tr key={v.id} className="hover:bg-ivory/40">
//                   <td className="px-5 py-4 font-semibold text-ink">{v.name}</td>
//                   <td className="px-5 py-4 text-ink-soft">{v.phone}</td>
//                   <td className="px-5 py-4 text-ink-soft">{v.constituency}</td>
//                   <td className="whitespace-nowrap px-5 py-4 text-ink-soft">{formatDateTime(v.submittedAt)}</td>
//                   <td className="px-5 py-4">
//                     <div className="flex justify-end gap-2">
//                       <button
//                         onClick={() => setViewing(v)}
//                         className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
//                       >
//                         <Eye size={16} />
//                       </button>
//                       <button
//                         onClick={() => setDeleteTarget(v)}
//                         className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-saffron/10 hover:text-saffron-dark"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <Modal open={!!viewing} onClose={() => setViewing(null)} title="Volunteer Details" maxWidth="max-w-lg">
//         {viewing && (
//           <div className="space-y-4 text-sm">
//             <Detail label="Full Name" value={viewing.name} />
//             <Detail label="Mobile Number" value={viewing.phone} />
//             <Detail label="Email Address" value={viewing.email} />
//             <Detail label="Constituency / City" value={viewing.constituency} />
//             <div>
//               <p className="text-xs font-bold uppercase tracking-wide text-ink-soft/70">Interested In</p>
//               <div className="mt-1.5 flex flex-wrap gap-1.5">
//                 {(viewing.interests || []).length ? (
//                   viewing.interests.map((i) => (
//                     <Badge key={i} tone="saffron">
//                       {i}
//                     </Badge>
//                   ))
//                 ) : (
//                   <span className="text-ink-soft">—</span>
//                 )}
//               </div>
//             </div>
//             <Detail label="Message" value={viewing.message || '—'} />
//             <Detail label="Submitted" value={formatDateTime(viewing.submittedAt)} />
//           </div>
//         )}
//       </Modal>

//       <ConfirmDialog
//         open={!!deleteTarget}
//         onClose={() => setDeleteTarget(null)}
//         onConfirm={handleDelete}
//         loading={deleting}
//         title="Delete this submission?"
//         description={deleteTarget ? `${deleteTarget.name}'s volunteer submission will be permanently removed.` : ''}
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
import { Users, Trash2, Eye, Download } from "lucide-react";
import * as XLSX from "xlsx";
import {
  Modal,
  ConfirmDialog,
  PageHeader,
  EmptyState,
  Badge,
} from "@/components/admin/ui";

const formatDateTime = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/volunteers")
      .then((r) => r.json())
      .then((data) => {
        setVolunteers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/volunteers/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      setViewing(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

   const handleExport = () => {
      if (!volunteers.length) return;
  
      const exportData = volunteers.map((v) => ({
        Name: v.name || "",
        Phone: v.phone || "",
        Email: v.email || "",
        Constituency: v.constituency || "(No subject)",
        Interests: Array.isArray(v.interests)
          ? v.interests.join(", ")
          : v.interests || "",
        Message: v.message || "",
        "Submitted At": v.submittedAt ? formatDateTime(v.submittedAt) : "",
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
  
      XLSX.utils.book_append_sheet(workbook, worksheet, "volunteers");
  
      // Set readable column widths
      worksheet["!cols"] = [
        { wch: 25 }, // Name
        { wch: 32 }, // Phone
        { wch: 32 }, // Email
        { wch: 30 }, // Constituency
        { wch: 30 }, // Interests
        { wch: 70 }, // Message
        { wch: 24 }, // Submitted At
      ];
  
      XLSX.writeFile(
        workbook,
        `volunteers-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    };

  return (
    <>
      <PageHeader
        title="Volunteers"
        subtitle="Everyone who has filled in the Volunteer Signup Form on the site."
        action={
          <button
            type="button"
            onClick={handleExport}
            disabled={!volunteers.length}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-banyan px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-banyan/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={17} />
            Export Excel
          </button>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-soft">Loading...</p>
      ) : volunteers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No volunteer submissions yet"
          description="They'll show up here as soon as someone fills the Volunteer Form on the site."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/8 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/8 bg-ivory/60 text-xs font-bold uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Constituency</th>
                <th className="px-5 py-3.5">Submitted</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {volunteers.map((v) => (
                <tr key={v.id} className="hover:bg-ivory/40">
                  <td className="px-5 py-4 font-semibold text-ink">{v.name}</td>
                  <td className="px-5 py-4 text-ink-soft">{v.phone}</td>
                  <td className="px-5 py-4 text-ink-soft">{v.constituency}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-ink-soft">
                    {formatDateTime(v.submittedAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setViewing(v)}
                        className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(v)}
                        className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-saffron/10 hover:text-saffron-dark"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="Volunteer Details"
        maxWidth="max-w-lg"
      >
        {viewing && (
          <div className="space-y-4 text-sm">
            <Detail label="Full Name" value={viewing.name} />
            <Detail label="Mobile Number" value={viewing.phone} />
            <Detail label="Email Address" value={viewing.email} />
            <Detail label="Constituency / City" value={viewing.constituency} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink-soft/70">
                Interested In
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {(viewing.interests || []).length ? (
                  viewing.interests.map((i) => (
                    <Badge key={i} tone="saffron">
                      {i}
                    </Badge>
                  ))
                ) : (
                  <span className="text-ink-soft">—</span>
                )}
              </div>
            </div>
            <Detail label="Message" value={viewing.message || "—"} />
            <Detail
              label="Submitted"
              value={formatDateTime(viewing.submittedAt)}
            />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this submission?"
        description={
          deleteTarget
            ? `${deleteTarget.name}'s volunteer submission will be permanently removed.`
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
