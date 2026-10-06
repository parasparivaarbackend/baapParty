// 'use client';

// import { useEffect, useState } from 'react';
// import { HandCoins, IndianRupee, Trash2 } from 'lucide-react';
// import { ConfirmDialog, PageHeader, EmptyState, Badge } from '@/components/admin/ui';

// const formatDateTime = (d) =>
//   new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// const METHOD_LABEL = { upi: 'UPI', card: 'Card', netbanking: 'Net Banking' };

// export default function AdminContributionsPage() {
//   const [contributions, setContributions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleting, setDeleting] = useState(false);

//   const load = () => {
//     setLoading(true);
//     fetch('/api/contributions')
//       .then((r) => r.json())
//       .then((data) => {
//         setContributions(Array.isArray(data) ? data : []);
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
//       await fetch(`/api/contributions/${deleteTarget.id}`, { method: 'DELETE' });
//       setDeleteTarget(null);
//       load();
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const total = contributions.reduce((sum, c) => sum + Number(c.amount || 0), 0);

//   return (
//     <>
//       <PageHeader title="Contributions" subtitle="Every pledge made through the Contribution form on the site." />

//       <div className="mb-6 flex items-center gap-4 rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
//         <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-marigold/15 text-marigold">
//           <IndianRupee size={20} />
//         </span>
//         <div>
//           <p className="text-2xl font-extrabold text-ink">₹{total.toLocaleString('en-IN')}</p>
//           <p className="text-sm font-semibold text-ink-soft">
//             Total pledged across {contributions.length} contribution{contributions.length === 1 ? '' : 's'}
//           </p>
//         </div>
//       </div>

//       {loading ? (
//         <p className="text-sm text-ink-soft">Loading...</p>
//       ) : contributions.length === 0 ? (
//         <EmptyState icon={HandCoins} title="No contributions yet" description="They'll show up here as soon as someone pledges through the Contribution form." />
//       ) : (
//         <div className="overflow-x-auto rounded-2xl border border-ink/8 bg-white shadow-card">
//           <table className="w-full text-left text-sm">
//             <thead className="border-b border-ink/8 bg-ivory/60 text-xs font-bold uppercase tracking-wide text-ink-soft">
//               <tr>
//                 <th className="px-5 py-3.5">Name</th>
//                 <th className="px-5 py-3.5">Amount</th>
//                 <th className="px-5 py-3.5">Method</th>
//                 <th className="px-5 py-3.5">Submitted</th>
//                 <th className="px-5 py-3.5 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-ink/8">
//               {contributions.map((c) => (
//                 <tr key={c.id} className="hover:bg-ivory/40">
//                   <td className="px-5 py-4 font-semibold text-ink">{c.name}</td>
//                   <td className="px-5 py-4 font-bold text-banyan">₹{Number(c.amount || 0).toLocaleString('en-IN')}</td>
//                   <td className="px-5 py-4">
//                     <Badge tone="ink">{METHOD_LABEL[c.method] || c.method}</Badge>
//                   </td>
//                   <td className="whitespace-nowrap px-5 py-4 text-ink-soft">{formatDateTime(c.submittedAt)}</td>
//                   <td className="px-5 py-4">
//                     <div className="flex justify-end">
//                       <button
//                         onClick={() => setDeleteTarget(c)}
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

//       <ConfirmDialog
//         open={!!deleteTarget}
//         onClose={() => setDeleteTarget(null)}
//         onConfirm={handleDelete}
//         loading={deleting}
//         title="Delete this contribution?"
//         description={deleteTarget ? `${deleteTarget.name}'s pledge of ₹${Number(deleteTarget.amount || 0).toLocaleString('en-IN')} will be permanently removed.` : ''}
//       />
//     </>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { HandCoins, IndianRupee, Trash2, Eye, Download, Printer, } from "lucide-react";
import * as XLSX from "xlsx";
import {
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

const METHOD_LABEL = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net Banking",
};

export default function AdminContributionsPage() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);

    fetch("/api/contributions")
      .then((r) => r.json())
      .then((data) => {
        setContributions(Array.isArray(data) ? data : []);
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
      await fetch(`/api/contributions/${deleteTarget.id}`, {
        method: "DELETE",
      });

      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };


  const handleExport = () => {
    if (!contributions.length) return;

    const exportData = contributions.map((c) => ({
      Name: c.name || "",
      Amount: Number(c.amount || 0),
      "Payment Method": METHOD_LABEL[c.method] || c.method || "",
      "Transaction ID":
        c.transactionId || c.transaction_id || c.paymentId || c.id || "",
      Submitted: c.submittedAt ? formatDateTime(c.submittedAt) : "",
      Email: c.email || "",
      Phone: c.phone || "",
      Status: c.status || "",
      Message: c.message || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Contributions");

    // Make columns readable
    worksheet["!cols"] = [
      { wch: 25 }, // Name
      { wch: 14 }, // Amount
      { wch: 18 }, // Method
      { wch: 30 }, // Transaction ID
      { wch: 24 }, // Submitted
      { wch: 30 }, // Email
      { wch: 18 }, // Phone
      { wch: 15 }, // Status
      { wch: 40 }, // Message
    ];

    XLSX.writeFile(
      workbook,
      `contributions-${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };


  const total = contributions.reduce(
    (sum, c) => sum + Number(c.amount || 0),
    0,
  );

  return (
    <>
      <PageHeader
        title="Contributions"
        subtitle="Every pledge made through the Contribution form on the site."
      />

      {/* <div className="mb-6 flex items-center gap-4 rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-marigold/15 text-marigold">
          <IndianRupee size={20} />
        </span>

        <div>
          <p className="text-2xl font-extrabold text-ink">
            ₹{total.toLocaleString("en-IN")}
          </p>

          <p className="text-sm font-semibold text-ink-soft">
            Total pledged across {contributions.length} contribution
            {contributions.length === 1 ? "" : "s"}
          </p>
        </div>
      </div> */}

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-ink/8 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-marigold/15 text-marigold">
            <IndianRupee size={20} />
          </span>

          <div>
            <p className="text-2xl font-extrabold text-ink">
              ₹{total.toLocaleString("en-IN")}
            </p>

            <p className="text-sm font-semibold text-ink-soft">
              Total pledged across {contributions.length} contribution
              {contributions.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={!contributions.length}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-banyan px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-banyan/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={17} />
          Export Excel
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-ink-soft">Loading...</p>
      ) : contributions.length === 0 ? (
        <EmptyState
          icon={HandCoins}
          title="No contributions yet"
          description="They'll show up here as soon as someone pledges through the Contribution form."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/8 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/8 bg-ivory/60 text-xs font-bold uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Method</th>
                <th className="px-5 py-3.5">Submitted</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-ink/8">
              {contributions.map((c) => (
                <tr key={c.id} className="hover:bg-ivory/40">
                  <td className="px-5 py-4 font-semibold text-ink">{c.name}</td>

                  <td className="px-5 py-4 font-bold text-banyan">
                    ₹{Number(c.amount || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4">
                    <Badge tone="ink">
                      {METHOD_LABEL[c.method] || c.method}
                    </Badge>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-ink-soft">
                    {formatDateTime(c.submittedAt)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      {/* View Details */}
                      <button
                        type="button"
                        onClick={() => setViewTarget(c)}
                        title="View contribution details"
                        className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-banyan/10 hover:text-banyan"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(c)}
                        title="Delete contribution"
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

      {/* View Details Modal */}
      {viewTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setViewTarget(null)}
        >
          <div
            className="contribution-modal w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
              <div>
                <h2 className="text-xl font-extrabold text-ink">
                  Contribution Details
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Complete details of this pledge
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-ivory hover:text-ink"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </div>

            {/* Details */}
            <div className="space-y-4 p-6">
              <div className="rounded-xl bg-ivory/60 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                  Amount
                </p>
                <p className="mt-1 text-2xl font-extrabold text-banyan">
                  ₹{Number(viewTarget.amount || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                    Name
                  </p>
                  <p className="mt-1 font-semibold text-ink">
                    {viewTarget.name || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                    Payment Method
                  </p>
                  <div className="mt-1">
                    <Badge tone="ink">
                      {METHOD_LABEL[viewTarget.method] ||
                        viewTarget.method ||
                        "—"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                    Submitted
                  </p>
                  <p className="mt-1 font-semibold text-ink">
                    {viewTarget.submittedAt
                      ? formatDateTime(viewTarget.submittedAt)
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                    Transaction ID
                  </p>
                  <p className="mt-1 break-all font-mono text-sm font-semibold text-ink">
                    {viewTarget.transactionId ||
                      viewTarget.transaction_id ||
                      viewTarget.paymentId ||
                      viewTarget.id ||
                      "—"}
                  </p>
                </div>
              </div>

              {/* Show any other common payment fields if they exist */}
              {(viewTarget.email ||
                viewTarget.phone ||
                viewTarget.message ||
                viewTarget.status) && (
                <div className="border-t border-ink/8 pt-4">
                  <div className="space-y-3">
                    {viewTarget.email && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                          Email
                        </p>
                        <p className="mt-1 text-sm font-semibold text-ink">
                          {viewTarget.email}
                        </p>
                      </div>
                    )}

                    {viewTarget.phone && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                          Phone
                        </p>
                        <p className="mt-1 text-sm font-semibold text-ink">
                          {viewTarget.phone}
                        </p>
                      </div>
                    )}

                    {viewTarget.status && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                          Status
                        </p>
                        <p className="mt-1 text-sm font-semibold text-ink">
                          {viewTarget.status}
                        </p>
                      </div>
                    )}

                    {viewTarget.message && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                          Message
                        </p>
                        <p className="mt-1 text-sm text-ink">
                          {viewTarget.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-ink/8 px-6 py-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-ivory"
              >
                <Printer size={17} />
                Print Receipt
              </button>

              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-ink/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this contribution?"
        description={
          deleteTarget
            ? `${deleteTarget.name}'s pledge of ₹${Number(
                deleteTarget.amount || 0,
              ).toLocaleString("en-IN")} will be permanently removed.`
            : ""
        }
      />
    </>
  );
}
